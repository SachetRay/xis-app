import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the index.html file
const indexPath = path.join(__dirname, 'build', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths for all resources
html = html.replace(/(src|href)="\/xis-app\//g, '$1="./');
html = html.replace(/(src|href)="\//g, '$1="./');

// Write the modified index.html file
fs.writeFileSync(indexPath, html);

console.log('Fixed paths in build/index.html');

// Read the asset-manifest.json file
const manifestPath = path.join(__dirname, 'build', 'asset-manifest.json');
let manifest = fs.readFileSync(manifestPath, 'utf8');

// Replace absolute paths with relative paths in the asset-manifest.json file
manifest = manifest.replace(/\/xis-app\//g, './');
manifest = manifest.replace(/"\//g, '"./');

// Write the modified asset-manifest.json file
fs.writeFileSync(manifestPath, manifest);

console.log('Fixed paths in build/asset-manifest.json'); 