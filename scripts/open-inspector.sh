#!/bin/bash

# Script to open Appium Inspector with pre-configured capabilities
# Make sure Appium server is running before using this script

echo "🔍 Opening Appium Inspector..."
echo ""
echo "📋 Capabilities file: e2e/inspector-capabilities.json"
echo "🌐 Appium Server: http://localhost:4723"
echo ""
echo "📝 Instructions:"
echo "1. Make sure Appium server is running: npm run appium"
echo "2. Make sure Android emulator/device is running: adb devices"
echo "3. Open Appium Inspector (web or desktop app)"
echo "4. Use the capabilities from: e2e/inspector-capabilities.json"
echo ""
echo "Or visit: http://localhost:4723 in your browser"
echo ""

# Try to open the Appium Inspector URL in default browser
if command -v open &> /dev/null; then
    echo "🌐 Opening Appium Inspector in browser..."
    open "http://localhost:4723"
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening Appium Inspector in browser..."
    xdg-open "http://localhost:4723"
else
    echo "Please open http://localhost:4723 in your browser"
fi

echo ""
echo "📄 Capabilities JSON:"
cat e2e/inspector-capabilities.json

