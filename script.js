// Initialize the map centered on the site
const map = L.map('map', {
    zoomControl: false // Disable default zoom control to avoid conflict
}).setView([35.2935, -101.6028], 16);

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
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
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
    "Satellite": satelliteLayer,
    "Street Map": osmLayer
};

L.control.layers(baseMaps).addTo(map);

// ============= DEFINE COORDINATES FOR ALL AREAS =============

// Laydown Area (main yard)
const laydownCoords = [
    [35.293958, -101.603798],
    [35.293958, -101.601252],
    [35.292548, -101.601252],
    [35.292548, -101.603798]
];

// Lunch Tent
const metalFrameCoords = [
    [35.293586, -101.604386],
    [35.293758, -101.604386],
    [35.293758, -101.604078],
    [35.293586, -101.604078]
];

// Equipment Lot
const equipLotCoords = [
    [35.29408, -101.60123],
    [35.294636, -101.60123],
    [35.294636, -101.603913],
    [35.29408, -101.603913]
];

// Parking Lot
const parkingCoords = [
    [35.294636, -101.603913],
    [35.294636, -101.604341],
    [35.29413, -101.604341],
    [35.29413, -101.603913]
];

// Office Trailers
const officeCoords = [
    [35.293422, -101.604512],
    [35.293422, -101.604076],
    [35.293101, -101.604076],
    [35.293101, -101.604512]
];

// Crane area
const craneCoords = [
    [35.293277, -101.602941],
    [35.293476, -101.602941],
    [35.293476, -101.603577],
    [35.293277, -101.603577]
];

// Bayonne Laydown coordinates (covers bins D1-D3, E2-E4)
const binHeight = 0.000282;
const binWidth = 0.000364;
const topLat = 35.293958;
const leftLon = -101.603798;

const bayonneStartRow = 3; // Row D (0-indexed)
const bayonneEndRow = 4; // Row E
const bayonneNorthLat = topLat - (bayonneStartRow * binHeight);
const bayonneSouthLat = topLat - ((bayonneEndRow + 1) * binHeight);
const bayonneWestLon = leftLon; // Column 1 starts at leftLon
const bayonneEastLon = leftLon + (4 * binWidth); // Through column 4 for E4

// Bayonne Laydown L-shaped area
const bayonneCoords = [
    [bayonneNorthLat, bayonneWestLon],
    [bayonneNorthLat, bayonneWestLon + (3 * binWidth)],
    [bayonneSouthLat, bayonneWestLon + (3 * binWidth)],
    [bayonneSouthLat, bayonneEastLon],
    [bayonneNorthLat - binHeight, bayonneEastLon],
    [bayonneNorthLat - binHeight, bayonneWestLon + binWidth],
    [bayonneNorthLat, bayonneWestLon + binWidth],
    [bayonneNorthLat, bayonneWestLon]
];

// Work Site
const workSiteCoords = [
    [35.294824, -101.60474],
    [35.292619, -101.60474],
    [35.292619, -101.607071],
    [35.294824, -101.607071]
];

// Drainage Reservoir
const drainageCoords = [
    [35.294824, -101.607206],
    [35.294282, -101.607206],
    [35.294282, -101.607591],
    [35.294824, -101.607591]
];

// Conex corners
const conexCorner1 = [35.293971, -101.602118];
const conexCorner2 = [35.293992, -101.602266];

// Guard Shack and First Aid
const guardShackCenter = [35.292971, -101.604691];
const firstAidCenter = [35.292969, -101.60452];

// ============= SITE-WIDE AREAS (Always Visible) =============

// Lunch Tent
const metalFrame = L.polygon(metalFrameCoords, {
    color: 'green',
    weight: 2,
    opacity: 0.8,
    fillColor: 'green',
    fillOpacity: 0.3
}).addTo(map);
metalFrame.bindPopup('<b>Lunch Tent Structure</b>');

// Equipment Lot
const equipLot = L.polygon(equipLotCoords, {
    color: 'blue',
    weight: 2,
    opacity: 0.8,
    fillColor: 'blue',
    fillOpacity: 0.3
}).addTo(map);
equipLot.bindPopup('<b>Equipment Lot</b>');

