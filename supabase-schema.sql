-- Run this in Supabase SQL Editor (supabase.com → Your Project → SQL Editor)

-- Create bin_items table
CREATE TABLE bin_items (
    id SERIAL PRIMARY KEY,
    bin_id VARCHAR(10) NOT NULL,           -- e.g., 'A1', 'B3', 'G5'
    sub_bin VARCHAR(2),                     -- e.g., 'a', 'b', ... 'l' for subdivisions
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    latitude DECIMAL(9,6),                  -- 6 decimal places for ~10cm precision
    longitude DECIMAL(9,6),
    date_added TIMESTAMP DEFAULT NOW(),
    date_modified TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'in_stock'  -- in_stock, reserved, shipped, etc.
);

-- Create index for fast bin lookups
CREATE INDEX idx_bin_items_bin_id ON bin_items(bin_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE bin_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (for development - tighten for production)
CREATE POLICY "Allow public access" ON bin_items
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO bin_items (bin_id, sub_bin, item_name, quantity, notes) VALUES
    ('A1', 'a', 'Pipe Fittings 2"', 50, 'Galvanized'),
    ('A1', 'b', 'Pipe Fittings 4"', 25, 'Galvanized'),
    ('C1', NULL, 'Incoming Shipment #1234', 1, 'Awaiting inspection'),
    ('D1', NULL, 'Outbound Pallet #5678', 1, 'Ready for pickup'),
    ('E3', 'a', 'Steel Plates 1/4"', 100, 'Stack A'),
    ('E3', 'b', 'Steel Plates 1/2"', 75, 'Stack B'),
    ('G5', NULL, 'Sandblasting Equipment', 3, 'Blast yard items');
