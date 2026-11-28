/**********************************************************************
 * W4140: Vegetation mapping for the study area
 * Study area : Mohanpur Union, Birganj, Dinajpur, Rangpur, Bangladesh
 * Boundary   : Boundary_W4140_4326_dissolve  (EPSG:4326)
 * Goal       : Map ALL vegetation inside the study area using
 *              Sentinel-2 (indices + threshold) and ESA WorldCover /
 *              Google Dynamic World land-cover classes.
 *
 * The boundary polygon is embedded below, so you do NOT need to
 * upload the shapefile as an asset. (If you prefer the asset, see the
 * commented line near the top of Section 1.)
 **********************************************************************/

// ============================================================
// 1. STUDY AREA
// ============================================================
// -- Option A (used here): boundary embedded as coordinates -------
var studyCoords = [
[88.6477,25.92547],[88.64744,25.92783],[88.64822,25.92991],[88.65032,25.93068],
[88.65062,25.93186],[88.65273,25.93283],[88.65562,25.93597],[88.65466,25.93962],
[88.65643,25.93962],[88.65809,25.9448],[88.66177,25.9482],[88.66522,25.95422],
[88.6682,25.9565],[88.66918,25.95829],[88.674,25.95892],[88.6748,25.95529],
[88.67646,25.95462],[88.67941,25.95555],[88.68092,25.95903],[88.6795,25.96209],
[88.67892,25.9609],[88.67811,25.96098],[88.67545,25.96366],[88.67456,25.96318],
[88.67327,25.96391],[88.67258,25.963],[88.67099,25.96443],[88.66943,25.9626],
[88.66866,25.96269],[88.66856,25.96402],[88.66681,25.9652],[88.66678,25.96743],
[88.66767,25.96905],[88.66996,25.96986],[88.66794,25.9726],[88.66331,25.97469],
[88.66305,25.97607],[88.66376,25.97696],[88.66645,25.97756],[88.66487,25.97917],
[88.66292,25.97902],[88.66086,25.97723],[88.66146,25.97531],[88.66046,25.97593],
[88.65386,25.97156],[88.65132,25.972],[88.64611,25.97011],[88.64491,25.97222],
[88.64448,25.97066],[88.64184,25.97017],[88.64265,25.96849],[88.6422,25.96783],
[88.64057,25.96798],[88.63957,25.96926],[88.63807,25.96838],[88.63559,25.97535],
[88.63879,25.97679],[88.63764,25.97927],[88.64018,25.97955],[88.64141,25.98071],
[88.63923,25.98389],[88.63891,25.98805],[88.63972,25.99045],[88.64113,25.99148],
[88.64252,25.99483],[88.64729,26.0016],[88.64934,26.00292],[88.64819,26.00487],
[88.65331,26.00701],[88.6558,26.00912],[88.6554,26.01221],[88.65384,26.01132],
[88.6537,26.0123],[88.65044,26.01299],[88.64937,26.01239],[88.65057,26.01028],
[88.64793,26.00909],[88.6477,26.00986],[88.64873,26.01105],[88.64754,26.01194],
[88.64886,26.01265],[88.64798,26.01399],[88.64857,26.01555],[88.6473,26.01582],
[88.6459,26.01491],[88.64507,26.01681],[88.64133,26.01821],[88.6423,26.0215],
[88.64556,26.02239],[88.64563,26.02346],[88.6486,26.02403],[88.65278,26.02311],
[88.65143,26.02436],[88.655,26.02532],[88.65636,26.02361],[88.65531,26.02212],
[88.65382,26.02182],[88.6532,26.02279],[88.64887,26.02067],[88.64679,26.02104],
[88.64447,26.0191],[88.64644,26.01844],[88.64901,26.01898],[88.64935,26.01838],
[88.65496,26.01954],[88.65523,26.01894],[88.65645,26.02123],[88.65853,26.02177],
[88.66169,26.02133],[88.66339,26.01726],[88.66521,26.0154],[88.6713,26.01279],
[88.69984,26.01566],[88.70057,26.00757],[88.70653,26.00635],[88.71129,26.00774],
[88.71305,26.00515],[88.7124,26.00138],[88.71095,25.99842],[88.70849,25.99627],
[88.70359,25.99381],[88.70251,25.9915],[88.70624,25.98865],[88.70821,25.98589],
[88.71747,25.99194],[88.72166,25.98835],[88.72195,25.98729],[88.72147,25.98009],
[88.71784,25.97446],[88.71902,25.96714],[88.71844,25.96399],[88.7179,25.96342],
[88.71426,25.96372],[88.71141,25.96148],[88.70974,25.96219],[88.70882,25.96203],
[88.70859,25.96111],[88.70897,25.95975],[88.71166,25.95883],[88.71363,25.95527],
[88.71648,25.9549],[88.71867,25.95329],[88.71605,25.95193],[88.71603,25.94854],
[88.71699,25.94349],[88.72053,25.93843],[88.72079,25.93618],[88.7206,25.93522],
[88.71912,25.93504],[88.719,25.93402],[88.71769,25.93358],[88.71721,25.93162],
[88.71625,25.93099],[88.71748,25.92902],[88.71611,25.92826],[88.71394,25.92846],
[88.714,25.92739],[88.71732,25.92695],[88.7175,25.92582],[88.71515,25.92558],
[88.71494,25.92252],[88.71669,25.92271],[88.71928,25.9205],[88.72072,25.92032],
[88.72157,25.92058],[88.7216,25.92187],[88.72247,25.92114],[88.72894,25.92156],
[88.72963,25.92019],[88.72728,25.91416],[88.72705,25.91074],[88.73161,25.91065],
[88.73255,25.90985],[88.73253,25.90894],[88.73028,25.90878],[88.73022,25.90752],
[88.72809,25.90527],[88.72816,25.89814],[88.72709,25.89344],[88.71201,25.89653],
[88.70992,25.8962],[88.70905,25.89452],[88.70791,25.89432],[88.70545,25.89642],
[88.70673,25.89921],[88.70679,25.90387],[88.70444,25.90789],[88.70176,25.90987],
[88.69327,25.91014],[88.69219,25.91228],[88.69082,25.91029],[88.69087,25.90802],
[88.6876,25.90811],[88.68576,25.91112],[88.6845,25.91101],[88.68256,25.91282],
[88.68089,25.91294],[88.67825,25.917],[88.6687,25.91898],[88.66086,25.92321],
[88.6598,25.92275],[88.65917,25.92121],[88.65676,25.92131],[88.65522,25.91961],
[88.65205,25.91942],[88.65191,25.92116],[88.65015,25.92165],[88.65072,25.9237],
[88.64891,25.92368],[88.6477,25.92547]
];
var aoi = ee.FeatureCollection([ee.Feature(ee.Geometry.Polygon([studyCoords]))]);

