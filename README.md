# TD-NewSpend Mobile App

A React Native mobile app for tracking and visualizing financial transactions.

## Features

- View all transactions in a list format
- Group transactions by categories 
- Group transactions by merchants
- Nested grouping by both categories and merchants
- View spending by different time periods (daily, weekly, monthly, yearly)
- Total amount calculations for each group

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or newer)
- npm (included with Node.js) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

For mobile development:
- [Expo Go](https://expo.dev/client) app installed on your physical device, OR
- iOS Simulator (macOS only, requires Xcode) OR
- Android Emulator (requires Android Studio)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/TD-NewSpend.git
cd TD-NewSpend
```

2. Install dependencies:

```bash
npm install
```

3. Install the Expo CLI globally (if not already installed):

```bash
npm install -g expo-cli
```

## Running the App for Testing

### Method 1: Using a Physical Mobile Device (Recommended)

1. Start the Expo development server:

```bash
npm start
```

2. This will display a QR code in your terminal and open a browser tab with Expo Developer Tools.

3. On your mobile device:
   - **iOS**: Open the default Camera app and scan the QR code. This will prompt you to open in Expo Go (install from App Store if needed).
   - **Android**: Open the Expo Go app and tap "Scan QR Code" to scan the QR code displayed in your terminal.

4. The app will load on your device. You may need to wait a few moments for the JavaScript bundle to compile.

### Method 2: Using iOS Simulator (macOS Only)

1. Ensure you have Xcode installed from the Mac App Store.
2. Open Xcode and set up a simulator device through Xcode's preferences.
3. Start the Expo development server:

```bash
npm start
```

4. Press `i` in the terminal where Expo is running, or click "Run on iOS simulator" in the Expo Developer Tools browser tab.

### Method 3: Using Android Emulator

1. Ensure you have Android Studio installed.
2. Set up an Android Virtual Device (AVD) through Android Studio's AVD Manager.
3. Start the emulator from Android Studio.
4. Start the Expo development server:

```bash
npm start
```

5. Press `a` in the terminal where Expo is running, or click "Run on Android device/emulator" in the Expo Developer Tools browser tab.

### Method 4: Using Web Browser (Limited Functionality)

1. Start the Expo development server:

```bash
npm start
```

2. Press `w` in the terminal or click "Run in web browser" in the Expo Developer Tools.

## Troubleshooting

### Common Issues

1. **"Unable to find module" errors**:
   ```bash
   npm install
   ```

2. **Expo Go app can't connect to development server**:
   - Ensure your mobile device is on the same Wi-Fi network as your development machine.
   - Try using the "tunnel" connection type:
   ```bash
   npm start -- --tunnel
   ```

3. **Metro bundler issues**:
   - Clear the Metro bundler cache:
   ```bash
   expo start -c
   ```

4. **Performance issues on device**:
   - In the Expo Go app, shake your device to open the developer menu and enable Fast Refresh.

## Testing the Transaction Grouping Feature

1. Launch the app using any of the methods above.
2. The main screen displays a list of transactions, initially without grouping.
3. Use the toggle buttons at the top:
   - Tap "Categories" to group transactions by category
   - Tap "Merchants" to group transactions by merchant
   - Tap both to see a nested hierarchy of categories and merchants
4. The period selector allows you to view transactions by different time frames.
5. Each group displays a total amount for all transactions within that group.

## Project Structure

- `/app` - Main application screens
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks for data fetching
- `/constants` - Data models and mock transaction data

## License

This project is licensed under the MIT License - see the LICENSE file for details.
