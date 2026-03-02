import fs from 'node:fs';
import https from 'node:https';

const itemsData = JSON.parse(fs.readFileSync('./src/data/minecraftItems.json', 'utf8'));
const totalItems = itemsData.length;

let missingCount = 0;
let checkedCount = 0;

console.log(`Starting to check ${totalItems} items... this will take a few seconds.`);

async function checkUrl(url, itemName) {
    if (url.startsWith('/images/')) {
        // Local files that we know exist
        return true;
    }

    return new Promise((resolve) => {
        https.request(url, { method: 'HEAD' }, (res) => {
            resolve(res.statusCode === 200);
        }).on('error', () => {
            resolve(false);
        }).end();
    });
}

async function run() {
    // Process in batches of 50 to avoid socket hang ups
    const batchSize = 50;

    for (let i = 0; i < itemsData.length; i += batchSize) {
        const batch = itemsData.slice(i, i + batchSize);

        await Promise.all(batch.map(async (item) => {
            const exists = await checkUrl(item.image, item.name);
            if (!exists) {
                missingCount++;
            }
            checkedCount++;
        }));

        process.stdout.write(`\rChecked: ${checkedCount}/${totalItems}...`);
    }

    console.log(`\n\n--- RESULTS ---`);
    console.log(`1. Total searchable items: ${totalItems}`);
    console.log(`2. Items missing an image: ${missingCount}`);
}

run();
