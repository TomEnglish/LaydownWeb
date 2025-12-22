# LaydownWeb

Interactive web map for the Amarillo area laydown yard. Displays site layout with storage bins, facilities, and inventory tracking via Supabase.

## Quick Start

1. Open `index.html` in a browser
2. Zoom in to level 17+ to see detailed bin grid
3. Click any bin to view inventory details

## Features

- Interactive Leaflet.js map with satellite imagery
- Zoom-dependent detail layers (bins appear at zoom 17+)
- Click bins to open inventory details page
- Supabase database integration for item tracking
- Sub-bin precision (3x3 grid within each bin)

## Project Structure

### Web Application

| File | Description |
|------|-------------|
| `index.html` | Main map application entry point |
| `script.js` | Map logic, bin definitions, click handlers |
| `styles.css` | Map styling and legend panel |
| `bin-details.html` | Bin inventory detail page with sub-bin grid |

### Coordinate Reference

| File | Description |
|------|-------------|
| `Laydown_BinCoordinates.csv` | Original main bin coordinate data |
| `subbins-coordinates.csv` | GPS boundaries for all 261 sub-bins |
| `subbins.js` | JavaScript utility for coordinate calculations |

### Database (Supabase)

| File | Description |
|------|-------------|
| `supabase.js` | Supabase client configuration and CRUD functions |
| `supabase-schema.sql` | Schema for `bin_items` table |
| `supabase-subbins-schema.sql` | Schema for `sub_bins` reference table |

### Legacy/Reference

| File | Description |
|------|-------------|
| `site_map_final_1.html` | Previous map implementation |
| `LaydownBinCoordinates.numbers` | Apple Numbers source file |

## Bin Coordinate System

### Main Bins

- **Columns**: A through G (west to east)
- **Rows**: 1 through 5 (north to south)
- **Total**: 29 active bins (6 Bayonne area bins excluded)

### Excluded Bayonne Bins

A4, B4, C4, B5, C5, D5

### Visual Layout

```
        West ←────────────────────────────────────────────→ East
         A       B       C       D       E       F       G
    ┌───────┬───────┬───────┬───────┬───────┬───────┬───────┐
  1 │  A1   │  B1   │  C1   │  D1   │  E1   │  F1   │  G1   │  North
    ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    ↑
  2 │  A2   │  B2   │  C2   │  D2   │  E2   │  F2   │  G2   │    │
    ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
  3 │  A3   │  B3   │  C3   │  D3   │  E3   │  F3   │  G3   │    │
    ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤    ↓
  4 │ [BAY] │ [BAY] │ [BAY] │  D4   │  E4   │  F4   │  G4   │  South
    ├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
  5 │  A5   │ [BAY] │ [BAY] │ [BAY] │  E5   │  F5   │  G5   │
    └───────┴───────┴───────┴───────┴───────┴───────┴───────┘
```

## Sub-Bin System

Each main bin is divided into a 3x3 grid of sub-bins (a-i):

```
    ┌───┬───┬───┐
    │ a │ b │ c │  ← North row
    ├───┼───┼───┤
    │ d │ e │ f │  ← Middle row
    ├───┼───┼───┤
    │ g │ h │ i │  ← South row
    └───┴───┴───┘
```

**Naming**: `{MainBin}{SubLetter}` (e.g., A1a, B3f, G5i)

**Total sub-bins**: 261 (29 bins × 9 sub-bins)

### Coordinate Constants

```javascript
const CONFIG = {
    // Origin point (northwest corner of A1)
    topLat: 35.293958,
    leftLon: -101.603798,

    // Main bin dimensions (degrees)
    binHeight: 0.000282,   // ~31 meters
    binWidth: 0.000364,    // ~33 meters

    // Sub-bin dimensions (1/3 of main bin)
    subBinHeight: 0.000094,  // ~10.3 meters
    subBinWidth: 0.000121    // ~11 meters
};
```

### Coordinate Calculations

**Main Bin Boundaries:**
```
North Lat = topLat - ((row - 1) * binHeight)
South Lat = North Lat - binHeight
West Lon  = leftLon + (colIndex * binWidth)
East Lon  = West Lon + binWidth
```

