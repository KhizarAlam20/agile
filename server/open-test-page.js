const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the absolute path to the HTML file
const htmlFilePath = path.resolve(__dirname, 'test-login.html');

// Check if the file exists
if (!fs.existsSync(htmlFilePath)) {
  console.error(`File not found: ${htmlFilePath}`);
  process.exit(1);
}

console.log(`Opening ${htmlFilePath} in your default browser...`);

// Open the file in the default browser based on the platform
const command = process.platform === 'win32' 
  ? `start "" "${htmlFilePath}"`
  : process.platform === 'darwin'
    ? `open "${htmlFilePath}"`
    : `xdg-open "${htmlFilePath}"`;

exec(command, (error) => {
  if (error) {
    console.error(`Failed to open browser: ${error.message}`);
    return;
  }
  console.log('Browser opened successfully!');
  console.log('\nTest instructions:');
  console.log('1. Try the "Direct API" tab first to test direct connection to the server');
  console.log('2. Try the "Proxy API" tab to test the proxy configuration');
  console.log('3. Try the "Axios" tab to test with the axios library (similar to React app)');
  console.log('\nCheck the debug section at the bottom for detailed logs');
}); 