// Mean actual ET per calendar month (Jan = mean of all Januaries, 1983-2025, etc.)
// Dataset: TerraClimate 'aet' (public in GEE, no upload needed).
// Clipped BY EXTENT of Boundary_W4140_4326_dissolve, exported as GeoTIFFs.
//
// Input : IDAHO_EPSCOR/TERRACLIMATE, band 'aet', 1983-2025
// Output: 12 GeoTIFFs in mm/month, AET_mean_M01 ... AET_mean_M12,
//         in the Drive folder AET_W4140
// Run   : paste into the Code Editor, run, then start the 12 exports
//         from the Tasks tab.

var extent = ee.Geometry.Rectangle(
  [88.6355896, 25.893440248, 88.732582093, 26.025365830], 'EPSG:4326', false);

// aet is stored *10; multiply by 0.1 to get mm/month.
var aet = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE')
  .filterDate('1983-01-01', '2026-01-01')
  .select('aet')
  .map(function (img) { return img.multiply(0.1)
      .copyProperties(img, ['system:time_start']); });

ee.List.sequence(1, 12).getInfo().forEach(function (m) {
  var mm = ('0' + m).slice(-2);
  var img = aet.filter(ee.Filter.calendarRange(m, m, 'month'))
               .mean().clip(extent).toFloat();
  Export.image.toDrive({
    image: img,
    description: 'AET_mean_M' + mm,
    folder: 'AET_W4140',
    fileNamePrefix: 'AET_mean_M' + mm,
    region: extent,
    scale: 4638,          // TerraClimate native ~1/24 deg
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
});