// -- Option B: use your uploaded shapefile asset instead ----------
// var aoi = ee.FeatureCollection('users/YOUR_USERNAME/Boundary_W4140_4326_dissolve');

var geom = aoi.geometry();
Map.centerObject(aoi, 12);
Map.addLayer(aoi.style({color: 'red', fillColor: '00000000', width: 2}),
             {}, 'Study area boundary');

// ============================================================
// 2. TIME PERIOD  (edit to your analysis year / season)
// ============================================================
var startDate = '2024-01-01';
var endDate   = '2024-12-31';

// ============================================================
// 3. SENTINEL-2 CLOUD-FREE COMPOSITE
// ============================================================
function maskS2(img) {
  // Scene Classification Layer (SCL): keep vegetation/soil/water,
  // remove clouds (8,9,10), shadows (3), snow (11), saturated (1).
  var scl = img.select('SCL');
  var good = scl.neq(1).and(scl.neq(3)).and(scl.neq(8))
               .and(scl.neq(9)).and(scl.neq(10)).and(scl.neq(11));
  return img.updateMask(good)
            .divide(10000)                 // scale to reflectance
            .copyProperties(img, ['system:time_start']);
}

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geom)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40))
  .map(maskS2);

var composite = s2.median().clip(geom);

Map.addLayer(composite, {bands: ['B4','B3','B2'], min: 0, max: 0.3},
             'S2 true colour', false);
Map.addLayer(composite, {bands: ['B8','B4','B3'], min: 0, max: 0.4},
             'S2 false colour (veg = red)', false);

// ============================================================
// 4. VEGETATION INDICES
// ============================================================
var ndvi = composite.normalizedDifference(['B8','B4']).rename('NDVI');
var ndre = composite.normalizedDifference(['B8','B5']).rename('NDRE');
var evi  = composite.expression(
  '2.5 * ((NIR - RED) / (NIR + 6*RED - 7.5*BLUE + 1))',
  {NIR: composite.select('B8'), RED: composite.select('B4'),
   BLUE: composite.select('B2')}).rename('EVI');
var savi = composite.expression(
  '((NIR - RED) / (NIR + RED + 0.5)) * 1.5',
  {NIR: composite.select('B8'), RED: composite.select('B4')}).rename('SAVI');