**Sub-Bin Boundaries:**
```
Sub-bin row: a-c = 0, d-f = 1, g-i = 2
Sub-bin col: a,d,g = 0, b,e,h = 1, c,f,i = 2

North Lat = Parent North Lat - (subRow * subBinHeight)
South Lat = North Lat - subBinHeight
West Lon  = Parent West Lon + (subCol * subBinWidth)
East Lon  = West Lon + subBinWidth
```

## Developer Usage

### JavaScript

```javascript
// Include subbins.js in your HTML
<script src="subbins.js"></script>

// Get sub-bin coordinates
const coords = SubBins.getSubBinCoordinates('A1e');
// Returns: { subBinId, binId, subLetter, northLat, southLat, westLon, eastLon, centerLat, centerLon }

// Get all sub-bins for a main bin
const allSubBins = SubBins.getAllSubBins('B3');

// Generate complete reference table
const reference = SubBins.generateSubBinReference();
```

### SQL (Supabase)

```sql
-- Query sub-bin by ID
SELECT * FROM sub_bins WHERE sub_bin_id = 'A1e';

-- Get all sub-bins for a main bin
SELECT * FROM sub_bins WHERE bin_id = 'B3' ORDER BY sub_bin_letter;

-- Find sub-bin containing a GPS point
SELECT sub_bin_id FROM sub_bins
WHERE 35.293800 BETWEEN south_lat AND north_lat
  AND -101.603600 BETWEEN west_lon AND east_lon;

-- Get items in a specific bin
SELECT * FROM bin_items WHERE bin_id = 'A1' ORDER BY sub_bin;
```

### Python

```python
import csv

# Load sub-bin reference
subbins = {}
with open('subbins-coordinates.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        subbins[row['sub_bin_id']] = {
            'bin_id': row['bin_id'],
            'north_lat': float(row['north_lat']),
            'south_lat': float(row['south_lat']),
            'west_lon': float(row['west_lon']),
            'east_lon': float(row['east_lon']),
            'center_lat': float(row['center_lat']),
            'center_lon': float(row['center_lon'])
        }

# Get coordinates for A1e
print(subbins['A1e'])
```

### CSV Format

The `subbins-coordinates.csv` file contains:

| Column | Description | Example |
|--------|-------------|---------|
| `sub_bin_id` | Full sub-bin identifier | A1a |
| `bin_id` | Parent main bin | A1 |
| `sub_bin_letter` | Sub-bin position (a-i) | a |
| `north_lat` | North boundary latitude | 35.293958 |
| `south_lat` | South boundary latitude | 35.293864 |
| `west_lon` | West boundary longitude | -101.603798 |
| `east_lon` | East boundary longitude | -101.603677 |
| `center_lat` | Center point latitude | 35.293911 |
| `center_lon` | Center point longitude | -101.603737 |

## Supabase Setup

### 1. Create bin_items table

Run `supabase-schema.sql` in Supabase SQL Editor to create the items table.

### 2. Create sub_bins reference table

Run `supabase-subbins-schema.sql` in Supabase SQL Editor to create and populate the sub-bins reference table with all 261 sub-bin coordinates.

### 3. Configure API key

Update the Supabase URL and anon key in `supabase.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

## Map Features

### Site Areas

- **Laydown Area** - Main storage grid (red)
- **Bayonne Laydown** - Separate storage zone (teal)
- **Crane Area** - Equipment operation zone (brown)
- **Equipment Lot** - Vehicle/equipment storage (blue)
- **Parking Lot** - Vehicle parking (gray)
- **Office Trailers** - Administrative buildings (purple)
- **Lunch Tent** - Break area (green)
- **Guard Shack** - Security checkpoint (yellow)
- **First Aid & Toilets** - Facilities (cyan)
- **Work Site** - Active work area (dark green)
- **Drainage Reservoir** - Water management (navy)

### Pipeline Routes

- P100 Line
- P200 Line
- P300 Line

## Browser Support

Tested with modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

## Location

Center coordinates: 35.2936°N, 101.6030°W (near Amarillo, TX)
