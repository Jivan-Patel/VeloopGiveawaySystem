import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public/assets/prizes');
fs.mkdirSync(publicDir, { recursive: true });

const images = {
  'iphone-15-pro.jpg': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  'apple-watch.jpg': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
  'airpods-pro.jpg': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
  'amazon-2000.jpg': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  'amazon-500.jpg': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
  'amazon-20.jpg': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
};

async function downloadAll() {
  console.log('Downloading real online copyright-free images from Unsplash...');
  for (const [filename, url] of Object.entries(images)) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(publicDir, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Failed to download ${filename}:`, err.message);
    }
  }
  console.log('Download complete.');
}

downloadAll();
