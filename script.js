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

// Create laydown bins (5 rows x 7 columns = 35 bins)
// Based on CSV data: bin height = 0.000282, bin width = 0.000364
const binHeight = 0.000282;
const binWidth = 0.000364;
const topLat = 35.293958;
const leftLon = -101.603798;

// Define colors for each row
const rowColors = {
    'A': { color: '#FF6B6B', fillColor: '#FF6B6B' }, // Red
    'B': { color: '#4ECDC4', fillColor: '#4ECDC4' }, // Teal
    'C': { color: '#45B7D1', fillColor: '#45B7D1' }, // Blue
    'D': { color: '#96CEB4', fillColor: '#96CEB4' }, // Green
    'E': { color: '#FFEAA7', fillColor: '#FFEAA7' }  // Yellow
};

// Define special bin configurations
const specialBins = {
    'A1': { label: 'Tool Conex', color: '#808080', fillColor: '#808080', fillOpacity: 0.6 },
    'A2': { label: 'Tool Conex', color: '#808080', fillColor: '#808080', fillOpacity: 0.6 },
    'A3': { label: 'Receiving', color: '#00BCD4', fillColor: '#00BCD4', fillOpacity: 0.4 },
    'A4': { label: 'Shipping', color: '#2196F3', fillColor: '#2196F3', fillOpacity: 0.4 },
    'A6': { label: 'Surplus', color: '#FFC107', fillColor: '#FFC107', fillOpacity: 0.4 },
    'A7': { label: 'A7', color: '#4A148C', fillColor: '#4A148C', fillOpacity: 0.6 }, // Dark purple
    'B3': { label: 'Holding', color: '#FF9800', fillColor: '#FF9800', fillOpacity: 0.4 },
    'B4': { label: 'Holding', color: '#FF9800', fillColor: '#FF9800', fillOpacity: 0.4 },
    'B7': { label: 'TM', color: '#009688', fillColor: '#009688', fillOpacity: 0.4 },
    'D7': { label: 'Combined Cycle', color: '#3F51B5', fillColor: '#3F51B5', fillOpacity: 0.4 },
    'E7': { label: 'Blast Yard', color: '#F44336', fillColor: '#F44336', fillOpacity: 0.4 }
};

// Bins that are part of Bayonne Laydown
const bayonneBins = ['D1', 'D2', 'D3', 'E2', 'E3', 'E4'];

// Store all bins for easier management
const laydownBins = {};
const binLabels = {}; // Store label markers for later removal/modification

// Create bins using nested loops
const rowLabels = ['A', 'B', 'C', 'D', 'E'];
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
        const rowLabel = rowLabels[row];
        const binLabel = `${rowLabel}${col + 1}`;
        
        // Calculate bin corners
        const northLat = topLat - (row * binHeight);
        const southLat = northLat - binHeight;
        const westLon = leftLon + (col * binWidth);
        const eastLon = westLon + binWidth;
        
        // Skip creating separate bins for Bayonne Laydown area
        if (bayonneBins.includes(binLabel)) {
            continue;
        }
        
        // Determine bin styling
        let binStyle = {
            color: rowColors[rowLabel].color,
            weight: 1,
            opacity: 0.8,
            fillColor: rowColors[rowLabel].fillColor,
            fillOpacity: 0.2
        };
        
        // Override with special bin styling if applicable
        if (specialBins[binLabel]) {
            binStyle = {
                color: specialBins[binLabel].color,
                weight: 2,
                opacity: 0.9,
                fillColor: specialBins[binLabel].fillColor,
                fillOpacity: specialBins[binLabel].fillOpacity
            };
        }
        
        // Create bin polygon
        const binPolygon = L.polygon([
            [northLat, westLon],  // NW corner
            [northLat, eastLon],  // NE corner
            [southLat, eastLon],  // SE corner
            [southLat, westLon]   // SW corner
        ], binStyle).addTo(map);
        
        // Determine label text
        const labelText = specialBins[binLabel] ? specialBins[binLabel].label : binLabel;
        
        // Add popup with bin information
        binPolygon.bindPopup(`<b>${labelText}</b><br>Bin: ${binLabel}<br>Row: ${rowLabel} | Column: ${col + 1}`);
        
        // Store reference to bin
        laydownBins[binLabel] = binPolygon;
        
        // Add bin label at center of each bin
        const centerLat = (northLat + southLat) / 2;
        const centerLon = (westLon + eastLon) / 2;
        
        // Determine label styling
        const labelBgColor = specialBins[binLabel] ? 
            'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)';
        const labelBorderColor = specialBins[binLabel] ? 
            specialBins[binLabel].color : rowColors[rowLabel].color;
        const labelFontSize = specialBins[binLabel] && labelText.length > 6 ? '9px' : '10px';
        
        const labelMarker = L.marker([centerLat, centerLon], {
            icon: L.divIcon({
                className: 'bin-label',
                html: `<div style="background: ${labelBgColor}; border: 1px solid ${labelBorderColor}; padding: 1px 3px; font-weight: bold; font-size: ${labelFontSize}; border-radius: 2px; white-space: nowrap;">${labelText}</div>`,
                iconSize: null,
                iconAnchor: [labelText.length * 4, 8]
            })
        }).addTo(map);
        
        binLabels[binLabel] = labelMarker;
    }
}

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

