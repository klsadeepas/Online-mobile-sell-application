const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/>\$/g, '>Rs. ');
  newContent = newContent.replace(/\$\$\{/g, 'Rs. ${');
  newContent = newContent.replace(/"\$"/g, '"Rs. "');
  newContent = newContent.replace(/'\$'/g, "'Rs. '");
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'frontend/src'));
