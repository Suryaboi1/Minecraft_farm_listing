const https = require('https');
const fs = require('fs');
const path = require('path');

const items = require('./src/data/minecraftItems.json');
const imgDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

items.forEach(item => {
  const url = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.20.1/items/${path.basename(item.image)}`;
  const dest = path.join(imgDir, path.basename(item.image));
  
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close());
    } else {
      console.log(`Failed to d/l ${url}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
  });
});

console.log("Downloads started.");