// Bayonne Laydown (covers bins D1, D2, D3, E2, E3, E4)
// Calculate the coordinates based on bin positions
const bayonneStartRow = 3; // Row D (0-indexed)
const bayonneEndRow = 4; // Row E
const bayonneNorthLat = topLat - (bayonneStartRow * binHeight);
const bayonneSouthLat = topLat - ((bayonneEndRow + 1) * binHeight);
const bayonneWestLon = leftLon; // Column 1 starts at leftLon
const bayonneEastLon = leftLon + (4 * binWidth); // Through column 4 for E4

// Create custom shape for Bayonne Laydown (L-shaped area)
const bayonneCoords = [
    // Start at D1 northwest corner
    [bayonneNorthLat, bayonneWestLon],
    // Go east to D3's northeast corner
    [bayonneNorthLat, bayonneWestLon + (3 * binWidth)],
    // Go south to E3's southeast corner  
    [bayonneSouthLat, bayonneWestLon + (3 * binWidth)],
    // Go east to E4's southeast corner
    [bayonneSouthLat, bayonneEastLon],
    // Go north to D4's northeast corner (but we only want E4, so stay at E level)
    [bayonneNorthLat - binHeight, bayonneEastLon],
    // Go west to E2's southwest corner
    [bayonneNorthLat - binHeight, bayonneWestLon + binWidth],
    // Go north to D2's southwest corner
    [bayonneNorthLat, bayonneWestLon + binWidth],
    // Go west back to D1's northwest corner
    [bayonneNorthLat, bayonneWestLon]
];

const bayonneLaydown = L.polygon(bayonneCoords, {
    color: 'teal',
    weight: 2,
    opacity: 0.8,
    fillColor: 'teal',
    fillOpacity: 0.3
}).addTo(map);
bayonneLaydown.bindPopup('<b>Bayonne Laydown</b><br>Bins: D1, D2, D3, E2, E3, E4');

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
function addAreaLabel(coords, labelText, color = 'rgba(255,255,255,0.9)') {
    // Calculate center of the polygon
    let centerLat, centerLon;
    
    if (labelText === 'BAYONNE LAYDOWN') {
        // For Bayonne, position in the middle of the L-shaped area
        centerLat = topLat - (3.5 * binHeight); // Between D and E rows
        centerLon = leftLon + (2 * binWidth); // Around column 2-3
    } else {
        centerLat = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
        centerLon = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
    }
    
    L.marker([centerLat, centerLon], {
        icon: L.divIcon({
            className: 'area-label',
            html: `<div style="background: ${color}; padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${labelText}</div>`,
            iconSize: null,
            iconAnchor: [40, 12]
        })
    }).addTo(map);
}

