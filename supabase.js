// Supabase Configuration
const SUPABASE_URL = 'https://pnybpcizabzvinnywyaq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueWJwY2l6YWJ6dmlubnl3eWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjkyODQsImV4cCI6MjA4MjAwNTI4NH0.Hk0GphVqc5i-J4e0KaBCcx6-XDOXlWUKjm3LRxgLaUs';

// Initialize Supabase client
// The CDN exposes window.supabase.createClient
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client initialized:', db ? 'success' : 'failed');

// Test database connection on load
(async function testConnection() {
    try {
        const { data, error, count } = await db
            .from('bin_items')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Database connection test FAILED:', error.message);
            console.error('Full error:', error);
        } else {
            console.log('Database connection test PASSED');
            // Now fetch actual data to see what's there
            const { data: items } = await db.from('bin_items').select('*');
            console.log('Total items in database:', items ? items.length : 0);
            if (items && items.length > 0) {
                console.log('Sample item:', items[0]);
                console.log('All bin_ids with items:', [...new Set(items.map(i => i.bin_id))]);
            } else {
                console.warn('No items found in bin_items table - run INSERT statements from supabase-schema.sql');
            }
        }
    } catch (e) {
        console.error('Database test exception:', e);
    }
})();

// ============= BIN ITEMS DATABASE FUNCTIONS =============

// Get all items in a specific bin
async function getBinItems(binId) {
    const { data, error } = await db
        .from('bin_items')
        .select('*')
        .eq('bin_id', binId)
        .order('sub_bin', { ascending: true });

    if (error) {
        console.error('Error fetching bin items:', error);
        return [];
    }
    return data;
}

// Get all items across all bins
async function getAllItems() {
    const { data, error } = await db
        .from('bin_items')
        .select('*')
        .order('bin_id', { ascending: true });

    if (error) {
        console.error('Error fetching all items:', error);
        return [];
    }
    return data;
}

// Add a new item to a bin
async function addBinItem(binId, itemName, quantity = 1, subBin = null, notes = null, lat = null, lon = null) {
    const { data, error } = await db
        .from('bin_items')
        .insert([{
            bin_id: binId,
            sub_bin: subBin,
            item_name: itemName,
            quantity: quantity,
            latitude: lat,
            longitude: lon,
            notes: notes
        }])
        .select();

    if (error) {
        console.error('Error adding item:', error);
        return null;
    }
    return data[0];
}

// Update an existing item
async function updateBinItem(itemId, updates) {
    updates.date_modified = new Date().toISOString();

    const { data, error } = await db
        .from('bin_items')
        .update(updates)
        .eq('id', itemId)
        .select();

    if (error) {
        console.error('Error updating item:', error);
        return null;
    }
    return data[0];
}

// Delete an item
async function deleteBinItem(itemId) {
    const { error } = await db
        .from('bin_items')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error deleting item:', error);
        return false;
    }
    return true;
}

// Move an item to a different bin
async function moveItem(itemId, newBinId, newSubBin = null) {
    return updateBinItem(itemId, {
        bin_id: newBinId,
        sub_bin: newSubBin
    });
}

// Get item count per bin (for showing on map)
async function getBinItemCounts() {
    const { data, error } = await db
        .from('bin_items')
        .select('bin_id');

    if (error) {
        console.error('Error fetching bin counts:', error);
        return {};
    }

    // Count items per bin
    const counts = {};
    data.forEach(item => {
        counts[item.bin_id] = (counts[item.bin_id] || 0) + 1;
    });
    return counts;
}

// Search items by name
async function searchItems(searchTerm) {
    const { data, error } = await db
        .from('bin_items')
        .select('*')
        .ilike('item_name', `%${searchTerm}%`);

    if (error) {
        console.error('Error searching items:', error);
        return [];
    }
    return data;
}

// ============= UI HELPER FUNCTIONS =============

// Generate HTML for items list
function renderItemsList(items) {
    if (items.length === 0) {
        return '<p class="no-items">No items in this bin</p>';
    }

    let html = '<ul class="bin-items-list">';
    items.forEach(item => {
        html += `
            <li class="bin-item" data-id="${item.id}">
                <strong>${item.item_name}</strong>
                ${item.sub_bin ? `<span class="sub-bin">[${item.sub_bin}]</span>` : ''}
                <span class="quantity">Qty: ${item.quantity}</span>
                ${item.notes ? `<p class="notes">${item.notes}</p>` : ''}
            </li>
        `;
    });
    html += '</ul>';
    return html;
}

// Show bin details in a popup/modal
async function showBinDetails(binId, binLabel) {
    const items = await getBinItems(binId);
    const itemsHtml = renderItemsList(items);

    return `
        <div class="bin-details">
            <h3>${binLabel || binId}</h3>
            <p>Bin: ${binId} | Items: ${items.length}</p>
            ${itemsHtml}
            <button onclick="openAddItemForm('${binId}')">+ Add Item</button>
        </div>
    `;
}

console.log('Supabase client initialized');
