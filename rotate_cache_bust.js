import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const originalPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/1.webp');
const newPath = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index/1_rotated.webp');

async function rotateImage() {
  try {
    const buffer = fs.readFileSync(originalPath);
    // Head is at 3 o'clock (right). Rotate 270 clockwise (90 counter-clockwise) to put head at 12 o'clock (top).
    await sharp(buffer).rotate(270).toFile(newPath);
    console.log('Image rotated and saved as 1_rotated.webp successfully.');
  } catch (err) {
    console.error('Error rotating image:', err);
  }
}

rotateImage();
