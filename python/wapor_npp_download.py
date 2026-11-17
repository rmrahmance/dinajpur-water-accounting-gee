"""
Download WaPOR v3 NPP (global 300 m) for Dinajpur, Bangladesh.
Run from a terminal:  python wapor_npp_download.py
(First install once:  pip install wapordl)
"""

from wapordl import wapor_map

# Dinajpur bounding box [xmin, ymin, xmax, ymax] in degrees
region   = [88.0, 25.1, 89.3, 26.2]
variable = "L1-NPP-M"                    # monthly NPP, global (use "L1-NPP-D" for dekadal)
period   = ["2023-01-01", "2023-05-31"]  # Boro rice season (pick a year >= 2018)
folder   = "./wapor_npp"

import os
os.makedirs(folder, exist_ok=True)

fps = wapor_map(region, variable, period, folder)
print("Downloaded files:")
print(fps)
