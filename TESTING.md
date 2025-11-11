# Testing FocusWarden Bug Fix

## Setup

1. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `focus-warden` folder
   - The extension should appear in your extensions list

2. **Verify the extension is loaded:**
   - You should see the FocusWarden icon in your Chrome toolbar
   - Click it to open the popup

## Test Scenarios

### Test 1: Basic Blocking (declarativeNetRequest redirect)

**Goal:** Verify the blocked page shows the website name, not the extension ID

**Steps:**
1. Click the FocusWarden icon to open the popup
2. Make sure the toggle is **Enabled**
3. Add a test website (e.g., `reddit.com` or `facebook.com`)
4. Click "Save" or press Enter
5. Try to navigate to that website in a new tab
6. **Expected Result:** 
   - You should be redirected to the blocked page
   - The blocked page should show the website name (e.g., "reddit.com")
   - It should **NOT** show the extension ID (like "chrome-extension://abc123...")
   - The quote and time info should be visible

### Test 2: Quick Block

**Goal:** Verify blocking works with quick blocks

**Steps:**
1. Add a website to block (if not already added)
2. Click one of the quick block buttons (15 min, 30 min, 1 hour, 2 hours)
3. Try to navigate to the blocked website
4. **Expected Result:**
   - Blocked page shows the website name
   - Time info shows "Quick block active for X more minutes"
   - No extension ID visible

### Test 3: Scheduled Block

**Goal:** Verify blocking works with scheduled blocks

**Steps:**
1. Add a website to block
2. Add a schedule (e.g., current time to 1 hour later, current day)
3. Wait for the schedule to activate (or set it to current time)
4. Try to navigate to the blocked website
5. **Expected Result:**
   - Blocked page shows the website name
   - Time info shows "Scheduled block ends in Xh Ym"
   - No extension ID visible

### Test 4: Multiple Websites

**Goal:** Verify fallback when referrer is not available

**Steps:**
1. Add multiple websites to block (e.g., reddit.com, facebook.com, twitter.com)
2. Enable blocking
3. Try to navigate to one of the blocked sites
4. **Expected Result:**
   - Blocked page shows the specific website name
   - If referrer fails, it should show a generic message or the website count
   - Should never show extension ID

### Test 5: Edge Cases

**Goal:** Verify the fix handles edge cases gracefully

**Test 5a: Direct navigation to blocked.html**
- Manually navigate to `chrome-extension://[extension-id]/blocked.html`
- **Expected:** Should show "Blocked website" or website count, not extension ID

**Test 5b: Extension disabled**
- Disable the extension toggle
- Navigate to a previously blocked site
- **Expected:** Site should load normally (not blocked)

**Test 5c: No websites configured**
- Remove all websites from the list
- Enable the toggle
- Navigate to any site
- **Expected:** Sites should load normally (nothing to block)

## Debugging Tips

### Check Console for Errors

1. Open the blocked page
2. Right-click → "Inspect" or press F12
3. Check the Console tab for any JavaScript errors
4. Check the Network tab if storage calls are failing

### Verify Storage

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Under "Storage" → "Local Storage" → `chrome-extension://[your-extension-id]`
4. Check if `lastBlockedUrl` is being stored correctly

### Check Background Script

1. Go to `chrome://extensions/`
2. Find FocusWarden
3. Click "service worker" or "background page" link
4. Check console for any errors in rule updates

## What to Look For

✅ **Good Signs:**
- Blocked page shows actual website name (e.g., "reddit.com")
- Blocked page shows "Blocked website" as fallback
- Blocked page shows website count (e.g., "3 websites blocked")
- No extension ID visible anywhere
- Quote and time info display correctly

❌ **Bad Signs:**
- Extension ID visible (e.g., "chrome-extension://abc123...")
- Empty or blank website name field
- JavaScript errors in console
- Blocked page doesn't load at all

## Quick Test Checklist

- [ ] Extension loads without errors
- [ ] Can add websites to block list
- [ ] Blocked page shows website name (not extension ID)
- [ ] Quick block works and shows correct time
- [ ] Scheduled block works and shows correct time
- [ ] Fallback messages work when referrer unavailable
- [ ] No console errors
- [ ] All buttons on blocked page work (Settings, Go Back, New Tab)

