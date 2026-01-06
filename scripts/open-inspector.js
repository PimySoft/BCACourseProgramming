#!/usr/bin/env node

/**
 * Script to help launch Appium Inspector with pre-configured capabilities
 * Usage: npm run inspector
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const CAPABILITIES_FILE = path.join(__dirname, '../e2e/inspector-capabilities.json');
const INSPECTOR_WEB_URL = 'https://inspector.appiumpro.com';
const INSPECTOR_DESKTOP_APP = '/Applications/Appium Inspector.app';

console.log('🔍 Appium Inspector Helper\n');
console.log('📋 Capabilities file:', CAPABILITIES_FILE);
console.log('\n📝 Instructions:');
console.log('1. Make sure Appium server is running with CORS: npm run appium -- --allow-cors');
console.log('2. Make sure Android emulator/device is running: adb devices');
console.log('3. Choose one of the following options:\n');

// Read and process capabilities
let capabilities;
try {
  capabilities = JSON.parse(fs.readFileSync(CAPABILITIES_FILE, 'utf8'));
  
  // Convert relative app path to absolute path
  if (capabilities['appium:app'] && capabilities['appium:app'].startsWith('./')) {
    const absoluteAppPath = path.resolve(__dirname, '..', capabilities['appium:app']);
    capabilities['appium:app'] = absoluteAppPath;
  }
  
  // Save to a ready-to-use JSON file
  const outputFile = path.join(__dirname, '../e2e/inspector-capabilities-ready.json');
  fs.writeFileSync(outputFile, JSON.stringify(capabilities, null, 2), 'utf8');
  
  console.log('📄 Capabilities JSON (ready to copy):');
  console.log('─'.repeat(60));
  console.log(JSON.stringify(capabilities, null, 2));
  console.log('─'.repeat(60));
  console.log(`\n💾 Also saved to: ${outputFile}`);
  console.log('   You can open this file and copy the JSON from there.\n');
} catch (error) {
  console.error('❌ Error reading capabilities file:', error.message);
  process.exit(1);
}

// Check if desktop Inspector app exists
const platform = process.platform;
let openCommand;

if (platform === 'darwin') {
  openCommand = 'open';
} else if (platform === 'win32') {
  openCommand = 'start';
} else {
  openCommand = 'xdg-open';
}

// Try to open desktop Inspector app first
if (platform === 'darwin') {
  fs.access(INSPECTOR_DESKTOP_APP, fs.constants.F_OK, (err) => {
    if (!err) {
      console.log('🖥️  Opening Appium Inspector desktop app...');
      exec(`open "${INSPECTOR_DESKTOP_APP}"`, (error) => {
        if (error) {
          console.log('⚠️  Could not open desktop app. Using web version instead.\n');
          openWebInspector();
        } else {
          console.log('✅ Desktop Inspector opened!');
          console.log('📋 Server URL: http://localhost:4723');
          console.log('📋 Paste the capabilities JSON above into the Inspector.\n');
        }
      });
    } else {
      console.log('ℹ️  Desktop Inspector app not found at:', INSPECTOR_DESKTOP_APP);
      console.log('📥 Download it from: https://github.com/appium/appium-inspector/releases\n');
      openWebInspector();
    }
  });
} else {
  openWebInspector();
}

function openWebInspector() {
  console.log('🌐 Opening web-based Appium Inspector...');
  console.log('⚠️  IMPORTANT: Make sure Appium server is running with --allow-cors flag!');
  console.log('   Start it with: npm run appium -- --allow-cors\n');
  
  exec(`${openCommand} "${INSPECTOR_WEB_URL}"`, (error) => {
    if (error) {
      console.log(`\n⚠️  Could not auto-open browser. Please manually visit: ${INSPECTOR_WEB_URL}`);
    } else {
      console.log('✅ Web Inspector opened!');
      console.log('📋 Server URL: http://localhost:4723');
      console.log('📋 Paste the capabilities JSON above into the Inspector.\n');
    }
  });
}

