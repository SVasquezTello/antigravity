import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDir = fs.statSync(dirPath).isDirectory();
    isDir ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Primary: 7C3AED -> 06B6D4
    // Primary RGB: 124, 58, 237 -> 6, 182, 212
    content = content.replace(/124,\s*58,\s*237/g, '6, 182, 212');
    content = content.replace(/124,58,237/g, '6,182,212');
    content = content.replace(/7C3AED/g, '06B6D4');
    content = content.replace(/7c3aed/g, '06b6d4');

    // Accent Pink: EC4899 -> D946EF
    // Accent Pink RGB: 236, 72, 153 -> 217, 70, 239
    content = content.replace(/236,\s*72,\s*153/g, '217, 70, 239');
    content = content.replace(/236,72,153/g, '217,70,239');
    content = content.replace(/EC4899/g, 'D946EF');
    content = content.replace(/ec4899/g, 'd946ef');

    // Update global CSS base colors explicitly
    if (filePath.endsWith('globals.css')) {
      content = content.replace(/--color-base-100: #050014;/g, '--color-base-100: #020617;');
      content = content.replace(/--color-base-200: #0A0520;/g, '--color-base-200: #0f172a;');
      content = content.replace(/--color-base-300: #150D30;/g, '--color-base-300: #1e293b;');
      content = content.replace(/--color-primary: #06B6D4;/gi, '--color-primary: #06B6D4;');
      content = content.replace(/--color-accent-pink: #D946EF;/gi, '--color-accent-pink: #D946EF;');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated colors in', filePath);
    }
  }
});