var ndviPalette = ['#a50026','#d73027','#f46d43','#fdae61','#fee08b',
                   '#d9ef8b','#a6d96a','#66bd63','#1a9850','#006837'];
Map.addLayer(ndvi.clip(geom), {min: -0.1, max: 0.9, palette: ndviPalette}, 'NDVI');
Map.addLayer(evi.clip(geom),  {min: 0,    max: 1.0, palette: ndviPalette}, 'EVI', false);

// ============================================================
// 5. "ALL VEGETATION" MASK FROM NDVI THRESHOLD
//    NDVI > 0.3 is a common cut-off separating vegetation from
//    bare soil / built-up / water. Adjust for your region.
// ============================================================
var vegThreshold = 0.3;
var vegMask = ndvi.gt(vegThreshold).selfMask().clip(geom).rename('vegetation');
Map.addLayer(vegMask, {palette: ['#1a9850']}, 'All vegetation (NDVI > ' + vegThreshold + ')');

// ============================================================
// 6. "ALL VEGETATION" FROM LAND-COVER PRODUCTS
// ============================================================
// -- 6a. ESA WorldCover 2021 (10 m). Vegetation classes:
//    10 Tree cover, 20 Shrubland, 30 Grassland, 40 Cropland,
//    90 Herbaceous wetland, 95 Mangroves.
var wc = ee.ImageCollection('ESA/WorldCover/v200').first().clip(geom);
var wcVeg = wc.eq(10).or(wc.eq(20)).or(wc.eq(30))
              .or(wc.eq(40)).or(wc.eq(90)).or(wc.eq(95))
              .selfMask().rename('wc_vegetation');
Map.addLayer(wc, {}, 'ESA WorldCover (all classes)', false);
Map.addLayer(wcVeg, {palette: ['#4c9a2a']}, 'WorldCover vegetation', false);

// -- 6b. Google Dynamic World (10 m). Vegetation classes:
//    1 Trees, 2 Grass, 4 Crops, 5 Shrub & scrub, 6 Flooded vegetation.
var dw = ee.ImageCollection('GOOGLE/DYNAMICWORLD/V1')
  .filterBounds(geom).filterDate(startDate, endDate)
  .select('label').mode().clip(geom);
var dwVeg = dw.eq(1).or(dw.eq(2)).or(dw.eq(4)).or(dw.eq(5)).or(dw.eq(6))
             .selfMask().rename('dw_vegetation');
Map.addLayer(dwVeg, {palette: ['#2e8b57']}, 'Dynamic World vegetation', false);

// ============================================================
// 7. AREA STATISTICS  (hectares)
// ============================================================
var pxHa = ee.Image.pixelArea().divide(10000);

var totalHa = pxHa.reduceRegion({
  reducer: ee.Reducer.sum(), geometry: geom, scale: 10, maxPixels: 1e13
}).getNumber('area');

var vegHa = pxHa.updateMask(vegMask).reduceRegion({
  reducer: ee.Reducer.sum(), geometry: geom, scale: 10, maxPixels: 1e13
}).getNumber('area');

print('Total study-area size (ha):', totalHa);
print('Vegetated area, NDVI>' + vegThreshold + ' (ha):', vegHa);
print('Vegetation cover (%):', vegHa.divide(totalHa).multiply(100));

// Area per WorldCover class (ha)
var wcAreas = pxHa.addBands(wc).reduceRegion({
  reducer: ee.Reducer.sum().group({groupField: 1, groupName: 'class'}),
  geometry: geom, scale: 10, maxPixels: 1e13
});
print('Area (ha) per WorldCover class:', wcAreas);

// ============================================================
// 8. EXPORTS  (run the tasks from the "Tasks" tab)
// ============================================================
Export.image.toDrive({
  image: ndvi.clip(geom).float(),
  description: 'Mohanpur_NDVI_2024',
  folder: 'GEE_W4140', region: geom, scale: 10,
  crs: 'EPSG:4326', maxPixels: 1e13
});

Export.image.toDrive({
  image: vegMask.unmask(0).byte(),
  description: 'Mohanpur_vegetation_mask_2024',
  folder: 'GEE_W4140', region: geom, scale: 10,
  crs: 'EPSG:4326', maxPixels: 1e13
});

Export.image.toDrive({
  image: wc.byte(),
  description: 'Mohanpur_WorldCover_2021',
  folder: 'GEE_W4140', region: geom, scale: 10,
  crs: 'EPSG:4326', maxPixels: 1e13
});
