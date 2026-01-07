# Tech Test Documentation

## React Native Project

**BCA Course Programming** is a React Native mobile application for BCA students, providing semester-wise notes, practicals, an integrated compiler, interview questions, and programming resources.

- **Framework**: React Native 0.82.1
- **Navigation**: React Navigation v7
- **Platform**: Android (iOS available but not tested)

## Setup and Run Instructions

### Prerequisites
- Node.js >= 20
- Android Studio with Android SDK
- Android Emulator or physical device

### Steps
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Build APK for testing
npm run build
```

### Automation Testing Setup
- Install Appium: `npm install -g appium`
- Install driver: `appium driver install uiautomator2`
- Ensure Android emulator is running or device connected via USB debugging

## Application Functionality Overview

The app includes:
- **Home Page**: Navigation hub with semester cards and quick access to features
- **Semester Content**: Notes and code examples organized by semester
- **Compiler**: Online C, C++, Java compiler (WebView-based)
- **Blog**: Programming content feed
- **Interview**: 1000+ interview questions
- **MCQ Quiz**: Multiple choice question functionality

### Areas Tested Using Automation

**17 automated tests** covering:
- **Home Page** (6 tests): Element display, navigation, scrolling, semester cards
- **Compiler Page** (2 tests): Navigation to/from compiler page
- **Cross-Feature Integration** (5 tests): Navigation between home, blog, compiler, interview pages
- **Semester Content Flow** (4 tests): Semester navigation, tab switching, scrolling, menu functionality

## Automation Tests

### Framework: Appium + WebdriverIO + TypeScript

**Architecture**: Page Object Model (POM) pattern with TypeScript

**Element Selection**: Accessibility IDs (testID) with UIAutomator2 fallbacks

### Development Process

The test suite was developed using **Cursor AI** with an iterative, incremental approach:

1. **Small Progressive Increments**: Each feature was built in small, focused increments (e.g., single page object, individual test case, specific utility method)

2. **Code Review and Refinement**: After each increment, the generated code was reviewed and refined through:
   - Requesting specific changes and improvements
   - Ensuring adherence to coding standards
   - Verifying best practices are followed
   - Refactoring for maintainability

3. **Iterative Improvement**: The process involved multiple cycles of:
   - AI-assisted code generation
   - Manual code review
   - Requesting modifications
   - Testing and validation
   - Final integration

This approach ensured high code quality, consistency with established patterns, and maintainability while leveraging AI assistance for faster development.

### Coding Standards

A comprehensive coding standards document was created and maintained in **`.cursorrules`** at the project root. This file serves dual purposes:

1. **Cursor AI Context**: Automatically provides context to Cursor about coding standards within Appium, ensuring all AI-assisted code generation adheres to established patterns.

2. **Developer Reference**: Contains complete coding standards.


## Frameworks Considered

1. **Detox**: React Native-specific, fast, but limited to RN and smaller community
2. **Appium + WebdriverIO**: Cross-platform, mature ecosystem, flexible (✅ Selected)
3. **Maestro**: Simple YAML syntax, but newer and less mature
4. **Appium + Python**: Python simplicity, but less aligned with React Native ecosystem

## Selected Framework: Appium + WebdriverIO + TypeScript

### Pros
- Cross-platform support (Android/iOS)
- TypeScript integration for type safety
- Mature ecosystem with extensive documentation
- Robust reporting (Allure, JUnit)
- Page Object Model support
- UIAutomator2 integration for reliable Android testing
- CI/CD integration ready

### Cons
- More setup complexity than native frameworks
- Slower execution than Detox
- Can be flaky without proper wait strategies
- Resource intensive (requires Appium server)
- WebView interactions are complex

### Mitigation
- Automatic animation disabling for faster tests
- Robust wait strategies in BasePage
- UIAutomator2 fallbacks for element location
- Screenshot capture on failures
- WebView interactions avoided for stability

## How to Run Automation Tests

### Prerequisites
1. Build APK: `npm run build`
2. Start Android emulator or connect device
3. Appium server (auto-started by WebdriverIO)

### Commands

```bash
# Run all tests
npm run test:e2e:android

# Run specific test suites
npm run test:e2e:android:home
npm run test:e2e:android:compiler
npm run test:e2e:android:cross-feature-integration
npm run test:e2e:android:semester-content
```

### View Reports

```bash
# Generate and open Allure report
npm run allure:generate
npm run allure:open
```

JUnit XML reports are automatically generated in `test-results/` directory.

## Improvements and Next Steps

### Short-Term
- Expand test coverage (MCQ quiz, interview page interactions)
- Implement WebView testing for compiler page
- Add visual regression testing
- Performance metrics collection

### Medium-Term
- iOS testing support
- Parallel test execution
- CI/CD integration (GitHub Actions)
- Cloud device testing (BrowserStack/App Automate)
- Enhanced reporting and notifications

### Long-Term
- API testing integration
- Security testing
- Localization testing
- Network condition testing
- Advanced multi-user scenarios
