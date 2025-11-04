# Per Diem - Detailed Documentation

This document contains comprehensive documentation about the Per Diem React Native Sample Store App, including features, architecture, API integration, and more.

## ✨ Features

### Authentication

- Email/password authentication using mock API endpoint with Basic Auth (`perdiem/perdiem`)
- Google Sign-In integration with Firebase Authentication
- Secure token storage with MMKV
- Auto-verification of stored tokens on app launch
- Separate handling for API-based and Firebase-based authentication
- Logout functionality with cleanup (cancels notifications)

### Home Screen

- **Timezone-Aware Greetings**: Dynamic greetings based on NYC time or local timezone
    - 5:00-9:59 AM → "Good Morning, NYC!" (or "Good Morning!" for local)
    - 10:00-11:59 AM → "Late Morning Vibes, NYC!" (or "Late Morning Vibes!" for local)
    - 12:00 PM-4:59 PM → "Good Afternoon, NYC!" (or "Good Afternoon!" for local)
    - 5:00 PM-8:59 PM → "Good Evening, NYC!" (or "Good Evening!" for local)
    - 9:00 PM-4:59 AM → "Night Owl in NYC!" (or "Night Owl!" for local)
- **Timezone Toggle**: Switch between NYC and local timezone with persistence (stored in MMKV)
- **Date List**: Next 30 days starting from today
- **Time Slot Picker**: 15-minute interval slots (00:00 to 23:45) with store status indicators
- **Store Status**: Green (open) / Red (closed) indicators based on API data
- **Override Badges**: Visual indicators for dates with store overrides
- **Selected Slot Display**: Shows currently selected date and time slot

### Push Notifications

- Local notifications scheduled 1 hour before next store opening
- Uses NYC timezone (`America/New_York`) for calculation
- Welcome notification scheduled 5 seconds after initialization
- Works even when app is closed
- Notifications canceled on logout
- Permission handling with user-friendly prompts

### Offline Support

- Caches store times and overrides locally using MMKV
- Graceful degradation with offline banner (displays when network is unavailable)
- Automatic cache-first strategy when offline
- Automatic revalidation when connection is restored
- Network status monitoring via `@react-native-community/netinfo`

## 🏗️ Architecture

```
src/
├── api/              # API clients
│   ├── auth.ts       # Authentication API (email/password, Google Sign-In, token verification)
│   └── storeApi.ts   # Store times and overrides API
├── components/        # Reusable UI components
│   ├── Button.tsx
│   ├── CustomTextInput.tsx
│   ├── EyeIcon.tsx
│   ├── GoogleIcon.tsx
│   ├── Logo.tsx
│   ├── OfflineBanner.tsx
│   ├── Separator.tsx
│   ├── TimeSlotPicker.tsx
│   └── Toast.tsx
├── context/           # Context providers
│   └── AuthContext.tsx
├── hooks/             # Custom hooks
│   └── useNetworkStatus.ts
├── navigation/        # Navigation setup
│   └── AppNavigator.tsx
├── screens/           # Screen components
│   ├── HomeScreen.tsx
│   └── SignInScreen.tsx
├── utils/             # Utility functions
│   ├── base64.ts      # Base64 encoding utility
│   ├── constants.ts   # Colors, spacing, messages
│   ├── notifications.ts
│   ├── storage.ts     # MMKV storage helper
│   ├── timeUtils.ts   # Timezone and time slot utilities
│   └── validation.ts  # Email and password validation
└── __tests__/         # Unit tests
    ├── authContext.test.tsx
    ├── storeApi.test.ts
    └── timeUtils.test.ts
```

### State Management

- **Context API**: Global authentication state (`AuthContext`)
- **Local State**: Component-level state with React hooks
- **Persistent Storage**: MMKV for secure, fast key-value storage
  - Stores: auth token, user info, auth source, timezone preference, selected time slot, store times, store overrides

### Data Flow

1. User authenticates → Token stored in MMKV with auth source (`api` or `firebase`)
2. App verifies token on launch → Auto-login if valid (different logic for API vs Firebase)
3. Home screen loads store data → Cached locally in MMKV
4. User selects date/time → Stored in MMKV and validated against API
5. Notifications scheduled → Based on store opening times (calculated from NYC timezone)

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Test Coverage

- `timeUtils.test.ts` - Time utility functions (timezone handling, greetings, date generation)
- `storeApi.test.ts` - Store API logic (store times, overrides, open/closed status)
- `authContext.test.tsx` - Authentication context (login, logout, token verification)

## 📱 API Integration

### Authentication Endpoint

- **POST** `/auth/`
    - Basic Auth: `perdiem/perdiem` (Base64 encoded)
    - Headers: `Content-Type: application/json`, `Authorization: Basic <encoded>`
    - Body: `{ "email": string, "password": string }`
    - Response: `{ "token": string }`
    - After successful login, token is verified via `/auth/verify` to get user info

### Token Verification

- **GET** `/auth/verify`
    - Authorization: `Bearer <token>`
    - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
    - Response: `{ "email": string, "name"?: string, "userId"?: string, "role"?: string }`

### Store Times

- **GET** `/store-times/`
    - Basic Auth: `perdiem/perdiem`
    - Headers: `Authorization: Basic <encoded>`, `Content-Type: application/json`
    - Returns: Array of store schedule objects with `day_of_week` (0-6), `is_open` (boolean), `start_time` (optional), `end_time` (optional)
    - Cached locally in MMKV

