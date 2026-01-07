# BrowserStack CI/CD Setup

Simple guide for setting up BrowserStack E2E testing with CI/CD.

## 🚀 Quick Setup

### 1. Get BrowserStack Credentials
From [browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings):
```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

### 2. Build & Upload APK
```bash
# Build
cd android && ./gradlew assembleDebug && cd ..

# Upload to BrowserStack
npm run browserstack:upload-app

# Copy the App ID from output
export BROWSERSTACK_APP_ID="bs://your_app_id"
```

### 3. Run Tests
```bash
# Local
npm run test:e2e:browserstack:all

# CI/CD - Add to GitHub Secrets:
# - BROWSERSTACK_USERNAME
# - BROWSERSTACK_ACCESS_KEY  
# - BROWSERSTACK_APP_ID
```

## 📋 Commands

```bash
npm run browserstack:upload-app              # Upload APK
npm run test:e2e:browserstack:all            # Run all tests
npm run test:e2e:browserstack:home           # Run home tests
npm run test:e2e:browserstack:cross-feature-integration
npm run test:e2e:browserstack:semester-content
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Credentials required" | Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` |
| "App ID required" | Upload APK: `npm run browserstack:upload-app` |
| "App not found" | App ID expired (30 days), re-upload |
| Upload fails (401) | Check credentials |
| APK not found | Build first: `cd android && ./gradlew assembleDebug` |

## ⚙️ Configuration

**Default Device:** Samsung Galaxy S23 (Android 13.0)

**Custom Device:**
```bash
DEVICE_NAME="Google Pixel 7" OS_VERSION="13.0" \
npm run test:e2e:browserstack:all
```

**CI/CD Workflow:** `.github/workflows/ci-browserstack.yml`
- Builds APK
- Runs tests on BrowserStack
- Generates Allure reports
- Uploads artifacts

## 📊 Reports

- **Allure:** `npm run allure:generate && npm run allure:open`
- **BrowserStack Dashboard:** [app-automate.browserstack.com](https://app-automate.browserstack.com/dashboard/v2/builds)
- **GitHub Artifacts:** Available after workflow runs
