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

// 1.20 assets directory structure from InventivetalentDev
const baseUrl = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures';

const possiblePaths = (name) => [
  `${baseUrl}/item/${name}.png`,
  `${baseUrl}/block/${name}.png`,
  `${baseUrl}/item/${name}_bucket.png`, // bucket variants
];

async function download() {
  for (const item of itemsData) {
    // Strip trailing .png to match paths
    let baseName = path.basename(item.image, '.png');
    
    // Map mismatched names
    if (baseName === 'redstone') baseName = 'redstone_dust';
    if (baseName === 'water_bucket') baseName = 'water';
    if (baseName === 'lava_bucket') baseName = 'lava';

    const dest = path.join(imgDir, path.basename(item.image));

    let success = false;
    for (const url of possiblePaths(baseName)) {
      if (success) break;
      success = await tryDownload(url, dest);
    }
    
    if (success) {
      console.log('Successfully downloaded', item.id);
    } else {
      console.log('Completely failed to download', item.id, '->', baseName);
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
