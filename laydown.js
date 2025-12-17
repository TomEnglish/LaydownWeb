// Initialize the map centered on the laydown area
const map = L.map('map', {
    zoomControl: false // Disable default zoom control to avoid conflict
}).setView([35.2928, -101.6020], 18);

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

// Define laydown area
const laydownCoords = [
    [35.293958, -101.603798],
    [35.293958, -101.601252],
    [35.292548, -101.601252],
    [35.292548, -101.603798]
];

const laydownArea = L.polygon(laydownCoords, {
    color: 'white',
    weight: 2,
    opacity: 0.8,
    fillColor: 'white',
    fillOpacity: 0.3
}).addTo(map);
laydownArea.bindPopup('<b>Laydown Area</b><br>Main storage yard');

// Divide laydown area into symmetric quadrants
const centerLat = (35.293958 + 35.292548) / 2;
const centerLon = (-101.603798 + -101.601252) / 2;
const topLat = 35.293958 
const bottomLat = 35.292548
const leftLong = -101.603798 
const rightLong = -101.601252
const latBinH = (bottomLat - topLat) / 5;
const longBinW = (leftLong + rightLong) / 7;

// SubArea A1 (top-leftmost)
const subAreaA1 = L.polygon([
    [topLat, leftLong], // NW
    [topLat-(latBinH), leftLong-(longBinW)], // N-center
    [topLat-(latBinH), leftLong], // center
    [topLat, leftLong-(longBinW)] // W-center
], {
    color: 'blue',
    weight: 1,
    opacity: 0.6,
    fillColor: 'blue',
    fillOpacity: 0.2
}).addTo(map);

// SubArea A1 (top-leftmost)
const subAreaA2 = L.polygon([
    [topLat, leftLong-longBinW], // NW
    [topLat-(latBinH), leftLong-(longBinW*2)], // N-center
    [topLat-(latBinH), leftLong-longBinW], // center
    [topLat, leftLong-(longBinW*2)] // W-center
], {
    color: 'green',
    weight: 1,
    opacity: 0.6,
    fillColor: 'green',
    fillOpacity: 0.2
}).addTo(map);

/*
const quadA = L.polygon([
    [35.293958, -101.603798], // NW
    [35.293958, centerLon], // N-center
    [centerLat, centerLon], // center
    [centerLat, -101.603798] // W-center
], {
    color: 'red',
    weight: 1,
    opacity: 0.6,
    fillColor: 'red',
    fillOpacity: 0.2
}).addTo(map); 

// Quadrant B (top-right)
const quadB = L.polygon([
    [35.293958, -101.601252], // NE
    [35.293958, centerLon], // N-center
    [centerLat, centerLon], // center
    [centerLat, -101.601252] // E-center
], {
    color: 'blue',
    weight: 1,
    opacity: 0.6,
    fillColor: 'blue',
    fillOpacity: 0.2
}).addTo(map);

// Quadrant C (bottom-right)
const quadC = L.polygon([
    [35.292548, -101.601252], // SE
    [centerLat, -101.601252], // E-center
    [centerLat, centerLon], // center
    [35.292548, centerLon] // S-center
], {
    color: 'green',
    weight: 1,
    opacity: 0.6,
    fillColor: 'green',
    fillOpacity: 0.2
}).addTo(map);

// Quadrant D (bottom-left)
const quadD = L.polygon([
    [35.292548, -101.603798], // SW
    [35.292548, centerLon], // S-center
    [centerLat, centerLon], // center
    [centerLat, -101.603798] // W-center
], {
    color: 'orange',
    weight: 1,
    opacity: 0.6,
    fillColor: 'orange',
    fillOpacity: 0.2
}).addTo(map);

*/
// Add quadrant labels
L.marker([35.2938, -101.6035], {
    icon: L.divIcon({
        className: 'quad-label',
        html: '<div style="background: white; border: 1px solid red; padding: 2px; font-weight: bold; font-size: 14px;">A</div>',
        iconSize: null,
        iconAnchor: [10, 10]
    })
}).addTo(map);

L.marker([35.2938, -101.6018], {
    icon: L.divIcon({
        className: 'quad-label',
        html: '<div style="background: white; border: 1px solid red; padding: 2px; font-weight: bold; font-size: 14px;">B</div>',
        iconSize: null,
        iconAnchor: [10, 10]
    })
}).addTo(map);

L.marker([35.2927, -101.6018], {
    icon: L.divIcon({
        className: 'quad-label',
        html: '<div style="background: white; border: 1px solid red; padding: 2px; font-weight: bold; font-size: 14px;">C</div>',
        iconSize: null,
        iconAnchor: [10, 10]
    })
}).addTo(map);

