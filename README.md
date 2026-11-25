# Water accounting inputs for Dinajpur, northwest Bangladesh (Google Earth Engine and WaPOR)

These are scripts I wrote to gather open Earth observation data for a water accounting and irrigation planning study in Mohanpur Union (Birganj, Dinajpur), an area dominated by irrigated Boro rice. The work was done in 2026 for the module *Water and Agriculture* (M.Sc. Integrated Water Resources Management, TH Köln).

The scripts only download and prepare data. Crop water requirements, irrigation demand and the water balance were computed afterwards with FAO-56 Penman–Monteith and CROPWAT, which are not part of this repository.

## Contents

| File | Data | What it produces |
|---|---|---|
| `gee/CHIRPS_annual_precip_1981_2025.js` | CHIRPS daily rainfall (UCSB-CHG) | Annual precipitation 1981–2025 as a CSV time series, plus optional GeoTIFFs and a console chart |
| `gee/TerraClimate_monthly_AET_climatology.js` | TerraClimate `aet` | Mean actual ET for each calendar month, 1983–2024 |
| `gee/GLEAM_monthly_Eactual_1983_2021_export.js` | GLEAM v4 actual evaporation (user-ingested asset) | Monthly series, monthly climatology and the period mean as GeoTIFFs |
| `gee/GLEAM_monthly_climatology_export.js` | GLEAM v4 | Monthly climatology only (short version) |
| `gee/vegetation_mapping_mohanpur.js` | Sentinel-2, ESA WorldCover, Dynamic World | Vegetation map of the union from spectral indices and land-cover classes |
| `python/wapor_npp_download.py` | FAO WaPOR v3 NPP | Minimal download example with `wapordl` |
| `python/wapor_crop_yield.py` | FAO WaPOR v3 NPP | Seasonal NPP turned into above-ground biomass and Boro rice yield, written out as GeoTIFFs |

## Yield method (`wapor_crop_yield.py`)

Seasonal net primary production from WaPOR is converted following the FAO WaPOR methodology:

```
AGB   = AOT × 22.222 × LUEc × NPP_seasonal      (kg dry matter per ha)
Yield = AGB × HI / (1 − MC)                     (kg per ha)
```

The default parameters for Boro rice are AOT 0.85, LUEc 0.70, HI 0.45 and MC 0.14. They are literature ranges for C3 cereals and should be checked against local field data before the results are used.

## How to run

- **Earth Engine scripts.** Paste into the [Code Editor](https://code.earthengine.google.com), run, then start the exports from the Tasks tab. GLEAM is not in the public catalogue, so ingest it as your own asset first and set `GLEAM_ASSET`.
- **WaPOR scripts.** `pip install -r requirements.txt`, then `python python/wapor_crop_yield.py`.

The study area is embedded as coordinates, so no upload is needed: the exact boundary in the vegetation script and its bounding box in the GLEAM and TerraClimate scripts. The CHIRPS script uses a 10 km circle around 25.65° N, 88.68° E, which does not cover Mohanpur Union; replace `aoi` for that area. The WaPOR scripts use a bounding box of Dinajpur.

## Author

Rifah Muhaimina Rahman, M.Sc. student in Integrated Water Resources Management, TH Köln. Code released under the MIT License. Data products keep their own licences (CHIRPS, TerraClimate, GLEAM, Copernicus Sentinel-2, ESA WorldCover, Dynamic World, FAO WaPOR).
