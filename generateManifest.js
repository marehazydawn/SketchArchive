const fs = require('fs');
const path = require('path');

// Define the folder containing your sketches
const sketchesFolder = path.join(__dirname, 'wwwroot', 'sketches');
// Define where to output the manifest file
const manifestFile = path.join(__dirname, 'wwwroot', 'sketches.json');

// Recursively scan a folder and return an array of image objects with folder and fileName
function scanFolder(folder, relativePath = '') {
  let images = [];
  const entries = fs.readdirSync(folder);

  entries.forEach(entry => {
    const fullPath = path.join(folder, entry);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recurse into subdirectories; update the relative path accordingly
      images = images.concat(scanFolder(fullPath, path.join(relativePath, entry)));
    } else {
      // Filter for common image file extensions
      const ext = path.extname(entry).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
        images.push({
          fileName: entry,
          folder: relativePath || 'sketches'
        });
      }
    }
  });
  return images;
}

// Scan the sketches folder
const images = scanFolder(sketchesFolder);

// Group images by their folder
const grouped = images.reduce((acc, curr) => {
  const folderName = curr.folder;
  if (!acc[folderName]) {
    acc[folderName] = [];
  }
  acc[folderName].push(curr.fileName);
  return acc;
}, {});

// Convert the grouped object into an array in the desired format
const manifest = Object.keys(grouped).map(folderName => ({
  Folder: folderName,
  Images: grouped[folderName]
}));

// Write the manifest file with pretty printing
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(`Manifest generated at ${manifestFile}`);
