import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

async function replaceExtensions(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await replaceExtensions(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.ts', '.tsx', '.json'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Use regex to replace .jpg, .JPG, .png, .jpeg to .webp
        content = content.replace(/\.(jpg|jpeg|png|JPG|PNG|JPEG)/g, '.webp');
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated references in: ${fullPath}`);
        }
      }
    }
  }
}

replaceExtensions(SRC_DIR);
console.log('Finished updating image extensions.');
