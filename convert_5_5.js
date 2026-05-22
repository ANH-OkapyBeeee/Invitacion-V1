import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const originalPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/5.5.png');
const newPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/5.5.webp');

async function convertImage() {
  try {
    const buffer = fs.readFileSync(originalPath);
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(newPath);
    console.log('Converted 5.5.png to 5.5.webp successfully.');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}

convertImage();
