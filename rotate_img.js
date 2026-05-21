import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imgPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/1.webp');

async function rotateImage() {
  try {
    const buffer = fs.readFileSync(imgPath);
    // Rotate 270 degrees clockwise (which is 90 degrees left/counter-clockwise)
    await sharp(buffer).rotate(270).toFile(imgPath);
    console.log('Image rotated 90 degrees left successfully.');
  } catch (err) {
    console.error('Error rotating image:', err);
  }
}

rotateImage();
