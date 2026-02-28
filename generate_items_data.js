import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ITEMS_URL = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/items.json';
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'minecraftItems.json');

async function fetchAllItems() {
    console.log('Fetching master items list from PrismarineJS (1.20)...');

    return new Promise((resolve, reject) => {
        https.get(ITEMS_URL, (res) => {
            let data = '';

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to fetch items list: ${res.statusCode}`));
                return;
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const allItems = JSON.parse(data);
                    resolve(allItems);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function generate() {
    try {
        const allItemsRaw = await fetchAllItems();
        console.log(`Successfully fetched ${allItemsRaw.length} raw items.`);

        const formattedItems = [];
        let skipped = 0;

        for (const raw of allItemsRaw) {
            // Exclude air
            if (raw.name === 'air') {
                skipped++;
                continue;
            }

            formattedItems.push({
                id: raw.name,
                name: raw.displayName,
                image: `https://raw.githubusercontent.com/undrfined/mc-icons/master/items/${raw.name}.png`
            });
        }

        // Write the new massively expanded JSON array
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedItems, null, 2));

        console.log(`Success! Generated src/data/minecraftItems.json with ${formattedItems.length} items.`);
        console.log(`Skipped ${skipped} items (like air).`);

    } catch (error) {
        console.error('Error generating items data:', error);
        process.exit(1);
    }
}

generate();
