// Initialize the map centered on the site
const map = L.map('map', {
    zoomControl: false // Disable default zoom control to avoid conflict
}).setView([35.2935, -101.6028], 17);

// Add zoom control in a non-conflicting position
L.control.zoom({
    position: 'topleft'
}).addTo(map);

// Add custom CSS to adjust zoom control position
const style = document.createElement('style');
style.textContent = `
    .leaflet-control-zoom {
        margin-left: 120px !important; /* Move right of navigation button */
        margin-top: 10px !important;
    }
`;
document.head.appendChild(style);

// Add satellite imagery
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 20
}).addTo(map);

// Add OpenStreetMap as an alternative layer
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 20
});

// Layer control
const baseMaps = {
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    "Street Map": osmLayer
};

L.control.layers(baseMaps).addTo(map);

// Define all areas
// Laydown Area (main yard)
const laydownCoords = [
    [35.293958, -101.603798],
    [35.293958, -101.601252],
    [35.292548, -101.601252],
    [35.292548, -101.603798]
];

const laydownArea = L.polygon(laydownCoords, {
    color: 'red',
    weight: 2,
    opacity: 0.8,
    fillColor: 'red',
    fillOpacity: 0.3
}).addTo(map);
laydownArea.bindPopup('<b>Laydown Area</b><br>Main storage yard');

// Lunch Tent
const metalFrameCoords = [
    [35.293586, -101.604386],
    [35.293758, -101.604386],
    [35.293758, -101.604078],
    [35.293586, -101.604078]
];

const metalFrame = L.polygon(metalFrameCoords, {
    color: 'green',
    weight: 2,
    opacity: 0.8,
    fillColor: 'green',
    fillOpacity: 0.3
}).addTo(map);
metalFrame.bindPopup('<b>Lunch Tent Structure</b>');

// Equipment Lot (using corners 1 and 3 to define rectangle)
const equipLotCoords = [
    [35.29408, -101.60123],
    [35.294636, -101.60123],  // Corner 2 (interpolated)
    [35.294636, -101.603913],
    [35.29408, -101.603913]   // Corner 4 (interpolated)
];

const equipLot = L.polygon(equipLotCoords, {
    color: 'blue',
    weight: 2,
    opacity: 0.8,
    fillColor: 'blue',
    fillOpacity: 0.3
}).addTo(map);
equipLot.bindPopup('<b>Equipment Lot</b>');

// Parking Lot
const parkingCoords = [
    [35.294636, -101.603913],
    [35.294636, -101.604341],  // Corner 2 (interpolated)
    [35.29413, -101.604341],
    [35.29413, -101.603913]    // Corner 4 (interpolated)
];

const parkingLot = L.polygon(parkingCoords, {
    color: 'gray',
    weight: 2,
    opacity: 0.8,
    fillColor: 'gray',
    fillOpacity: 0.3
}).addTo(map);
parkingLot.bindPopup('<b>Parking Lot</b>');

// Office Trailers
const officeCoords = [
    [35.293422, -101.604512],
    [35.293422, -101.604076],  // Corner 2 (interpolated)
    [35.293101, -101.604076],
    [35.293101, -101.604512]   // Corner 4 (interpolated)
];

const officeTrailers = L.polygon(officeCoords, {
    color: 'purple',
    weight: 2,
    opacity: 0.8,
    fillColor: 'purple',
    fillOpacity: 0.3
}).addTo(map);
officeTrailers.bindPopup('<b>Office Trailers</b>');

// Crane area
const craneCoords = [
    [35.293277, -101.602941],
    [35.293476, -101.602941],  // Corner 2 (interpolated)
    [35.293476, -101.603577],
    [35.293277, -101.603577]   // Corner 4 (interpolated)
];

const craneArea = L.polygon(craneCoords, {
    color: 'brown',
    weight: 2,
    opacity: 0.8,
    fillColor: 'brown',
    fillOpacity: 0.3
}).addTo(map);
craneArea.bindPopup('<b>Crane Area</b>');

