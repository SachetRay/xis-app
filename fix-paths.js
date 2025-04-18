import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the index.html file
const indexPath = path.join(__dirname, 'build', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths, but only for script and link tags
html = html.replace(/(src|href)="\/xis-app\//g, '$1="');

// Write the modified index.html file
fs.writeFileSync(indexPath, html);

console.log('Fixed paths in build/index.html'); 