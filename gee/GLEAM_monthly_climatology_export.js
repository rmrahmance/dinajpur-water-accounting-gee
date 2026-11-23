// GLEAM mean actual ET per calendar month (Jan = mean of all Januaries, etc.)
// Clipped BY EXTENT of Boundary_W4140_4326_dissolve, exported as GeoTIFFs.
// Short version of GLEAM_monthly_Eactual_1983_2021_export.js (climatology only).
//
// Input : your own GLEAM v4 monthly E asset (set GLEAM_ASSET and E_BAND)
// Output: 12 GeoTIFFs, GLEAM_E_mean_M01 ... GLEAM_E_mean_M12,
//         in the Drive folder GLEAM_W4140
// Run   : paste into the Code Editor, run, then start the 12 exports
//         from the Tasks tab.

var GLEAM_ASSET = 'users/YOUR_USERNAME/GLEAM_v4_monthly_E'; // <-- your ingested asset
var E_BAND = 'E';   // or 'b1' after ingestion
var extent = ee.Geometry.Rectangle(
  [88.6355896, 25.893440248, 88.732582093, 26.025365830], 'EPSG:4326', false);

var gleam = ee.ImageCollection(GLEAM_ASSET)
  .filterDate('1983-01-01', '2026-01-01')   // 1983 through 2025
  .select([E_BAND]);

ee.List.sequence(1, 12).getInfo().forEach(function (m) {
  var mm = ('0' + m).slice(-2);
  var img = gleam.filter(ee.Filter.calendarRange(m, m, 'month'))
                 .mean().clip(extent).toFloat();
  Export.image.toDrive({
    image: img,
    description: 'GLEAM_E_mean_M' + mm,
    folder: 'GLEAM_W4140',
    fileNamePrefix: 'GLEAM_E_mean_M' + mm,
    region: extent,
    scale: 27830,          // ~0.25 deg native
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
});