// Parking Lot
const parkingLot = L.polygon(parkingCoords, {
    color: 'gray',
    weight: 2,
    opacity: 0.8,
    fillColor: 'gray',
    fillOpacity: 0.3
}).addTo(map);
parkingLot.bindPopup('<b>Parking Lot</b>');

// Office Trailers
const officeTrailers = L.polygon(officeCoords, {
    color: 'purple',
    weight: 2,
    opacity: 0.8,
    fillColor: 'purple',
    fillOpacity: 0.3
}).addTo(map);
officeTrailers.bindPopup('<b>Office Trailers</b>');

// Crane area
const craneArea = L.polygon(craneCoords, {
    color: 'brown',
    weight: 2,
    opacity: 0.8,
    fillColor: 'brown',
    fillOpacity: 0.3
}).addTo(map);
craneArea.bindPopup('<b>Crane Area</b>');

// Bayonne Laydown
const bayonneLaydown = L.polygon(bayonneCoords, {
    color: 'teal',
    weight: 2,
    opacity: 0.8,
    fillColor: 'teal',
    fillOpacity: 0.3
}).addTo(map);
bayonneLaydown.bindPopup('<b>Bayonne Laydown</b><br>Bins: D1, D2, D3, E2, E3, E4');

// Work Site
const workSite = L.polygon(workSiteCoords, {
    color: 'darkgreen',
    weight: 2,
    opacity: 0.8,
    fillColor: 'darkgreen',
    fillOpacity: 0.3
}).addTo(map);
workSite.bindPopup('<b>F6B WORK SITE</b>');

// Drainage Reservoir
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

// Guard Shack
const guardShack = L.circle(guardShackCenter, {
    radius: 10,
    color: 'yellow',
    weight: 2,
    opacity: 0.8,
    fillColor: 'yellow',
    fillOpacity: 0.5
}).addTo(map);
guardShack.bindPopup('<b>Guard Shack</b>');

// First Aid & Toilets
const firstAid = L.circle(firstAidCenter, {
    radius: 10,
    color: 'cyan',
    weight: 2,
    opacity: 0.8,
    fillColor: 'cyan',
    fillOpacity: 0.5
}).addTo(map);
firstAid.bindPopup('<b>First Aid & Toilets</b>');

// Conexes (40-meter shipping containers)
const latDiff = conexCorner2[0] - conexCorner1[0];
const lonDiff = conexCorner2[1] - conexCorner1[1];
const rotatedLatDiff = -lonDiff * 0.9;
const rotatedLonDiff = latDiff;
const conexLength = 0.00036;
const conexWidth = 0.000022;
const conexSpacing = 0.000035;

for (let i = 0; i < 4; i++) {
    const offset = i * (conexWidth + conexSpacing);
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

// ============= ZOOM-DEPENDENT LAYERS =============

// Layer groups for zoom-based visibility
const zoomedOutLaydownGroup = L.layerGroup();
const zoomedInLaydownGroup = L.layerGroup();

// ZOOMED OUT: Simple laydown outline (visible when zoom < 17)
const simpleLaydownArea = L.polygon(laydownCoords, {
    color: 'red',
    weight: 2,
    opacity: 0.8,
    fillColor: 'red',
    fillOpacity: 0.3
});
simpleLaydownArea.bindPopup('<b>Laydown Area</b><br>Main storage yard<br><em>Zoom in to see bin details</em>');
zoomedOutLaydownGroup.addLayer(simpleLaydownArea);

// Add simple label for zoomed out view
const simpleLaydownLabel = L.marker([35.29325, -101.6025], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">LAYDOWN AREA</div>`,
        iconSize: null,
        iconAnchor: [60, 12]
    })
});
zoomedOutLaydownGroup.addLayer(simpleLaydownLabel);