// Add labels for crane and bayonne areas
addAreaLabel(craneCoords, 'CRANE');
addAreaLabel([], 'BAYONNE LAYDOWN', 'rgba(0,128,128,0.9)');

// Add a scale control
L.control.scale({
    position: 'bottomleft',
    imperial: true,
    metric: true
}).addTo(map);

// Fit map to laydown area including conexes and crane
const allCoords = [
    ...laydownCoords,
    ...craneCoords,
    conexCorner1
];

const bounds = L.latLngBounds(allCoords);
map.fitBounds(bounds, { padding: [20, 20] });

// Fit map bounds properly without referencing missing DOM elements
const laydownBounds = L.latLngBounds(laydownCoords);

// ============= UTILITY FUNCTIONS FOR BIN MANAGEMENT =============

// Function to highlight a specific bin
function highlightBin(binLabel, color = 'red') {
    if (laydownBins[binLabel]) {
        laydownBins[binLabel].setStyle({
            color: color,
            weight: 3,
            fillOpacity: 0.5
        });
    }
}

// Function to reset bin style
function resetBinStyle(binLabel) {
    const rowLabel = binLabel[0];
    if (laydownBins[binLabel] && rowColors[rowLabel]) {
        laydownBins[binLabel].setStyle({
            color: rowColors[rowLabel].color,
            weight: 1,
            opacity: 0.8,
            fillColor: rowColors[rowLabel].fillColor,
            fillOpacity: 0.2
        });
    }
}

// Function to add material/equipment to a bin
function addMaterialToBin(binLabel, materialName, quantity) {
    if (laydownBins[binLabel]) {
        const currentPopup = laydownBins[binLabel].getPopup().getContent();
        const newContent = currentPopup + `<br><strong>Material:</strong> ${materialName}<br><strong>Quantity:</strong> ${quantity}`;
        laydownBins[binLabel].setPopupContent(newContent);
    }
}

// Function to get bin by row and column
function getBin(row, column) {
    const binLabel = `${row}${column}`;
    return laydownBins[binLabel] || null;
}

// Function to highlight multiple bins
function highlightBins(binLabels, color = 'orange') {
    binLabels.forEach(label => highlightBin(label, color));
}

// Function to clear all bin highlights
function clearAllHighlights() {
    Object.keys(laydownBins).forEach(binLabel => resetBinStyle(binLabel));
}

// Function to get bins in a row
function getBinsInRow(rowLabel) {
    const bins = [];
    for (let col = 1; col <= 7; col++) {
        bins.push(`${rowLabel}${col}`);
    }
    return bins;
}

// Function to get bins in a column
function getBinsInColumn(colNumber) {
    const bins = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    rows.forEach(row => {
        bins.push(`${row}${colNumber}`);
    });
    return bins;
}

// Function to set bin occupancy status
function setBinOccupancy(binLabel, isOccupied, occupancyInfo = '') {
    if (laydownBins[binLabel]) {
        const fillOpacity = isOccupied ? 0.7 : 0.2;
        laydownBins[binLabel].setStyle({ fillOpacity: fillOpacity });
        
        if (occupancyInfo) {
            addMaterialToBin(binLabel, occupancyInfo, '');
        }
    }
}

// Example usage (uncomment to test):
// highlightBin('A1', 'purple');
// highlightBins(['B3', 'B4', 'B5'], 'green');
// addMaterialToBin('C2', 'Steel Pipes', '50 units');
// setBinOccupancy('D4', true, 'Construction Equipment');

// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        highlightBin,
        resetBinStyle,
        addMaterialToBin,
        getBin,
        highlightBins,
        clearAllHighlights,
        getBinsInRow,
        getBinsInColumn,
        setBinOccupancy,
        laydownBins
    };
}