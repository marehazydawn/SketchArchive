const fs = require('fs');
const path = require('path');

// Define the folder containing your sketches
const sketchesFolder = path.join(__dirname, 'wwwroot', 'sketches');
// Define where to output the manifest file
const manifestFile = path.join(__dirname, 'wwwroot', 'sketches.json');

// Recursively scan a folder and return an array of image objects
function scanFolder(folder, relativePath = '') {
  let images = [];
  const entries = fs.readdirSync(folder);

  entries.forEach(entry => {
    const fullPath = path.join(folder, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recurse into subdirectories
      images = images.concat(scanFolder(fullPath, path.join(relativePath, entry)));
    } else {
      // Filter for common image file extensions (adjust if needed)
      const ext = path.extname(entry).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
        images.push({
          fileName: entry,
          folder: relativePath || 'sketches',
          // File path relative to wwwroot; adjust as needed
          filePath: `/${relativePath ? relativePath + '/' : ''}${entry}`
        });
      }
    }
  });
  return images;
}

// Generate the manifest
const manifest = scanFolder(sketchesFolder);

// Write the manifest file with pretty printing
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`Manifest generated at ${manifestFile}`);