### Store Overrides

- **GET** `/store-overrides/`
    - Basic Auth: `perdiem/perdiem`
    - Headers: `Authorization: Basic <encoded>`, `Content-Type: application/json`
    - Returns: Array of override objects with `month`, `day`, `is_open`, `start_time` (optional), `end_time` (optional)
    - Processed and indexed by `month-day` key in MMKV

## 🔧 Configuration

### Base API URL

Configured in `src/api/auth.ts` and `src/api/storeApi.ts`:

```typescript
const API_BASE_URL = 'https://coding-challenge-pd-1a25b1a14f34.herokuapp.com';
```

### Basic Auth Credentials

Configured in `src/api/auth.ts` and `src/api/storeApi.ts`:

```typescript
const BASIC_AUTH_USERNAME = 'perdiem';
const BASIC_AUTH_PASSWORD = 'perdiem';
```

### Timezone Preferences

Stored in MMKV with key `timezone_preference`:

- `'nyc'` - New York timezone (`America/New_York`) - default
- `'local'` - Device local timezone (from `Intl.DateTimeFormat().resolvedOptions().timeZone`)

### Storage Keys (MMKV)

- `auth_token` - Authentication token
- `user_info` - User information (email, name)
- `auth_source` - Authentication source (`'api'` or `'firebase'`)
- `timezone_preference` - Timezone preference (`'nyc'` or `'local'`)
- `selected_time_slot` - Selected date and time slot
- `store_times` - Cached store schedule
- `store_overrides` - Cached store overrides
- `last_update` - Timestamp of last store data update

### Environment Variables

Required for Google Sign-In:

- `WEB_CLIENT_ID` - Google Web Client ID (configured via `react-native-config`)

## 📦 Key Dependencies

### Core

- `react-native`: 0.82.1 - Core framework
- `react`: 19.1.1 - React library

### Navigation

- `@react-navigation/native`: ^7.1.19 - Navigation library
- `@react-navigation/native-stack`: ^7.6.2 - Stack navigator
- `react-native-safe-area-context`: ^5.5.2 - Safe area handling
- `react-native-screens`: ^4.18.0 - Native screen components
- `react-native-gesture-handler`: ^2.29.0 - Gesture handling

### Authentication

- `@react-native-firebase/app`: ^23.5.0 - Firebase core
- `@react-native-firebase/auth`: ^23.5.0 - Firebase Authentication
- `@react-native-google-signin/google-signin`: ^16.0.0 - Google Sign-In

### Storage & Utilities

- `react-native-mmkv`: ^4.0.0 - Fast, secure key-value storage
- `react-native-config`: 1.5.5 - Environment variable management

### Notifications

- `@notifee/react-native`: ^9.1.8 - Local notifications

### Network

- `@react-native-community/netinfo`: ^11.4.1 - Network status detection

## 🎨 Design System

### Colors

Defined in `src/utils/constants.ts`:

- Primary: `#2176FF`
- Black: `#000000`
- White: `#FFFFFF`
- Gray: `#666666`
- Light Gray: `#E7E7E7`
- Border Gray: `#E0E0E0`
- Error: `#FF0000`
- Dark Gray: `#333333`

### Spacing

Defined in `src/utils/constants.ts`:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Status Indicators

- Open: Green (`#4CAF50`)
- Closed: Red (`#FF0000`)

## 🐛 Error Handling

- Network errors gracefully handled with fallback to cached data
- Offline mode with cached data fallback and visual banner
- User-friendly error messages displayed via Toast notifications
- Form validation with inline error messages
- Token verification failures trigger automatic logout
- API errors return descriptive messages to user

## 📝 Assumptions & Implementation Details

1. **API Response Format**: 

   - Authentication returns `token` field
   - Store times follow day-of-week structure (0-6, where 0 = Sunday)
   - Store times include `is_open` boolean, optional `start_time` and `end_time`
   - Overrides are optional (404 is valid for no override)
   - Overrides array is processed and indexed by `month-day` key

1. **Timezone Handling**:

   - NYC timezone is `America/New_York`
   - Store hours are calculated in NYC timezone
   - Greetings update every minute
   - Local timezone uses device's resolved timezone
   - Timezone preference persisted in MMKV

1. **Notifications**:

   - Scheduled 1 hour before next store opening
   - Calculated from NYC timezone
   - Welcome notification scheduled 5 seconds after initialization
   - Canceled on logout
   - Re-scheduled when store times change
   - Requires user permission

1. **Offline Behavior**:

   - Cached data used when offline
   - Banner displayed to inform user
   - Cache-first strategy when `useCache` is true
   - Network status monitored via `useNetworkStatus` hook

1. **Password Validation**:

   - Minimum 7 characters required
   - Email validation via regex pattern
   - Validation occurs on form submission and field blur
   - Error messages displayed inline below inputs

1. **Time Slots**:

   - Generated in 15-minute intervals (00:00 to 23:45)
   - Displayed in 12-hour format (AM/PM)
   - Store open/closed status calculated per slot
   - Selected slot persisted in MMKV

1. **Authentication Flow**:

   - Email/password: API → Verify token → Store in MMKV
   - Google Sign-In: Firebase Auth → Get ID token → Store in MMKV
   - Auto-login on app launch based on stored auth source
   - Separate logout logic for API vs Firebase

## 👥 Contributors

Built as a sample implementation for Per Diem.
