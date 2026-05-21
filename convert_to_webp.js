import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function convertImagesToWebp(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await convertImagesToWebp(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const webpPath = fullPath.replace(new RegExp(`\\${path.extname(fullPath)}$`, 'i'), '.webp');
        
        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          
          console.log(`Converted: ${fullPath} -> ${webpPath}`);
          // Remove original file after successful conversion to save space
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(`Error converting ${fullPath}:`, error);
        }
      }
    }
  }
}

async function run() {
  console.log('Starting WebP conversion...');
  await convertImagesToWebp(PUBLIC_DIR);
  console.log('Finished converting images to WebP.');
}

run();
