# Progressive Web App (PWA) Features

Connectrix is now a fully functional Progressive Web App (PWA), providing an app-like experience on web browsers and mobile devices.

## What is a PWA?

A Progressive Web App is a web application that uses modern web capabilities to deliver an app-like experience to users. PWAs are reliable, fast, and engaging.

## Features

### 🚀 Installable
- Install Connectrix on your device (desktop or mobile)
- Launch from your home screen or app drawer
- Full-screen experience without browser UI
- Appears in your app launcher alongside native apps

### 📴 Offline Support
- Continue browsing cached content when offline
- Graceful degradation when network is unavailable
- Automatic sync when connection is restored
- Dedicated offline page for better user experience

### ⚡ Performance
- Service Worker caching for faster load times
- Optimized asset delivery
- Background sync capabilities
- Reduced data usage through intelligent caching

### 📱 App-like Experience
- Standalone display mode (runs in its own window)
- Custom app icon and splash screen
- Native-like navigation and transitions
- Push notifications support (when implemented)

## How to Install

### On Desktop (Chrome, Edge, Brave)
1. Visit the Connectrix website
2. Look for the install icon in the address bar (⊕ or install prompt)
3. Click "Install" when prompted
4. The app will be added to your applications

### On Mobile (Android/iOS)
1. Open Connectrix in your mobile browser
2. Look for the "Add to Home Screen" prompt or
3. Tap the browser menu (⋮ or share icon)
4. Select "Add to Home Screen" or "Install"
5. Confirm the installation

### On iOS Safari
1. Open Connectrix in Safari
2. Tap the Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Name the app and tap "Add"

## PWA Files and Components

### Manifest (`/public/manifest.json`)
Defines how the app appears and behaves when installed:
- App name and description
- Icon specifications (48px to 512px)
- Theme colors
- Display mode (standalone)
- Start URL

### Service Worker (`/public/sw.js`)
Handles offline functionality and caching:
- Caches static assets on install
- Network-first strategy for dynamic content
- Cache-first strategy for static assets
- Offline fallback handling
- Background sync support
- Push notification handlers

### Icons
Multiple icon sizes for different devices:
- `icon-48x48.png` - Small devices
- `icon-72x72.png` - Medium devices
- `icon-96x96.png` - Standard mobile
- `icon-144x144.png` - Retina mobile
- `icon-192x192.png` - Standard PWA icon
- `icon-256x256.png` - Large displays
- `icon-384x384.png` - Extra large
- `icon-512x512.png` - Splash screens
- `apple-touch-icon.png` - iOS devices
- `favicon.ico` - Browser tab

## Offline Functionality

### What Works Offline
- Previously visited pages (cached)
- Static assets (images, CSS, JavaScript)
- Cached API responses
- Offline fallback page

### What Requires Connection
- API calls (login, registration, new content)
- Real-time updates
- File uploads
- Database operations

## Caching Strategy

### Static Assets (Cache-First)
- Images, fonts, CSS, JavaScript
- Served from cache for instant loading
- Updated in background when available

### Dynamic Content (Network-First)
- HTML pages, API responses
- Always tries network first
- Falls back to cache if offline

### API Calls
- Always requires network
- Provides clear error message when offline
- Can queue for background sync (future feature)

## Browser Support

### Full PWA Support
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari 11.1+ (iOS & macOS)
- ✅ Opera (Desktop & Mobile)
- ✅ Samsung Internet

### Limited Support
- ⚠️ Safari (some features limited)
- ⚠️ IE11 (no PWA support, but site still works)

## Testing PWA Features

### Lighthouse Audit
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Review the PWA score and recommendations

### Service Worker
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check "Service Workers" section
4. Verify service worker is activated

### Offline Testing
1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Select "Offline" from throttling dropdown
4. Reload page to test offline functionality

### Install Testing
1. Visit the site in a supported browser
2. Wait for install prompt
3. Test installation process
4. Verify standalone mode works

## Troubleshooting

### Install Prompt Not Showing
- Clear browser cache and reload
- Ensure HTTPS is enabled (required for PWA)
- Check if already installed
- Verify manifest.json is accessible

### Service Worker Not Registering
- Check browser console for errors
- Verify sw.js is accessible at `/sw.js`
- Ensure HTTPS is enabled
- Clear service worker cache and re-register

### Offline Mode Not Working
- Check service worker is active
- Verify caching strategy in sw.js
- Test with DevTools offline mode
- Clear cache and re-test

### Icons Not Displaying
- Verify icon files exist in /public
- Check manifest.json paths
- Clear browser cache
- Check icon file sizes and formats

## Future Enhancements

### Planned Features
- 🔔 Push notifications for events and updates
- 🔄 Background sync for offline actions
- 📊 Analytics for PWA usage
- 🎨 Customizable theme colors
- 📱 Share target API integration
- 🔐 Web Authentication API
- 📍 Geolocation for campus navigation

## Development

### Local Testing
```bash
# Start development server
npm run dev

# Service worker will register at http://localhost:3000/sw.js
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Updating Service Worker
When you make changes to the service worker:
1. Update the `CACHE_NAME` version in `sw.js`
2. Build and deploy the new version
3. Old caches will be automatically cleaned up

## Best Practices

### For Users
- Install for the best experience
- Update regularly for new features
- Clear cache if experiencing issues
- Use offline mode when needed

### For Developers
- Always update cache version when changing SW
- Test offline functionality thoroughly
- Optimize images and assets for caching
- Monitor service worker lifecycle
- Handle update prompts gracefully

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/)

## Support

If you encounter any issues with PWA features:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Test in different browsers
4. Open an issue on GitHub with details

---

**Note**: PWA features require HTTPS in production. Development mode works on localhost without HTTPS.