// Bayonne Laydown
const bayonneCoords = [
    [35.292981, -101.6033312],
    [35.292981, -101.602385],  // Corner 2 (interpolated)
    [35.292726, -101.602385],
    [35.292726, -101.6033312]  // Corner 4 (interpolated)
];

const bayonneLaydown = L.polygon(bayonneCoords, {
    color: 'teal',
    weight: 2,
    opacity: 0.8,
    fillColor: 'teal',
    fillOpacity: 0.3
}).addTo(map);
bayonneLaydown.bindPopup('<b>Bayonne Laydown</b>');

// Work Site
const workSiteCoords = [
    [35.294824, -101.60474],  // Corner 1
    [35.292619, -101.60474],  // Corner 2
    [35.292619, -101.607071], // Corner 3
    [35.294824, -101.607071]  // Corner 4
];

const workSite = L.polygon(workSiteCoords, {
    color: 'darkgreen',
    weight: 2,
    opacity: 0.8,
    fillColor: 'darkgreen',
    fillOpacity: 0.3
}).addTo(map);
workSite.bindPopup('<b>F6B WORK SITE</b>');

// Drainage Reservoir (new coordinates)
const drainageCoords = [
    [35.294824, -101.607206],  // Corner 1
    [35.294282, -101.607206],  // Corner 2
    [35.294282, -101.607591],  // Corner 3
    [35.294824, -101.607591]   // Corner 4
];

const drainageReservoir = L.polygon(drainageCoords, {
    color: 'navy',
    weight: 2,
    opacity: 0.8,
    fillColor: 'navy',
    fillOpacity: 0.3
}).addTo(map);
drainageReservoir.bindPopup('<b>Drainage Reservoir</b>');

// P100 Line
const p100Line = L.polyline([
    [35.2936, -101.60705],
    [35.2936, -101.60474]
], {
    color: 'red',
    weight: 3,
    opacity: 0.9,
    dashArray: '10, 5'
}).addTo(map);
p100Line.bindPopup('<b>P100 Line</b>');

// P200 Line
const p200Line = L.polyline([
    [35.2936, -101.606],
    [35.2945, -101.606]
], {
    color: 'red',
    weight: 3,
    opacity: 0.9,
    dashArray: '10, 5'
}).addTo(map);
p200Line.bindPopup('<b>P200 Line</b>');

// P300 Line
const p300Line = L.polyline([
    [35.2936, -101.6053],
    [35.2942, -101.6053]
], {
    color: 'red',
    weight: 3,
    opacity: 0.9,
    dashArray: '10, 5'
}).addTo(map);
p300Line.bindPopup('<b>P300 Line</b>');

// Guard Shack (single point, creating small square)
const guardShackCenter = [35.292971, -101.604691];
const guardShack = L.circle(guardShackCenter, {
    radius: 10,
    color: 'yellow',
    weight: 2,
    opacity: 0.8,
    fillColor: 'yellow',
    fillOpacity: 0.5
}).addTo(map);
guardShack.bindPopup('<b>Guard Shack</b>');

// First Aid & Toilets (single point, creating small square)
const firstAidCenter = [35.292969, -101.60452];
const firstAid = L.circle(firstAidCenter, {
    radius: 10,
    color: 'cyan',
    weight: 2,
    opacity: 0.8,
    fillColor: 'cyan',
    fillOpacity: 0.5
}).addTo(map);
firstAid.bindPopup('<b>First Aid & Toilets</b>');

// Conexes (40-meter shipping containers) - ROTATED 90 DEGREES
// Given two corners, we'll calculate the 4 containers
const conexCorner1 = [35.293971, -101.602118];
const conexCorner2 = [35.293992, -101.602266];

// Calculate the original vector
const latDiff = conexCorner2[0] - conexCorner1[0];
const lonDiff = conexCorner2[1] - conexCorner1[1];

// Rotate 90 degrees: new vector is perpendicular
// For 90-degree rotation: (x,y) becomes (-y,x)
const rotatedLatDiff = -lonDiff * 0.9; // Adjust for latitude/longitude scaling
const rotatedLonDiff = latDiff;

