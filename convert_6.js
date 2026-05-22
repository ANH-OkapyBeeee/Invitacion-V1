import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const originalPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/6.png');
const newPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/6_new.webp');
const oldWebpPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/6.webp');

async function convertImage() {
  try {
    const buffer = fs.readFileSync(originalPath);
    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(newPath);
    console.log('Converted 6.png to 6_new.webp successfully.');
    
    // Clean up old files
    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    if (fs.existsSync(oldWebpPath)) fs.unlinkSync(oldWebpPath);
    console.log('Cleaned up old files.');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}

convertImage();
