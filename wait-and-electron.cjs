const http = require('http');
const { spawn } = require('child_process');

function waitForVite(callback, retries = 40) {
  const req = http.get('http://localhost:5173', (res) => {
    callback();
  });
  req.on('error', () => {
    if (retries <= 0) {
      console.log('Vite server ready or using dist fallback...');
      return callback();
    }
    setTimeout(() => waitForVite(callback, retries - 1), 250);
  });
}

console.log('Connecting to UI dev server on http://localhost:5173...');
waitForVite(() => {
  console.log('Opening Poland Internship Hunter Desktop Window...');
  const child = spawn('cmd.exe', ['/c', 'npx', 'electron', '.'], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_START_URL: 'http://localhost:5173' }
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
});