// ZOOMED IN: Detailed bin grid (visible when zoom >= 17)
function createDetailedLaydownBins() {
    // Define special bin configurations with BOLD styling
    const specialBins = {
        'A1': { label: 'Tool Conex', color: '#808080', fillColor: '#808080', fillOpacity: 0.65 },
        'A2': { label: 'Tool Conex', color: '#808080', fillColor: '#808080', fillOpacity: 0.65 },
        'A3': { label: 'Receiving', color: '#00BCD4', fillColor: '#00BCD4', fillOpacity: 0.6 },
        'A4': { label: 'Shipping', color: '#2196F3', fillColor: '#2196F3', fillOpacity: 0.6 },
        'A6': { label: 'Surplus', color: '#FFC107', fillColor: '#FFC107', fillOpacity: 0.6 },
        'A7': { label: 'A7', color: '#4A148C', fillColor: '#4A148C', fillOpacity: 0.65 },
        'B3': { label: 'Holding', color: '#FF9800', fillColor: '#FF9800', fillOpacity: 0.6 },
        'B4': { label: 'Holding', color: '#FF9800', fillColor: '#FF9800', fillOpacity: 0.6 },
        'B7': { label: 'TM', color: '#009688', fillColor: '#009688', fillOpacity: 0.6 },
        'D7': { label: 'Combined Cycle', color: '#3F51B5', fillColor: '#3F51B5', fillOpacity: 0.6 },
        'E7': { label: 'Blast Yard', color: '#F44336', fillColor: '#F44336', fillOpacity: 0.6 }
    };

    // Bins that are part of Bayonne Laydown
    const bayonneBins = ['D1', 'D2', 'D3', 'E2', 'E3', 'E4'];

    const rowLabels = ['A', 'B', 'C', 'D', 'E'];

    // Add row headers on the left side
    for (let row = 0; row < 5; row++) {
        const rowLabel = rowLabels[row];
        const headerLat = topLat - (row * binHeight) - (binHeight / 2);
        const headerLon = leftLon - 0.00015;

        const rowHeader = L.marker([headerLat, headerLon], {
            icon: L.divIcon({
                className: 'row-header',
                html: `<div style="background: rgba(255,255,255,0.95); padding: 4px 7px; font-weight: bold; font-size: 13px; border-radius: 3px; border: 2px solid #333; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${rowLabel}</div>`,
                iconSize: null,
                iconAnchor: [0, 8]
            })
        });
        zoomedInLaydownGroup.addLayer(rowHeader);
    }

    // Add column headers at the top
    for (let col = 0; col < 7; col++) {
        const headerLat = topLat + 0.00008;
        const headerLon = leftLon + (col * binWidth) + (binWidth / 2);

        const colHeader = L.marker([headerLat, headerLon], {
            icon: L.divIcon({
                className: 'col-header',
                html: `<div style="background: rgba(255,255,255,0.95); padding: 4px 6px; font-weight: bold; font-size: 13px; border-radius: 3px; border: 2px solid #333; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${col + 1}</div>`,
                iconSize: null,
                iconAnchor: [8, 0]
            })
        });
        zoomedInLaydownGroup.addLayer(colHeader);
    }

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
            const rowLabel = rowLabels[row];
            const binLabel = `${rowLabel}${col + 1}`;

            // Skip creating separate bins for Bayonne Laydown area
            if (bayonneBins.includes(binLabel)) {
                continue;
            }

            // Calculate bin corners
            const northLat = topLat - (row * binHeight);
            const southLat = northLat - binHeight;
            const westLon = leftLon + (col * binWidth);
            const eastLon = westLon + binWidth;

            // Determine bin styling - SUBTLE for regular bins, BOLD for special bins
            let binStyle;
            const isSpecial = specialBins[binLabel];

            if (isSpecial) {
                // Special bins: BOLD and visible
                binStyle = {
                    color: specialBins[binLabel].color,
                    weight: 2.5,
                    opacity: 0.95,
                    fillColor: specialBins[binLabel].fillColor,
                    fillOpacity: specialBins[binLabel].fillOpacity
                };
            } else {
                // Regular bins: VERY subtle
                binStyle = {
                    color: '#CCCCCC',        // Light gray
                    weight: 0.5,             // Thin border
                    opacity: 0.3,            // Semi-transparent border
                    fillColor: '#FFFFFF',    // White fill
                    fillOpacity: 0.05        // Almost transparent
                };
            }

            // Create bin polygon
            const binPolygon = L.polygon([
                [northLat, westLon],
                [northLat, eastLon],
                [southLat, eastLon],
                [southLat, westLon]
            ], binStyle);

            // Determine label text
            const labelText = isSpecial ? specialBins[binLabel].label : binLabel;

            // Add hover tooltip for ALL bins
            binPolygon.bindTooltip(`<b>${labelText}</b><br>Bin: ${binLabel}<br>Row: ${rowLabel} | Column: ${col + 1}`, {
                sticky: true,
                direction: 'top'
            });

            // Add popup with bin information
            binPolygon.bindPopup(`<b>${labelText}</b><br>Bin: ${binLabel}<br>Row: ${rowLabel} | Column: ${col + 1}`);

            // Add hover effects - highlight on mouseover
            const originalStyle = { ...binStyle };
            binPolygon.on('mouseover', function() {
                this.setStyle({
                    weight: 2,
                    opacity: 0.9,
                    fillOpacity: isSpecial ? binStyle.fillOpacity : 0.25
                });
            });

            binPolygon.on('mouseout', function() {
                this.setStyle(originalStyle);
            });

            zoomedInLaydownGroup.addLayer(binPolygon);

            // Only add PERMANENT labels for SPECIAL bins
            if (isSpecial) {
                const centerLat = (northLat + southLat) / 2;
                const centerLon = (westLon + eastLon) / 2;

                const labelBgColor = 'rgba(255,255,255,0.95)';
                const labelBorderColor = specialBins[binLabel].color;
                const labelFontSize = labelText.length > 6 ? '9px' : '10px';

                const labelMarker = L.marker([centerLat, centerLon], {
                    icon: L.divIcon({
                        className: 'bin-label',
                        html: `<div style="background: ${labelBgColor}; border: 2px solid ${labelBorderColor}; padding: 2px 4px; font-weight: bold; font-size: ${labelFontSize}; border-radius: 3px; white-space: nowrap; box-shadow: 1px 1px 3px rgba(0,0,0,0.4);">${labelText}</div>`,
                        iconSize: null,
                        iconAnchor: [labelText.length * 4, 8]
                    })
                });

                zoomedInLaydownGroup.addLayer(labelMarker);
            }
        }
    }

    // Add coordinate markers for laydown area corners
    laydownCoords.forEach((coord, i) => {
        const marker = L.circleMarker(coord, {
            radius: 3,
            fillColor: 'red',
            color: 'white',
            weight: 1,
            fillOpacity: 0.9
        });
        marker.bindTooltip(`Laydown C${i+1}<br>${coord[0].toFixed(6)}, ${coord[1].toFixed(6)}`,
            {permanent: false, direction: 'top'});
        zoomedInLaydownGroup.addLayer(marker);
    });

    // Add label for laydown area
    const detailedLabel = L.marker([35.29325, -101.6025], {
        icon: L.divIcon({
            className: 'area-label',
            html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">LAYDOWN AREA</div>`,
            iconSize: null,
            iconAnchor: [60, 12]
        })
    });
    zoomedInLaydownGroup.addLayer(detailedLabel);

    // Add white outline for laydown area
    const laydownOutline = L.polygon(laydownCoords, {
        color: 'white',
        weight: 2,
        opacity: 0.8,
        fillColor: 'transparent',
        fillOpacity: 0
    });
    zoomedInLaydownGroup.addLayer(laydownOutline);

    // Add gates
    const centerLat = (35.293958 + 35.292548) / 2;
    const craneLatDiff = Math.abs(craneCoords[1][0] - craneCoords[0][0]);
    const craneLonDiff = Math.abs(craneCoords[2][1] - craneCoords[1][1]);
    const craneNarrowestWidth = Math.min(craneLatDiff, craneLonDiff);

    // West gate
    const gateCenterLat = (35.293958 + centerLat) / 2;
    const gateWestLon = -101.603798;
    const gateEastLon = gateWestLon + (craneNarrowestWidth * 0.2);

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
    });
    zoomedInLaydownGroup.addLayer(gate);

    const gateLabel = L.marker([gateCenterLat, gateWestLon - 0.00005], {
        icon: L.divIcon({
            className: 'gate-label',
            html: '<div style="background: yellow; border: 2px solid black; padding: 2px; font-weight: bold; font-size: 12px;">GATE</div>',
            iconSize: null,
            iconAnchor: [20, 10]
        })
    });
    zoomedInLaydownGroup.addLayer(gateLabel);

    // East gate
    const egateCenterLat = 35.293270;
    const gateWidth = 0.0001;
    const egateEastLon = -101.601252;
    const egateWestLon = -101.601300;

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
    });
    zoomedInLaydownGroup.addLayer(egate);

    const egateLabel = L.marker([egateCenterLat, egateWestLon - 0.00005], {
        icon: L.divIcon({
            className: 'gate-label',
            html: '<div style="background: pink; border: 2px solid black; padding: 2px; font-weight: bold; font-size: 12px;">GATE</div>',
            iconSize: null,
            iconAnchor: [20, 10]
        })
    });
    zoomedInLaydownGroup.addLayer(egateLabel);
}

