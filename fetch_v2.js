import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const items = JSON.parse(fs.readFileSync('./src/data/minecraftItems.json', 'utf8'));
const imgDir = path.join(process.cwd(), 'public', 'images', 'items');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

async function download() {
  for (const item of items) {
    const filename = path.basename(item.image);
    const url = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.20.1/items/${filename}`;
    const dest = path.join(imgDir, filename);
    
    await new Promise((resolve) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
             console.log('Downloaded', filename);
             resolve();
          });
        } else {
             console.log('Failed:', filename, res.statusCode);
             resolve();
        }
      }).on('error', () => resolve());
    });
  }
}
download();
