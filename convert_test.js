import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const folder = path.join(process.cwd(), 'public/Fotos/Fotos de Prueva');

async function convertTestPhotos() {
  try {
    for (let i = 1; i <= 5; i++) {
      const src = path.join(folder, `${i}.jfif`);
      const dest = path.join(folder, `${i}.webp`);
      
      if (fs.existsSync(src)) {
        await sharp(src)
          .webp({ quality: 85 })
          .toFile(dest);
        console.log(`Converted ${i}.jfif to ${i}.webp`);
      }
    }
  } catch (error) {
    console.error('Error converting test photos:', error);
  }
}

convertTestPhotos();