// Each conex is 40 meters long (approximately 0.00036 degrees longitude at this latitude)
// Width is approximately 8 feet (2.4 meters or 0.000022 degrees)
const conexLength = 0.00036;  // 40 meters in degrees
const conexWidth = 0.000022;   // 2.4 meters in degrees
const conexSpacing = 0.000035; // Space between containers

// Create 4 conexes with 90-degree rotation
for (let i = 0; i < 4; i++) {
    const offset = i * (conexWidth + conexSpacing);
    
    // Calculate the four corners of each rotated conex
    const basePoint = [
        conexCorner1[0] + offset * rotatedLatDiff,
        conexCorner1[1] + offset * rotatedLonDiff
    ];
    
    const conex = L.polygon([
        basePoint,
        [basePoint[0] - conexLength * 0.00001, basePoint[1] + conexLength],
        [basePoint[0] - conexWidth - conexLength * 0.00001, basePoint[1] + conexLength],
        [basePoint[0] - conexWidth, basePoint[1]]
    ], {
        color: 'darkorange',
        weight: 2,
        opacity: 0.8,
        fillColor: 'darkorange',
        fillOpacity: 0.5
    }).addTo(map);
    conex.bindPopup(`<b>Conex ${i + 1}</b><br>40-meter container (rotated 90°)`);
}

// Add markers for key points
L.marker([35.292971, -101.604691]).addTo(map)
    .bindPopup('<b>Guard Shack</b><br>Main entrance');

L.marker([35.292969, -101.60452]).addTo(map)
    .bindPopup('<b>First Aid & Toilets</b><br>Emergency facilities');

// Add a scale control
L.control.scale({
    position: 'bottomleft',
    imperial: true,
    metric: true
}).addTo(map);

