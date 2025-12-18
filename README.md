# FocusWarden - Website Blocker Extension 🛡️

A Chrome browser extension that helps users block distracting websites during focused work sessions with customizable time schedules.

**Current Version: 1.0.1**

## What's New in v1.0.1

- **Bug Fix**: Blocked page now correctly displays the website name instead of extension ID
- **Bug Fix**: Added exception rule to prevent the blocked page itself from being blocked
- **New**: Updated FocusWarden logo and branding
- **Improved**: Cleaner, simpler blocked page UI (removed Go Back button)
- **Added**: Automated E2E testing with Puppeteer

## Features

- **Website Blocking**: Block specific websites (e.g., facebook.com, twitter.com)
- **Scheduling**: Set recurring time-based blocks (e.g., 9 AM - 5 PM on weekdays)
- **Quick Block**: Temporary blocking for 15 min, 30 min, 1 hour, or 2 hours
- **Smart Rules**: Uses Chrome's declarativeNetRequest API for efficient blocking
- **Cross-device Sync**: Settings sync across devices using Chrome storage

## Installation

### Development Installation

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd focus-warden
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder (after building) or the root folder for development

### Production Installation

Download the `.crx` file from releases and drag it into Chrome's extensions page.

## Development

### Project Structure

```
focus-warden/
├── src/                    # React frontend (development)
├── background.js          # Extension service worker
├── content.js            # Content script for web pages
├── popup.html/js/css     # Extension popup interface
├── blocked.html/js       # Blocked page template
├── manifest.json         # Extension manifest
└── rules.json           # Blocking rules configuration
```

### Scripts

- `npm run dev` - Start Vite dev server for React frontend
- `npm run build` - Build production extension
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E extension tests (opens Chrome)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Chrome Extension Development

The main extension functionality is in:
- `background.js` - Core blocking logic and rule management
- `popup.js` - User interface controls
- `content.js` - Page-level blocking checks

### React Frontend

The `src/` folder contains a React + TypeScript application that can be used for:
- Extension options page
- Advanced configuration interface
- Analytics dashboard

## Usage

1. **Enable Blocking**: Toggle the main switch in the popup
2. **Add Websites**: Click "+ Add" to block specific domains
3. **Set Schedules**: Create recurring time-based blocks
4. **Quick Block**: Use preset durations for immediate focus sessions

## Permissions

- `storage` - Save user preferences
- `declarativeNetRequest` - Block websites efficiently
- `alarms` - Schedule blocking periods

## Building for Distribution

1. Run `npm run build`
2. The `dist/` folder contains the production-ready extension
3. Zip the `dist/` folder contents
4. Submit to Chrome Web Store or distribute manually

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Support

[Add support information here]
