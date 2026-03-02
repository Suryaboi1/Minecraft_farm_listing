import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITEMS_DIR = path.join(__dirname, 'public', 'images', 'items');
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'minecraftItems.json');

// Helper to convert filename to readable name
// minecraft_oak_log.png -> Oak Log
function formatName(rawName) {
    let name = rawName.replace('.png', '');
    if (name.startsWith('minecraft_')) {
        name = name.replace('minecraft_', '');
    }

    // Split by underscore, capitalize first letter of each word
    return name.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to get consistent ID format
// minecraft_oak_log.png -> oak_log
function formatId(rawName) {
    let id = rawName.replace('.png', '');
    if (id.startsWith('minecraft_')) {
        id = id.replace('minecraft_', '');
    }
    return id;
}

async function generate() {
    try {
        console.log(`Reading images from: ${ITEMS_DIR}`);
        const files = fs.readdirSync(ITEMS_DIR);

        const pngFiles = files.filter(f => f.endsWith('.png'));
        console.log(`Found ${pngFiles.length} png files.`);

        const formattedItems = [];

        for (const file of pngFiles) {
            const id = formatId(file);
            const name = formatName(file);

            // Generate the object
            formattedItems.push({
                id: id,
                name: name,
                image: `/images/items/${file}`
            });
        }

        // Sort alphabetically by name
        formattedItems.sort((a, b) => a.name.localeCompare(b.name));

        // Write the new massively expanded JSON array
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedItems, null, 2));

        console.log(`Success! Generated src/data/minecraftItems.json with ${formattedItems.length} items from the local folder.`);

    } catch (error) {
        console.error('Error generating items data:', error);
        process.exit(1);
    }
}

generate();
