# Per Diem - React Native Sample Store App

A fully-featured React Native (CLI) application for managing store appointments with timezone-aware greetings, date/time slot selection, and push notifications.

## 📋 Overview

Per Diem is a React Native application built with TypeScript that provides:

- **Authentication**: Email/password login via mock API and Google Sign-In via Firebase
- **Home Screen**: NYC timezone-aware greetings, date list, time slot picker
- **Store Status**: Real-time availability checking with API integration
- **Push Notifications**: Local notifications for store opening reminders
- **Offline Support**: Caching with graceful offline mode handling
- **State Management**: Context API for global state
- **Secure Storage**: MMKV for token and data persistence

**[📚 Learn more →](./docs/DOCUMENTATION.md)**

## 🚀 Setup Instructions

### Prerequisites

- Node.js >= 20
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```
1. **iOS - Install CocoaPods:**

   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```
1. **Environment Configuration:**

   Create a `.env` file in the root directory:

   ```
   WEB_CLIENT_ID=your-google-web-client-id
   ```
1. **Firebase Setup:**

   - Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are configured
   - Configure Firebase Authentication with Google Sign-In enabled

### Running the App

#### Start Metro Bundler

```bash
npm start
```

#### Run on iOS

```bash
npm run ios
```

#### Run on Android

```bash
npm run android
```

---

## Sample Screenshots 

### Login Journey

![Login Journey](./screenshots/perdiem-login-journey.png)

### Home Screen Journey

![Home Screen Journey](./screenshots/perdiem-home-journey.png)

**[View more screenshots →](./screenshot-samples.md)**