// Add coordinate labels for all corners
function addCornerLabel(lat, lon, label) {
    const marker = L.circleMarker([lat, lon], {
        radius: 3,
        fillColor: 'white',
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);
    
    marker.bindTooltip(
        `${label}<br>${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        {
            permanent: false,
            direction: 'top',
            className: 'coordinate-label'
        }
    ).openTooltip();
}

// Add coordinate markers with labels for all areas
// Laydown Area corners
laydownCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'red',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Laydown C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Lunch Tent corners
metalFrameCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'green',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Lunch Tent C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Equipment Lot corners
equipLotCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'blue',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Equip Lot C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Parking Lot corners
parkingCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'gray',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Parking C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Office Trailers corners
officeCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'purple',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Office C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Crane Area corners
craneCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'brown',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Crane C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Bayonne Laydown corners
bayonneCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'teal',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Bayonne C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Drainage Reservoir corners
drainageCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'navy',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Drainage C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// Work Site corners
workSiteCoords.forEach((coord, i) => {
    L.circleMarker(coord, {
        radius: 3,
        fillColor: 'darkgreen',
        color: 'white',
        weight: 1,
        fillOpacity: 0.9
    }).addTo(map)
    .bindTooltip(`Work Site C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`, 
        {permanent: false, direction: 'top'});
});

// P100 Line endpoints
L.circleMarker([35.2936, -101.60705], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P100 Start<br>35.293600, -101.607050`, 
    {permanent: false, direction: 'top'});
    
L.circleMarker([35.2936, -101.60474], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P100 End<br>35.293600, -101.604740`, 
    {permanent: false, direction: 'top'});

// P200 Line endpoints
L.circleMarker([35.2936, -101.606], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P200 Start<br>35.293600, -101.60600`, 
    {permanent: false, direction: 'top'});
    
L.circleMarker([35.2945, -101.606], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P200 End<br>35.294500, -101.60600`, 
    {permanent: false, direction: 'top'});

// P300 Line endpoints
L.circleMarker([35.2936, -101.6053], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P300 Start<br>35.293600, -101.605300`, 
    {permanent: false, direction: 'top'});
    
L.circleMarker([35.2942, -101.607053], {
    radius: 3,
    fillColor: 'red',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`P300 End<br>35.294200, -101.607053`, 
    {permanent: false, direction: 'top'});

// Conex corners (showing just the main reference corners)
L.circleMarker([35.293971, -101.602118], {
    radius: 3,
    fillColor: 'darkorange',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`Conex C1<br>35.293971, -101.602118`, 
    {permanent: false, direction: 'top'});
    
L.circleMarker([35.293992, -101.602266], {
    radius: 3,
    fillColor: 'darkorange',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`Conex C2<br>35.293992, -101.602266`, 
    {permanent: false, direction: 'top'});

// Add permanent name labels for all areas
function addAreaLabel(coords, name, offset = [0, 0]) {
    let centerLat = 0, centerLon = 0;
    if (Array.isArray(coords)) {
        coords.forEach(coord => {
            centerLat += coord[0];
            centerLon += coord[1];
        });
        centerLat /= coords.length;
        centerLon /= coords.length;
    } else {
        centerLat = coords[0];
        centerLon = coords[1];
    }
    
    L.marker([centerLat + offset[0], centerLon + offset[1]], {
        icon: L.divIcon({
            className: 'area-label',
            html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${name}</div>`,
            iconSize: null,
            iconAnchor: [40, 12]
        })
    }).addTo(map);
}

// Add labels for all areas
addAreaLabel(laydownCoords, 'LAYDOWN AREA');
addAreaLabel(metalFrameCoords, 'LUNCH TENT');
addAreaLabel(equipLotCoords, 'EQUIPMENT LOT');
addAreaLabel(parkingCoords, 'PARKING');
addAreaLabel(officeCoords, 'OFFICE TRAILERS');
addAreaLabel(craneCoords, 'CRANE');
addAreaLabel(bayonneCoords, 'BAYONNE LAYDOWN');
addAreaLabel(workSiteCoords, 'F6B WORK SITE');
addAreaLabel(drainageCoords, 'DRAINAGE');

// Add label for P100 Line at midpoint
L.marker([35.2936, -101.605895], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 2px solid red; border-radius: 3px; font-weight: bold; font-size: 12px; color: red;">P100 LINE</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

// Add label for P200 Line at midpoint
L.marker([35.2941, -101.606], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 2px solid red; border-radius: 3px; font-weight: bold; font-size: 12px; color: red;">P200 LINE</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

// Add label for P300 Line at midpoint
L.marker([35.2941, -101.6053], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 2px solid red; border-radius: 3px; font-weight: bold; font-size: 12px; color: red;">P300 LINE</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

// Add label for Conexes area
L.marker([35.293885, -101.601937], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,140,0,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; color: white;">CONEXES</div>`,
        iconSize: null,
        iconAnchor: [30, 12]
    })
}).addTo(map);

// Add a scale control
L.control.scale({
    position: 'bottomleft',
    imperial: true,
    metric: true
}).addTo(map);

// Calculate and display total area
function calculateArea(coords) {
    const polygon = L.polygon(coords);
    const latlngs = polygon.getLatLngs()[0];
    let area = 0;
    for (let i = 0; i < latlngs.length; i++) {
        const j = (i + 1) % latlngs.length;
        area += latlngs[i].lng * latlngs[j].lat;
        area -= latlngs[j].lng * latlngs[i].lat;
    }
    area = Math.abs(area / 2);
    // Convert to square meters (approximate)
    return area * 111320 * 111320 * Math.cos(35.293 * Math.PI / 180);
}

const laydownAreaSqM = calculateArea(laydownCoords);
console.log(`Laydown Area: ${(laydownAreaSqM / 10000).toFixed(2)} hectares`);

// Fit map to show all features
const allCoords = [
    ...laydownCoords,
    ...metalFrameCoords,
    ...equipLotCoords,
    ...parkingCoords,
    ...officeCoords,
    ...craneCoords,
    ...bayonneCoords,
    ...drainageCoords,
    ...workSiteCoords,
    guardShackCenter,
    firstAidCenter,
    conexCorner1,
    conexCorner2
];

const bounds = L.latLngBounds(allCoords);
map.fitBounds(bounds, { padding: [50, 50] });

// Add event listener for zoom to laydown area button
document.getElementById('zoom-laydown').addEventListener('click', function() {
    const laydownBounds = L.latLngBounds(laydownCoords);
    map.fitBounds(laydownBounds, { padding: [20, 20] });
});