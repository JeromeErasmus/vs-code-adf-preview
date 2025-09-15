#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTests() {
  log('blue', '🧪 Running ADF Preview Extension Tests...\n');
  
  const testCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = ['run', 'test'];
  
  const testProcess = spawn(testCommand, args, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  testProcess.on('close', (code) => {
    if (code === 0) {
      log('green', '\n✅ All tests passed!');
      log('green', 'Extension is ready for development and deployment.');
    } else {
      log('red', '\n❌ Tests failed!');
      log('yellow', 'Please fix the failing tests before proceeding.');
      process.exit(1);
    }
  });
  
  testProcess.on('error', (err) => {
    log('red', `\n❌ Failed to run tests: ${err.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };