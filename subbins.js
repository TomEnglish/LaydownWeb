// Sub-bin Coordinate Calculator
// Each main bin is divided into a 3x3 grid of sub-bins (a-i)
// Layout:  a | b | c    (north row, west to east)
//          d | e | f    (middle row)
//          g | h | i    (south row)

const SUB_BIN_CONFIG = {
    // Base coordinates for laydown area
    topLat: 35.293958,
    leftLon: -101.603798,

    // Main bin dimensions
    binHeight: 0.000282,  // ~31 meters
    binWidth: 0.000364,   // ~33 meters

    // Sub-bin dimensions (1/3 of main bin)
    subBinHeight: 0.000282 / 3,  // ~10.3 meters
    subBinWidth: 0.000364 / 3,   // ~11 meters

    // Column labels (west to east)
    colLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],

    // Sub-bin letter layout (row-major order)
    subBinLetters: [
        ['a', 'b', 'c'],  // top row
        ['d', 'e', 'f'],  // middle row
        ['g', 'h', 'i']   // bottom row
    ],

    // Bayonne bins (excluded from normal grid)
    bayonneBins: ['A4', 'B4', 'C4', 'B5', 'C5', 'D5']
};

/**
 * Get the coordinates of a main bin
 * @param {string} binId - Bin ID like 'A1', 'B3', etc.
 * @returns {object} - { northLat, southLat, westLon, eastLon, centerLat, centerLon }
 */
function getBinCoordinates(binId) {
    const col = binId.charAt(0);
    const row = parseInt(binId.substring(1));

    const colIndex = SUB_BIN_CONFIG.colLabels.indexOf(col);
    const rowIndex = row - 1;

    if (colIndex === -1 || rowIndex < 0 || rowIndex > 4) {
        console.error('Invalid bin ID:', binId);
        return null;
    }

    const northLat = SUB_BIN_CONFIG.topLat - (rowIndex * SUB_BIN_CONFIG.binHeight);
    const southLat = northLat - SUB_BIN_CONFIG.binHeight;
    const westLon = SUB_BIN_CONFIG.leftLon + (colIndex * SUB_BIN_CONFIG.binWidth);
    const eastLon = westLon + SUB_BIN_CONFIG.binWidth;

    return {
        binId,
        northLat,
        southLat,
        westLon,
        eastLon,
        centerLat: (northLat + southLat) / 2,
        centerLon: (westLon + eastLon) / 2,
        width: SUB_BIN_CONFIG.binWidth,
        height: SUB_BIN_CONFIG.binHeight
    };
}

/**
 * Get the coordinates of a sub-bin
 * @param {string} subBinId - Sub-bin ID like 'A1a', 'B3f', etc.
 * @returns {object} - { northLat, southLat, westLon, eastLon, centerLat, centerLon }
 */
function getSubBinCoordinates(subBinId) {
    const binId = subBinId.substring(0, subBinId.length - 1);
    const subLetter = subBinId.charAt(subBinId.length - 1).toLowerCase();

    // Find sub-bin position in grid
    let subRow = -1, subCol = -1;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (SUB_BIN_CONFIG.subBinLetters[r][c] === subLetter) {
                subRow = r;
                subCol = c;
                break;
            }
        }
        if (subRow !== -1) break;
    }

    if (subRow === -1) {
        console.error('Invalid sub-bin letter:', subLetter);
        return null;
    }

    const binCoords = getBinCoordinates(binId);
    if (!binCoords) return null;

    const northLat = binCoords.northLat - (subRow * SUB_BIN_CONFIG.subBinHeight);
    const southLat = northLat - SUB_BIN_CONFIG.subBinHeight;
    const westLon = binCoords.westLon + (subCol * SUB_BIN_CONFIG.subBinWidth);
    const eastLon = westLon + SUB_BIN_CONFIG.subBinWidth;

    return {
        subBinId,
        binId,
        subLetter,
        northLat,
        southLat,
        westLon,
        eastLon,
        centerLat: (northLat + southLat) / 2,
        centerLon: (westLon + eastLon) / 2,
        width: SUB_BIN_CONFIG.subBinWidth,
        height: SUB_BIN_CONFIG.subBinHeight
    };
}

/**
 * Get all sub-bins for a main bin
 * @param {string} binId - Bin ID like 'A1', 'B3', etc.
 * @returns {array} - Array of sub-bin coordinate objects
 */
function getAllSubBins(binId) {
    const subBins = [];
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

    for (const letter of letters) {
        const subBinId = binId + letter;
        const coords = getSubBinCoordinates(subBinId);
        if (coords) {
            subBins.push(coords);
        }
    }

    return subBins;
}

/**
 * Get sub-bin letter from row and column indices (0-based)
 * @param {number} row - Row index (0-2, 0=north)
 * @param {number} col - Column index (0-2, 0=west)
 * @returns {string} - Sub-bin letter (a-i)
 */
function getSubBinLetter(row, col) {
    if (row < 0 || row > 2 || col < 0 || col > 2) return null;
    return SUB_BIN_CONFIG.subBinLetters[row][col];
}

/**
 * Get row and column indices from sub-bin letter
 * @param {string} letter - Sub-bin letter (a-i)
 * @returns {object} - { row, col } (0-based indices)
 */
function getSubBinPosition(letter) {
    const lowerLetter = letter.toLowerCase();
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (SUB_BIN_CONFIG.subBinLetters[r][c] === lowerLetter) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

/**
 * Generate a complete reference table of all sub-bins
 * @returns {object} - Object keyed by sub-bin ID
 */
function generateSubBinReference() {
    const reference = {};

    for (let row = 1; row <= 5; row++) {
        for (let colIndex = 0; colIndex < 7; colIndex++) {
            const binId = SUB_BIN_CONFIG.colLabels[colIndex] + row;

            // Skip Bayonne bins
            if (SUB_BIN_CONFIG.bayonneBins.includes(binId)) continue;

            const subBins = getAllSubBins(binId);
            for (const subBin of subBins) {
                reference[subBin.subBinId] = subBin;
            }
        }
    }

    return reference;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.SubBins = {
        config: SUB_BIN_CONFIG,
        getBinCoordinates,
        getSubBinCoordinates,
        getAllSubBins,
        getSubBinLetter,
        getSubBinPosition,
        generateSubBinReference
    };
}

console.log('SubBins utility loaded');