// Create the detailed bins
createDetailedLaydownBins();

// Function to update layer visibility based on zoom level
function updateLayerVisibility() {
    const currentZoom = map.getZoom();
    const DETAIL_ZOOM_THRESHOLD = 17;

    if (currentZoom >= DETAIL_ZOOM_THRESHOLD) {
        // Zoomed in - show detailed bins
        if (!map.hasLayer(zoomedInLaydownGroup)) {
            map.addLayer(zoomedInLaydownGroup);
        }
        if (map.hasLayer(zoomedOutLaydownGroup)) {
            map.removeLayer(zoomedOutLaydownGroup);
        }
    } else {
        // Zoomed out - show simple outline
        if (!map.hasLayer(zoomedOutLaydownGroup)) {
            map.addLayer(zoomedOutLaydownGroup);
        }
        if (map.hasLayer(zoomedInLaydownGroup)) {
            map.removeLayer(zoomedInLaydownGroup);
        }
    }
}

// Add zoom event listener
map.on('zoomend', updateLayerVisibility);

// ============= AREA LABELS (Always Visible) =============

L.marker([35.2937, -101.60425], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">LUNCH TENT</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

L.marker([35.29436, -101.6027], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">EQUIPMENT LOT</div>`,
        iconSize: null,
        iconAnchor: [50, 12]
    })
}).addTo(map);

