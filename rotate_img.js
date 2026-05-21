import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imgPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/1.webp');

async function rotateImage() {
  try {
    const buffer = fs.readFileSync(imgPath);
    // Rotate 90 degrees clockwise
    await sharp(buffer).rotate(90).toFile(imgPath);
    console.log('Image rotated 90 degrees successfully.');
  } catch (err) {
    console.error('Error rotating image:', err);
  }
}

rotateImage();
