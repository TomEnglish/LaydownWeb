# Sub-Bin Coordinate System

This document describes the sub-bin coordinate system used in the Laydown Web application. Use this reference to ensure consistent bin/sub-bin definitions across all applications.

## Overview

The laydown area is divided into a grid of **main bins** (e.g., A1, B3, G5), and each main bin is further divided into a **3x3 grid of sub-bins** labeled a-i.

## Coordinate System

### Main Bins

- **Columns**: A through G (west to east)
- **Rows**: 1 through 5 (north to south)
- **Total Main Bins**: 29 (35 minus 6 Bayonne bins)

### Excluded Bayonne Bins

The following bins are in the Bayonne area and excluded from the standard grid:
- A4, B4, C4, B5, C5, D5

### Sub-Bin Layout

Each main bin is divided into a 3x3 grid of sub-bins:

```
  a | b | c    ← North row (west to east)
  d | e | f    ← Middle row
  g | h | i    ← South row
```

Sub-bin naming: `{MainBin}{SubLetter}` (e.g., A1a, B3f, G5i)

## Reference Files

| File | Description |
|------|-------------|
| [`subbins-coordinates.csv`](./subbins-coordinates.csv) | CSV with GPS boundaries for all 261 sub-bins |
| [`subbins.js`](./subbins.js) | JavaScript utility for coordinate calculations |
| [`supabase-subbins-schema.sql`](./supabase-subbins-schema.sql) | SQL schema for Supabase `sub_bins` table |

## CSV Format

The `subbins-coordinates.csv` file contains the following columns:

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

## Coordinate Constants

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

## Coordinate Calculations

### Main Bin Boundaries

```
North Lat = topLat - ((row - 1) * binHeight)
South Lat = North Lat - binHeight
West Lon  = leftLon + (colIndex * binWidth)
East Lon  = West Lon + binWidth
```

Where `colIndex` is 0-6 for columns A-G.

### Sub-Bin Boundaries

```
Sub-bin row: a-c = 0, d-f = 1, g-i = 2
Sub-bin col: a,d,g = 0, b,e,h = 1, c,f,i = 2

North Lat = Parent North Lat - (subRow * subBinHeight)
South Lat = North Lat - subBinHeight
West Lon  = Parent West Lon + (subCol * subBinWidth)
East Lon  = West Lon + subBinWidth
```

## Usage Examples

### JavaScript

```javascript
// Include subbins.js in your HTML
<script src="subbins.js"></script>

// Get sub-bin coordinates
const coords = SubBins.getSubBinCoordinates('A1e');
console.log(coords);
// {
//   subBinId: 'A1e',
//   binId: 'A1',
//   subLetter: 'e',
//   northLat: 35.293864,
//   southLat: 35.293770,
//   westLon: -101.603677,
//   eastLon: -101.603555,
//   centerLat: 35.293817,
//   centerLon: -101.603616
// }

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

## Visual Reference

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

Each bin contains 9 sub-bins:
    ┌───┬───┬───┐
    │ a │ b │ c │
    ├───┼───┼───┤
    │ d │ e │ f │
    ├───┼───┼───┤
    │ g │ h │ i │
    └───┴───┴───┘
```

## Supabase Integration

To create the sub_bins table in Supabase:

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the contents of [`supabase-subbins-schema.sql`](./supabase-subbins-schema.sql)

This creates:
- `sub_bins` table with coordinate boundaries
- Automatic population of all 261 sub-bins
- RLS policy for anonymous read access

## Contact

For questions about this coordinate system, contact the development team.