L.marker([35.29438, -101.60413], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">PARKING</div>`,
        iconSize: null,
        iconAnchor: [35, 12]
    })
}).addTo(map);

L.marker([35.29326, -101.60429], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">OFFICE TRAILERS</div>`,
        iconSize: null,
        iconAnchor: [55, 12]
    })
}).addTo(map);

L.marker([35.29338, -101.60326], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">CRANE</div>`,
        iconSize: null,
        iconAnchor: [25, 12]
    })
}).addTo(map);

L.marker([35.29285, -101.60288], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(0,128,128,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; color: white; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">BAYONNE LAYDOWN</div>`,
        iconSize: null,
        iconAnchor: [65, 12]
    })
}).addTo(map);

L.marker([35.29372, -101.6059], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">F6B WORK SITE</div>`,
        iconSize: null,
        iconAnchor: [50, 12]
    })
}).addTo(map);

L.marker([35.29455, -101.6074], {
    icon: L.divIcon({
        className: 'area-label',
        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 5px; border: 1px solid #333; border-radius: 3px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 2px 2px 4px rgba(0,0,0,0.3);">DRAINAGE</div>`,
        iconSize: null,
        iconAnchor: [40, 12]
    })
}).addTo(map);

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

// Set initial layer visibility after fitBounds completes
// Use setTimeout to ensure fitBounds animation completes first
setTimeout(() => {
    updateLayerVisibility();
}, 100);
