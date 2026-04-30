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

    // Replace Cyan RGBs (my previous changes) back to Purple
    content = content.replace(/6,\s*182,\s*212/g, '124, 58, 237');
    content = content.replace(/6,182,212/g, '124,58,237');
    content = content.replace(/06B6D4/gi, '7C3AED');
    
    // Replace Fuchsia RGBs to Celeste (Accent)
    content = content.replace(/217,\s*70,\s*239/g, '5, 162, 194');
    content = content.replace(/217,70,239/g, '5,162,194');

    // Explicit root custom properties
    if (filePath.endsWith('globals.css')) {
      content = content.replace(/--color-base-100:([^;]+);/g, '--color-base-100: hsl(222, 47%, 8%);');
      content = content.replace(/--color-base-200:([^;]+);/g, '--color-base-200: hsl(222, 47%, 11%);');
      content = content.replace(/--color-base-300:([^;]+);/g, '--color-base-300: hsl(222, 47%, 16%);');
      content = content.replace(/--color-base-content:([^;]+);/g, '--color-base-content: hsl(210, 40%, 98%);');
      
      content = content.replace(/--color-primary:([^;]+);/g, '--color-primary: hsl(262, 83%, 58%);');
      content = content.replace(/--color-accent-pink:([^;]+);/g, '--color-accent-pink: hsl(190, 95%, 39%);');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Applied HSL colors in', filePath);
    }
  }
});
