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

const baseUrl = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.20.1/assets/minecraft/textures';

const customMap = {
  'piston': `${baseUrl}/block/piston_top.png`,
  'sticky_piston': `${baseUrl}/block/piston_top_sticky.png`,
  'observer': `${baseUrl}/block/observer_front.png`,
  'redstone_dust': `${baseUrl}/item/redstone.png`,
  'chest': `${baseUrl}/block/chest_top.png`, // Chest lacks an item icon directly in standard rip
  'honey_block': `${baseUrl}/block/honey_block_top.png`,
  'dispenser': `${baseUrl}/block/dispenser_front.png`,
  'dropper': `${baseUrl}/block/dropper_front.png`,
  'target_block': `${baseUrl}/block/target_top.png`,
};

const possiblePaths = (name) => {
  if (customMap[name]) return [customMap[name]];
  return [
    `${baseUrl}/item/${name}.png`,
    `${baseUrl}/block/${name}.png`,
  ];
};

async function download() {
  for (const item of itemsData) {
    let baseName = path.basename(item.image, '.png');
    
    // Reverse some specific previous map attempts
    if (baseName === 'redstone') baseName = 'redstone_dust';
    if (baseName === 'target') baseName = 'target_block';

    const dest = path.join(imgDir, path.basename(item.image));

    let success = false;
    for (const url of possiblePaths(baseName)) {
      if (success) break;
      success = await tryDownload(url, dest);
    }
    
    if (success) {
      console.log('Successfully downloaded', item.id);
    } else {
      console.log('Completely failed to download', item.id);
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
