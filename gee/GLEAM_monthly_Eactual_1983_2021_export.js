/**********************************************************************
 * GLEAM v4.2 Actual Evaporation (E)  |  Monthly, 1983–2021
 * Study area: Boundary_W4140_4326_dissolve  (northern Bangladesh)
 * Clips rasters BY EXTENT (bounding box) and exports GeoTIFFs to Drive.
 *
 * Outputs (choose with the RUN_* switches below):
 *   1. Monthly time series  -> one GeoTIFF per month (Jan 1983 … Dec 2021)
 *   2. Monthly climatology  -> 12 GeoTIFFs (long-term mean of each calendar month)
 *   3. Overall mean         -> 1 GeoTIFF (mean over the whole period)
 *
 * ------------------------------------------------------------------
 * IMPORTANT: GLEAM is NOT in the Earth Engine public data catalog.
 * You must first ingest the GLEAM monthly "E" product (from
 * https://www.gleam.eu, as NetCDF converted to GeoTIFF or the yearly
 * NetCDFs) as your OWN Earth Engine ImageCollection asset, then put
 * that asset path in GLEAM_ASSET below. See notes at the bottom.
 * ------------------------------------------------------------------
 **********************************************************************/

// ============ USER SETTINGS ============================================

// (1) Your ingested GLEAM monthly-E ImageCollection asset:
var GLEAM_ASSET = 'users/YOUR_USERNAME/GLEAM_v4_monthly_E';   // <-- EDIT

// (2) Name of the actual-evaporation band inside each GLEAM image.
//     GLEAM's actual evaporation variable is "E". After ingestion the
//     band is often auto-named 'b1'. Check in the Assets tab and edit.
var E_BAND = 'E';                                             // or 'b1'

// (3) Time window (inclusive of 1983 up to end of 2021)
var START = '1983-01-01';
var END   = '2022-01-01';   // exclusive upper bound = all of 2021

// (4) Native GLEAM v4 resolution is 0.1 deg ≈ 11132 m. Keep native scale.
var SCALE = 11132;          // metres (approx 0.1 deg)

// (5) Output selection
var RUN_MONTHLY_SERIES = true;   // 468 monthly rasters
var RUN_CLIMATOLOGY    = true;   // 12 monthly-mean rasters
var RUN_OVERALL_MEAN   = true;   // 1 period-mean raster

var DRIVE_FOLDER = 'GLEAM_W4140';

// =======================================================================


// ---- STUDY AREA: clip BY EXTENT (bounding box of the dissolved boundary)
// Bounding box of Boundary_W4140_4326_dissolve.shp (EPSG:4326):
//   xmin 88.6355896  ymin 25.893440248  xmax 88.732582093  ymax 26.025365830
var extent = ee.Geometry.Rectangle(
  [88.6355896, 25.893440248, 88.732582093, 26.025365830],
  'EPSG:4326', false /* geodesic */);

// Optional: to clip to the EXACT polygon instead of the bbox, upload the
// shapefile as an EE table asset and uncomment the two lines below.
// var aoiFC   = ee.FeatureCollection('users/YOUR_USERNAME/Boundary_W4140_4326_dissolve');
// var extent  = aoiFC.geometry();

Map.centerObject(extent, 10);
Map.addLayer(extent, {color: 'red'}, 'Study area extent', false);


// ---- LOAD GLEAM, filter to period & band, clip to extent -------------
var gleam = ee.ImageCollection(GLEAM_ASSET)
  .filterDate(START, END)
  .filterBounds(extent)
  .select([E_BAND]);

print('GLEAM images in window:', gleam.size());
print('First image:', gleam.first());


// =====================================================================
// 1) MONTHLY TIME SERIES  -> one GeoTIFF per month
// =====================================================================
if (RUN_MONTHLY_SERIES) {
  var monthlyList = gleam.toList(gleam.size());
  var n = gleam.size().getInfo();          // number of monthly images
  for (var i = 0; i < n; i++) {
    var img = ee.Image(monthlyList.get(i)).clip(extent);
    // Build a YYYY_MM label from the image date
    var d   = ee.Date(img.get('system:time_start'));
    var lbl = d.format('YYYY_MM').getInfo();
    Export.image.toDrive({
      image:        img.toFloat(),
      description:  'GLEAM_E_' + lbl,
      folder:       DRIVE_FOLDER,
      fileNamePrefix: 'GLEAM_E_' + lbl,
      region:       extent,
      scale:        SCALE,
      crs:          'EPSG:4326',
      maxPixels:    1e13
    });
  }
}


// =====================================================================
// 2) MONTHLY CLIMATOLOGY -> 12 rasters (mean of each calendar month)
// =====================================================================
if (RUN_CLIMATOLOGY) {
  var months = ee.List.sequence(1, 12);
  months.getInfo().forEach(function (m) {
    var mm  = ('0' + m).slice(-2);
    var clim = gleam
      .filter(ee.Filter.calendarRange(m, m, 'month'))
      .mean()
      .clip(extent)
      .toFloat();
    Export.image.toDrive({
      image:          clim,
      description:    'GLEAM_E_climatology_M' + mm,
      folder:         DRIVE_FOLDER,
      fileNamePrefix: 'GLEAM_E_climatology_M' + mm,
      region:         extent,
      scale:          SCALE,
      crs:            'EPSG:4326',
      maxPixels:      1e13
    });
  });
}


// =====================================================================
// 3) OVERALL MEAN -> single raster, mean over 1983–2021
// =====================================================================
if (RUN_OVERALL_MEAN) {
  var meanImg = gleam.mean().clip(extent).toFloat();
  Map.addLayer(meanImg, {min: 0, max: 150,
    palette: ['ffffcc','a1dab4','41b6c4','2c7fb8','253494']},
    'Mean actual E (mm/month)');
  Export.image.toDrive({
    image:          meanImg,
    description:    'GLEAM_E_overall_mean_1983_2021',
    folder:         DRIVE_FOLDER,
    fileNamePrefix: 'GLEAM_E_overall_mean_1983_2021',
    region:         extent,
    scale:          SCALE,
    crs:            'EPSG:4326',
    maxPixels:      1e13
  });
}

/**********************************************************************
 * HOW TO GET GLEAM INTO EARTH ENGINE
 * ------------------------------------------------------------------
 * 1. Register & download the GLEAM monthly actual-evaporation product
 *    "E" from https://www.gleam.eu (v4.2, yearly NetCDF, 0.1°, from 1980).
 * 2. Convert each monthly slice to GeoTIFF (e.g. with GDAL:
 *      gdal_translate NETCDF:"E_1983.nc":E -b <monthIndex> E_1983_01.tif)
 *    keeping system:time_start, or use gdal + a small script.
 * 3. Ingest the GeoTIFFs as an ImageCollection asset in the EE Assets
 *    tab (set the time property to the month start date).
 * 4. Put that asset ID in GLEAM_ASSET above and set E_BAND to match.
 *
 * RUNNING: paste into https://code.earthengine.google.com, click Run,
 * then start the export tasks from the "Tasks" tab. GeoTIFFs land in
 * your Google Drive folder "GLEAM_W4140".
 *
 * Tip: 468 monthly tasks is a lot to click. Install the open-source
 * "EE task manager" helper, or run only one output type at a time via
 * the RUN_* switches.
 **********************************************************************/
