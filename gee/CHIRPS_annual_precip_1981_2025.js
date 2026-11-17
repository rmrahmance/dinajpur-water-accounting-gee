/**********************************************************************
 * CHIRPS annual precipitation (mm/year) — Dinajpur, Bangladesh
 * Course: W4140 — Irrigation Planning / Water Accounting
 *
 * Dataset : UCSB-CHG/CHIRPS/DAILY  (daily rainfall, ~5.5 km)
 * Period  : 1981–2025  (CHIRPS begins 1 Jan 1981 — there is NO 1980 data)
 * Output  : (1) annual time-series CSV  -> Google Drive
 *           (2) annual precipitation rasters (GeoTIFF) -> Drive (optional)
 *           (3) chart in the Console
 *
 * HOW TO USE
 *   1. Open https://code.earthengine.google.com  and paste this in.
 *   2. Adjust the AoI below to YOUR study area if needed.
 *   3. Run. Then open the "Tasks" tab and click "RUN" to start the
 *      Drive export(s).
 **********************************************************************/

// ----------------------------------------------------------------------
// 1. AREA OF INTEREST
//    Default = point at Dinajpur (25.65 N, 88.68 E) buffered to ~10 km.
//    Replace `aoi` with your own geometry (draw a polygon, or import a
//    Shatagram / Mohanpur shapefile) for a more precise average.
// ----------------------------------------------------------------------
var aoi = ee.Geometry.Point([88.68, 25.65]).buffer(10000);  // 10 km radius
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {color: 'red'}, 'AoI');

// ----------------------------------------------------------------------
// 2. PERIOD
// ----------------------------------------------------------------------
var startYear = 1981;   // CHIRPS first full year
var endYear   = 2025;
var years = ee.List.sequence(startYear, endYear);

// ----------------------------------------------------------------------
// 3. LOAD CHIRPS DAILY AND BUILD ANNUAL SUMS
//    For each year: sum all daily rainfall -> total annual precipitation.
// ----------------------------------------------------------------------
var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
                .select('precipitation');

var annualColl = ee.ImageCollection.fromImages(
  years.map(function (y) {
    y = ee.Number(y);
    var start = ee.Date.fromYMD(y, 1, 1);
    var end   = start.advance(1, 'year');
    var yearSum = chirps.filterDate(start, end).sum()
                        .rename('precip_mm');
    return yearSum.set('year', y)
                  .set('system:time_start', start.millis());
  })
);

// ----------------------------------------------------------------------
// 4. AREA-AVERAGED ANNUAL TOTAL -> FeatureCollection (year, precip_mm)
// ----------------------------------------------------------------------
var annualTable = ee.FeatureCollection(
  annualColl.map(function (img) {
    var mean = img.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: aoi,
      scale: 5566,            // CHIRPS native resolution (m)
      maxPixels: 1e9
    });
    return ee.Feature(null, {
      year: img.get('year'),
      precip_mm: mean.get('precip_mm')
    });
  })
);

// ----------------------------------------------------------------------
// 5. CHART IN CONSOLE
// ----------------------------------------------------------------------
var chart = ui.Chart.feature.byFeature(annualTable, 'year', 'precip_mm')
  .setChartType('ColumnChart')
  .setOptions({
    title: 'CHIRPS Annual Precipitation — Dinajpur (' + startYear + '–' + endYear + ')',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Precipitation (mm/year)'},
    legend: {position: 'none'}
  });
print(chart);
print('Annual table (year, precip_mm):', annualTable);

// ----------------------------------------------------------------------
// 6. EXPORT THE TIME-SERIES AS CSV TO GOOGLE DRIVE
// ----------------------------------------------------------------------
Export.table.toDrive({
  collection: annualTable,
  description: 'CHIRPS_annual_precip_Dinajpur_1981_2025',
  fileFormat: 'CSV',
  selectors: ['year', 'precip_mm']
});

// ----------------------------------------------------------------------
// 7. (OPTIONAL) EXPORT ANNUAL RASTERS (GeoTIFF) — one file per year.
//    Uncomment the block below ONLY if you need the maps. It queues 45
//    export tasks; run them from the Tasks tab.
// ----------------------------------------------------------------------
/*
var yearsClient = [];
for (var yr = startYear; yr <= endYear; yr++) { yearsClient.push(yr); }
yearsClient.forEach(function (yr) {
  var img = annualColl.filter(ee.Filter.eq('year', yr)).first().clip(aoi);
  Export.image.toDrive({
    image: img,
    description: 'CHIRPS_precip_' + yr,
    folder: 'CHIRPS_annual',
    region: aoi,
    scale: 5566,
    crs: 'EPSG:4326',
    maxPixels: 1e9
  });
});
*/
