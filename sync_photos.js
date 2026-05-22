import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist/Fotos/Fotos Carrusel del Index');
const publicDir = path.join(process.cwd(), 'public/Fotos/Fotos Carrusel del Index');

async function syncPhotos() {
  // Get all files from dist
  const distFiles = fs.readdirSync(distDir);
  
  // Get all files from public
  const publicFiles = fs.readdirSync(publicDir);
  
  // Delete all old files in public
  for (const file of publicFiles) {
    fs.unlinkSync(path.join(publicDir, file));
  }
  
  // Copy all files from dist to public
  for (const file of distFiles) {
    fs.copyFileSync(path.join(distDir, file), path.join(publicDir, file));
  }
  
  console.log('Successfully synced photos from dist to public.');
}

syncPhotos();
