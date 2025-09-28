const fs = require('fs');

// Path to the package.json file of the project
const packageJsonPath = '../../package.json'; // Adjust the path if needed

// Define the script to be added
const d365jsScript = '"d365js"';

// Add a src folder
fs.mkdir('../../src', (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Directory created successfully!');
});

// Read the package.json file
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading package.json:', err);
    return;
  }

  // Parse the package.json content
  const packageJson = JSON.parse(data);

  // Add the greet script
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.d365js = d365jsScript;

  // Write the modified package.json back
  fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), (err) => {
    if (err) {
      console.error('Error writing package.json:', err);
    } else {
      console.log("Added 'd365js' script to package.json");
    }
  });
});
