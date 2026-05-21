import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

async function replaceReferences(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await replaceReferences(fullPath);
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (['.ts', '.tsx', '.json'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalContent = content;
        
        // Update 1.webp to 1_rotated.webp
        content = content.replace(/\/1\.webp/g, '/1_rotated.webp');
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated references in: ${fullPath}`);
        }
      }
    }
  }
}

replaceReferences(SRC_DIR);
console.log('Finished updating references.');
