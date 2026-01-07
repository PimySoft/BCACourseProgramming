#!/usr/bin/env node

/**
 * Script to upload Android APK to BrowserStack App Automate
 * Usage: npm run browserstack:upload-app
 * 
 * Requires environment variables:
 * - BROWSERSTACK_USERNAME
 * - BROWSERSTACK_ACCESS_KEY
 * - APK_PATH (optional, defaults to android/app/build/outputs/apk/debug/app-debug.apk)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const APK_PATH = process.env.APK_PATH || path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');

if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY) {
  console.error('❌ Error: BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables are required');
  process.exit(1);
}

if (!fs.existsSync(APK_PATH)) {
  console.error(`❌ Error: APK file not found at ${APK_PATH}`);
  console.error('   Please build the APK first: cd android && ./gradlew assembleDebug');
  process.exit(1);
}

const fileStats = fs.statSync(APK_PATH);
const fileSize = fileStats.size;

console.log('📤 Uploading APK to BrowserStack...');
console.log(`   File: ${APK_PATH}`);
console.log(`   Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

// Use multipart/form-data for file upload
const FormData = require('form-data');
const form = new FormData();
form.append('file', fs.createReadStream(APK_PATH));

const options = {
  hostname: 'api-cloud.browserstack.com',
  port: 443,
  path: '/app-automate/upload',
  method: 'POST',
  auth: `${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`,
  headers: form.getHeaders()
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('✅ APK uploaded successfully!');
      console.log(`\n📱 App ID: ${response.app_url}`);
      console.log(`\n💡 Set this as your BROWSERSTACK_APP_ID environment variable:`);
      console.log(`   export BROWSERSTACK_APP_ID="${response.app_url}"`);
      console.log(`\n   Or add it to your GitHub Secrets for CI/CD.`);
      
      // Write to .env file if it exists or create one
      const envPath = path.join(__dirname, '../.env.browserstack');
      const envContent = `BROWSERSTACK_APP_ID=${response.app_url}\n`;
      fs.writeFileSync(envPath, envContent);
      console.log(`\n💾 Saved to ${envPath}`);
    } else {
      console.error(`❌ Upload failed with status ${res.statusCode}`);
      console.error(`   Response: ${data}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Error uploading APK: ${error.message}`);
  process.exit(1);
});

form.pipe(req);

