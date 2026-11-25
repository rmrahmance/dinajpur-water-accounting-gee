"""
==============================================================================
WaPOR crop-yield estimation — Dinajpur, Bangladesh  (Boro rice)
------------------------------------------------------------------------------
Steps:
  1. Download WaPOR v3 NPP (global 300 m) for the growing season.
  2. Accumulate NPP over the season  -> seasonal NPP (gC/m2).
  3. NPP -> Above-Ground Biomass (Eq.1) -> Crop yield (Eq.2)  [FAO, 2020].
  4. Save seasonal-NPP and yield GeoTIFFs; print the field-average yield.

Run from a terminal:
    pip install wapordl rasterio numpy
    python wapor_crop_yield.py
==============================================================================
"""

import os
import numpy as np
import rasterio
from wapordl import wapor_map

# ----------------------------------------------------------------------------
# 1. DOWNLOAD SETTINGS  (edit these)
# ----------------------------------------------------------------------------
REGION   = [88.0, 25.1, 89.3, 26.2]          # Dinajpur bbox [xmin,ymin,xmax,ymax]
VARIABLE = "L1-NPP-M"                          # monthly NPP, global 300 m (v3)
PERIOD   = ["2023-01-01", "2023-05-31"]        # Boro rice season (year >= 2018)
FOLDER   = "./wapor_npp"

# ----------------------------------------------------------------------------
# 2. CROP PARAMETERS — Boro rice (C3 cereal). Adjust from literature & justify.
# ----------------------------------------------------------------------------
AOT  = 0.85    # above-ground / total biomass ratio (0.80-0.90)
LUEc = 0.70    # light-use-efficiency correction (C3: 0.6-0.9)
HI   = 0.45    # harvest index (cereals 0.3-0.5)
MC   = 0.14    # moisture content of harvested grain (rice ~0.14)
SCALE_22 = 22.222   # FAO factor: gC/m2 -> kg dry-matter/ha
NPP_SCALE = 0.001   # WaPOR v3 scale factor of L1-NPP-M (stored integer -> gC/m2/month)

# ----------------------------------------------------------------------------
# 3. DOWNLOAD NPP  (one GeoTIFF, one band per month)
# ----------------------------------------------------------------------------
os.makedirs(FOLDER, exist_ok=True)
print("Downloading WaPOR NPP ...")
npp_file = wapor_map(REGION, VARIABLE, PERIOD, FOLDER)
print("NPP file:", npp_file)

# ----------------------------------------------------------------------------
# 4. ACCUMULATE NPP OVER THE SEASON  -> gC/m2
#    L1-NPP-M pixel = NPP of that month (gC/m2/month), stored as integer.
#    Seasonal NPP (gC/m2) = sum over the months. PERIOD must cover full months.
# ----------------------------------------------------------------------------
y0, m0 = (int(v) for v in PERIOD[0].split("-")[:2])
y1, m1 = (int(v) for v in PERIOD[1].split("-")[:2])
n_months = (y1 - y0) * 12 + (m1 - m0) + 1

with rasterio.open(npp_file) as src:
    if src.count != n_months:
        raise SystemExit("Expected %d monthly bands, found %d" % (n_months, src.count))
    profile = src.profile.copy()
    stack = src.read(masked=True).astype("float32").filled(np.nan)   # (months, rows, cols)
    for k, (scale, offset) in enumerate(zip(src.scales, src.offsets)):
        if scale == 1.0 and np.issubdtype(np.dtype(src.dtypes[k]), np.integer):
            scale = NPP_SCALE                # scale factor missing in the file
        stack[k] = stack[k] * scale + offset

stack[stack < 0] = np.nan                    # mask any remaining fill values
print("Months summed: %d" % n_months)

npp_seasonal = stack.sum(axis=0)             # gC/m2; a pixel with a missing month stays empty

# ----------------------------------------------------------------------------
# 5. YIELD EQUATIONS (FAO, 2020)
#    AGB  = AOT * 22.222 * LUEc * NPP_seasonal        [kg dry-matter / ha]
#    Yield = AGB * HI / (1 - MC)                       [kg fresh / ha]
# ----------------------------------------------------------------------------
agb        = AOT * SCALE_22 * LUEc * npp_seasonal        # kg DM/ha
yield_kgha = agb * HI / (1.0 - MC)                       # kg/ha
yield_tha  = yield_kgha / 1000.0                         # ton/ha

# ----------------------------------------------------------------------------
# 6. SAVE OUTPUTS + REPORT
# ----------------------------------------------------------------------------
profile.update(dtype="float32", count=1, nodata=np.nan)

def save(path, data):
    with rasterio.open(path, "w", **profile) as dst:
        dst.write(data.astype("float32"), 1)
    print("Saved", path)

save("NPP_seasonal_gC_m2.tif", npp_seasonal)
save("CropYield_ton_ha.tif",   yield_tha)

print("\n===== RESULTS (Boro rice, Dinajpur) =====")
print("Mean seasonal NPP : %.1f gC/m2" % np.nanmean(npp_seasonal))
print("Mean yield        : %.2f ton/ha" % np.nanmean(yield_tha))
print("Min / Max yield   : %.2f / %.2f ton/ha"
      % (np.nanmin(yield_tha), np.nanmax(yield_tha)))
print("Compare with BBS/FAOSTAT Boro rice (~3-4 t/ha) and yieldgap.org.")