L.marker([35.2927, -101.6035], {
    icon: L.divIcon({
        className: 'quad-label',
        html: '<div style="background: white; border: 1px solid red; padding: 2px; font-weight: bold; font-size: 14px;">D</div>',
        iconSize: null,
        iconAnchor: [10, 10]
    })
}).addTo(map);

// Add coordinate markers for laydown area corners
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

// Add label for laydown area
L.marker([35.29325, -101.6025], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">LAYDOWN AREA</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

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

// Add markers for conex corners
L.circleMarker([35.293971, -101.602118], {
    radius: 3,
    fillColor: 'darkorange',
    color: 'white',
    weight: 1,
    fillOpacity: 0.9
}).addTo(map)
.bindTooltip(`Conex C1<br>35.293971, -101.602118`,
    {permanent: false, direction: 'top'});

// Add label for Conexes area
L.marker([35.293885, -101.601937], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,140,0,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; color: white;">CONEXES</div>`,
        iconSize: null,
        iconAnchor: [30, 12]
    })
}).addTo(map);

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

// Add coordinate markers for crane area corners
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

// Add coordinate markers for bayonne laydown corners
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

// Calculate crane dimensions for gate width
const craneLatDiff = Math.abs(craneCoords[1][0] - craneCoords[0][0]);
const craneLonDiff = Math.abs(craneCoords[2][1] - craneCoords[1][1]);
const craneNarrowestWidth = Math.min(craneLatDiff, craneLonDiff);

// Add gate on west side of quadrant A (centered)
const gateCenterLat = (35.293958 + centerLat) / 2;
const gateWestLon = -101.603798;
const gateEastLon = gateWestLon + (craneNarrowestWidth * 0.2); // Make it much narrower in X-axis

const gate = L.polygon([
    [gateCenterLat - craneNarrowestWidth/2, gateWestLon],
    [gateCenterLat + craneNarrowestWidth/2, gateWestLon],
    [gateCenterLat + craneNarrowestWidth/2, gateEastLon],
    [gateCenterLat - craneNarrowestWidth/2, gateEastLon]
], {
    color: 'yellow',
    weight: 3,
    opacity: 1,
    fillColor: 'yellow',
    fillOpacity: 0.7
}).addTo(map);

// Add gate label beside it (to the west)
L.marker([gateCenterLat, gateWestLon - 0.00005], {
    icon: L.divIcon({
        className: 'gate-label',
        html: '<div style="background: yellow; border: 2px solid black; padding: 2px; font-weight: bold; font-size: 12px;">GATE</div>',
        iconSize: null,
        iconAnchor: [20, 10]
    })
}).addTo(map);

// Add gate on east side of laydown (centered)
const egateCenterLat = 35.293270 ;
const gateWidth = 0.0001;
const egateEastLon = -101.601252;
const egateWestLon = -101.601300;; 

const egate = L.polygon([
    [egateCenterLat + gateWidth, egateWestLon],
    [egateCenterLat - gateWidth, egateWestLon],
    [egateCenterLat - gateWidth, egateEastLon],
    [egateCenterLat + gateWidth, egateEastLon]
], {
    color: 'pink',
    weight: 3,
    opacity: 1,
    fillColor: 'pink',
    fillOpacity: 0.7
}).addTo(map);

// Add gate label beside it (to the west)
L.marker([egateCenterLat, egateWestLon - 0.00005], {
    icon: L.divIcon({
        className: 'gate-label',
        html: '<div style="background: pink; border: 2px solid black; padding: 2px; font-weight: bold; font-size: 12px;">GATE</div>',
        iconSize: null,
        iconAnchor: [20, 10]
    })
}).addTo(map);

// Function to add area labels
function addAreaLabel(coords, labelText) {
    // Calculate center of the polygon
    const centerLat = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
    const centerLon = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
    
    L.marker([centerLat, centerLon], {
        icon: L.divIcon({
            className: 'area-label',
            html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${labelText}</div>`,
            iconSize: null,
            iconAnchor: [40, 12]
        })
    }).addTo(map);
}

// Add labels for crane and bayonne areas
addAreaLabel(craneCoords, 'CRANE');
addAreaLabel(bayonneCoords, 'BAYONNE LAYDOWN');

// Add a scale control
L.control.scale({
    position: 'bottomleft',
    imperial: true,
    metric: true
}).addTo(map);

// Fit map to laydown area including conexes, crane, and bayonne
const allCoords = [
    ...laydownCoords,
    ...craneCoords,
    ...bayonneCoords,
    conexCorner1
];

const bounds = L.latLngBounds(allCoords);
map.fitBounds(bounds, { padding: [20, 20] });

// Fit map bounds properly without referencing missing DOM elements
const laydownBounds = L.latLngBounds(laydownCoords);
