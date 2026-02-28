import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsFile = path.join(__dirname, 'src', 'data', 'minecraftItems.json');
const itemsData = JSON.parse(fs.readFileSync(itemsFile, 'utf8'));

const imgDir = path.join(__dirname, 'public', 'images', 'items');

if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

// Some are blocks, some are items.
const getUrl = (filename, type) =>
    `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.20.1/${type}/${filename}`;

async function download() {
    for (const item of itemsData) {
        const filename = path.basename(item.image);
        const dest = path.join(imgDir, filename);

        // Try item first, then block
        let success = await tryDownload(getUrl(filename, 'items'), dest);
        if (!success) {
            success = await tryDownload(getUrl(filename, 'blocks'), dest);
        }

        if (success) {
            console.log('Successfully downloaded', filename);
        } else {
            console.log('Completely failed to download', filename);
        }
    }
}

function tryDownload(url, dest) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => resolve(true));
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
}

download();
