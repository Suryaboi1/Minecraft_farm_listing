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
  const CONCURRENCY = 20;
  console.log(`Starting download for ${items.length} items (Concurrency: ${CONCURRENCY})...`);

  let successCount = 0;
  let missingCount = 0;

  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);

    await Promise.all(batch.map(async (item) => {
      const filename = path.basename(item.image);
      const url = `https://raw.githubusercontent.com/undrfined/mc-icons/master/items/${filename}`;
      const dest = path.join(imgDir, filename);

      // Skip if already exists to make re-runs faster
      if (fs.existsSync(dest)) {
        successCount++;
        return;
      }

      return new Promise((resolve) => {
        https.get(url, (res) => {
          if (res.statusCode === 200) {
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
              successCount++;
              resolve();
            });
          } else {
            missingCount++;
            resolve();
          }
        }).on('error', () => resolve());
      });
    }));

    // Simple progress
    if ((i + CONCURRENCY) % 200 === 0 || i + CONCURRENCY >= items.length) {
      console.log(`Processed ${Math.min(i + CONCURRENCY, items.length)} / ${items.length}`);
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Successfully downloaded/found: ${successCount}`);
  console.log(`Missing icons (404/Not in repo): ${missingCount}`);
}
download();
