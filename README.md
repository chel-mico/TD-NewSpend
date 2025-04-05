# TD-NewSpend Mobile App

A React Native mobile app (using Expo) for tracking and visualizing financial transactions.

## Features

- View spending overview by period (currently uses placeholder data for monthly comparison or category breakdown).
- View transactions grouped by categories and/or merchants.
- Select different time periods (daily, weekly, monthly, yearly) for viewing transactions.
- Displays total amounts for transaction groups.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Optional: [Expo Go](https://expo.dev/client) app on your physical device for easiest testing.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url> # Replace with your repo URL
    cd TD-NewSpend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or: yarn install
    ```
    This installs React Native, Expo, and all other required libraries listed in `package.json`.

## Running the App

The recommended way to run the app during development is using the Expo Go app on your physical device.

1.  **Start the development server:**
    ```bash
    npm start
    # or: expo start
    ```

2.  **Connect with Expo Go:**
    - The command above will show a QR code in your terminal.
    - Open the Expo Go app on your iOS or Android device and scan the QR code.
    - Ensure your device is on the same Wi-Fi network as your computer.
    - If you have connection issues, try restarting the server with the `--tunnel` flag: `npm start -- --tunnel`

3.  **Alternative Methods (Simulators/Web):**
    - **iOS Simulator (macOS):** Press `i` in the terminal after starting the server (requires Xcode).
    - **Android Emulator:** Press `a` in the terminal (requires Android Studio and a running emulator).
    - **Web Browser:** Press `w` in the terminal (functionality may be limited).

## Project Structure

- `/app` - Main application screens and navigation (using Expo Router).
- `/components` - Reusable UI components (buttons, lists, chart).
- `/constants` - Data models, mock data.
- `/hooks` - Custom React hooks for data fetching and processing (using React Query).
- `/scripts` - Utility scripts (e.g., reset-project).
- `/assets` - Static assets like fonts and images.

## Available Scripts

- `npm start`: Starts the Expo development server.
- `npm run android`: Starts the app on a connected Android device/emulator.
- `npm run ios`: Starts the app on an iOS simulator/device.
- `npm run web`: Starts the app in a web browser.
- `npm run lint`: Lints the codebase using Expo's lint configuration.

## Troubleshooting Tips

- **Dependency Issues:** If you encounter errors after pulling changes, try deleting `node_modules` and `package-lock.json` (or `yarn.lock`) and running `npm install` (or `yarn install`) again.
- **Caching Issues:** Sometimes the Metro bundler cache can cause problems. Restart the start command with the `-c` flag to clear the cache: `npm start -- -c`.
- **Expo CLI:** While usually installed as a dependency, if you encounter issues running `expo start`, ensure you have the latest `expo-cli` potentially installed globally (`npm install -g expo-cli`) or use `npx expo start`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
