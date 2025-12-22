-- Sub-bins Reference Table
-- Each main bin (A1-G5) is divided into a 3x3 grid of sub-bins (a-i)
-- Layout:  a | b | c
--          d | e | f
--          g | h | i

-- Create the sub_bins reference table
CREATE TABLE IF NOT EXISTS sub_bins (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(10) NOT NULL,           -- Parent bin (e.g., 'A1', 'B3')
    sub_bin_id VARCHAR(12) NOT NULL,       -- Full sub-bin ID (e.g., 'A1a', 'B3f')
    sub_bin_letter CHAR(1) NOT NULL,       -- Just the letter (a-i)
    north_lat DECIMAL(9,6) NOT NULL,
    south_lat DECIMAL(9,6) NOT NULL,
    west_lon DECIMAL(9,6) NOT NULL,
    east_lon DECIMAL(9,6) NOT NULL,
    center_lat DECIMAL(9,6) NOT NULL,
    center_lon DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(sub_bin_id)
);

-- Create index for fast lookups
CREATE INDEX idx_sub_bins_bin_id ON sub_bins(bin_id);
CREATE INDEX idx_sub_bins_sub_bin_id ON sub_bins(sub_bin_id);

-- Base coordinates for the laydown area
-- Top-left corner: 35.293958, -101.603798
-- Bin dimensions: height = 0.000282°, width = 0.000364°
-- Sub-bin dimensions: height = 0.000094°, width = 0.000121333°

-- Function to generate all sub-bins for a given main bin
CREATE OR REPLACE FUNCTION generate_sub_bins(
    p_bin_id VARCHAR(10),
    p_north_lat DECIMAL(9,6),
    p_west_lon DECIMAL(9,6),
    p_bin_height DECIMAL(9,6),
    p_bin_width DECIMAL(9,6)
) RETURNS VOID AS $$
DECLARE
    sub_height DECIMAL(9,6) := p_bin_height / 3;
    sub_width DECIMAL(9,6) := p_bin_width / 3;
    letters CHAR(1)[] := ARRAY['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    row_idx INT;
    col_idx INT;
    letter_idx INT := 1;
    sub_north DECIMAL(9,6);
    sub_south DECIMAL(9,6);
    sub_west DECIMAL(9,6);
    sub_east DECIMAL(9,6);
    sub_center_lat DECIMAL(9,6);
    sub_center_lon DECIMAL(9,6);
BEGIN
    FOR row_idx IN 0..2 LOOP
        FOR col_idx IN 0..2 LOOP
            sub_north := p_north_lat - (row_idx * sub_height);
            sub_south := sub_north - sub_height;
            sub_west := p_west_lon + (col_idx * sub_width);
            sub_east := sub_west + sub_width;
            sub_center_lat := (sub_north + sub_south) / 2;
            sub_center_lon := (sub_west + sub_east) / 2;

            INSERT INTO sub_bins (
                bin_id, sub_bin_id, sub_bin_letter,
                north_lat, south_lat, west_lon, east_lon,
                center_lat, center_lon
            ) VALUES (
                p_bin_id,
                p_bin_id || letters[letter_idx],
                letters[letter_idx],
                sub_north, sub_south, sub_west, sub_east,
                sub_center_lat, sub_center_lon
            ) ON CONFLICT (sub_bin_id) DO NOTHING;

            letter_idx := letter_idx + 1;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate sub-bins for all 35 main bins (7 columns x 5 rows)
-- Excluding Bayonne bins: A4, B4, C4, B5, C5, D5

DO $$
DECLARE
    top_lat DECIMAL(9,6) := 35.293958;
    left_lon DECIMAL(9,6) := -101.603798;
    bin_height DECIMAL(9,6) := 0.000282;
    bin_width DECIMAL(9,6) := 0.000364;
    col_labels VARCHAR(1)[] := ARRAY['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    bayonne_bins VARCHAR(10)[] := ARRAY['A4', 'B4', 'C4', 'B5', 'C5', 'D5'];
    bin_id VARCHAR(10);
    bin_north DECIMAL(9,6);
    bin_west DECIMAL(9,6);
    row_num INT;
    col_num INT;
BEGIN
    FOR row_num IN 1..5 LOOP
        FOR col_num IN 1..7 LOOP
            bin_id := col_labels[col_num] || row_num::TEXT;

            -- Skip Bayonne bins
            IF bin_id = ANY(bayonne_bins) THEN
                CONTINUE;
            END IF;

            -- Calculate bin coordinates
            bin_north := top_lat - ((row_num - 1) * bin_height);
            bin_west := left_lon + ((col_num - 1) * bin_width);

            -- Generate sub-bins for this bin
            PERFORM generate_sub_bins(bin_id, bin_north, bin_west, bin_height, bin_width);
        END LOOP;
    END LOOP;
END $$;

-- Update bin_items table to use sub_bin reference
-- The sub_bin column already exists, but let's make sure it's properly linked
ALTER TABLE bin_items
    ADD COLUMN IF NOT EXISTS sub_bin_id VARCHAR(12);

-- Update existing records to have proper sub_bin_id
UPDATE bin_items
SET sub_bin_id = bin_id || sub_bin
WHERE sub_bin IS NOT NULL AND sub_bin_id IS NULL;

-- View to see all sub-bins with their coordinates
CREATE OR REPLACE VIEW sub_bins_view AS
SELECT
    bin_id,
    sub_bin_id,
    sub_bin_letter,
    ROUND(north_lat::numeric, 6) as north_lat,
    ROUND(south_lat::numeric, 6) as south_lat,
    ROUND(west_lon::numeric, 6) as west_lon,
    ROUND(east_lon::numeric, 6) as east_lon,
    ROUND(center_lat::numeric, 6) as center_lat,
    ROUND(center_lon::numeric, 6) as center_lon
FROM sub_bins
ORDER BY bin_id, sub_bin_letter;

-- Sample query to get all sub-bins for bin A1
-- SELECT * FROM sub_bins WHERE bin_id = 'A1' ORDER BY sub_bin_letter;

-- Enable RLS and add policy for sub_bins table
ALTER TABLE sub_bins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read sub_bins" ON sub_bins FOR SELECT TO anon USING (true);
