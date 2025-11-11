# 🧪 Local Testing Guide for FocusWarden Fix

## Quick Start - Load Extension Locally

### Step 1: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Type in address bar: `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to: `/Users/umang/projects/focus-warden`
   - Select the folder and click "Select Folder" (or "Open" on Mac)

4. **Verify Extension Loaded**
   - You should see "FocusWarden - Website Blocker" in your extensions list
   - Extension icon should appear in Chrome toolbar
   - Status should show "Enabled"

### Step 2: Open Developer Tools

**For Blocked Page Testing:**
- When you see the blocked page, right-click → "Inspect" (or press F12)
- This opens DevTools to check for errors

**For Background Script:**
- Go to `chrome://extensions/`
- Find FocusWarden
- Click "service worker" link (or "background page")
- This opens the background script console

## 🎯 Test Scenarios

### Test 1: Basic Blocking (Main Fix)

**Goal:** Verify blocked page shows website name, NOT extension ID

**Steps:**
1. Click FocusWarden icon in toolbar → Open popup
2. Make sure toggle is **Enabled** (green/on)
3. Click "Add Website" button
4. Enter a test site: `reddit.com`
5. Click "Save" or press Enter
6. Open a **new tab** (important: new tab, not same tab)
7. Navigate to: `https://www.reddit.com`
8. **Observe the blocked page**

**✅ Expected Results:**
- Page redirects to blocked page
- Shows "reddit.com" (or "reddit") in the blocked URL field
- Shows a motivational quote
- Shows time info (if blocking is active)
- **DOES NOT show extension ID** (like `chrome-extension://abc123...`)
- All buttons visible (Settings, Go Back, New Tab)

**❌ If You See Extension ID:**
- Open DevTools (F12) on blocked page
- Check Console tab for errors
- Check if `lastBlockedUrl` is in storage (Application tab → Local Storage)

### Test 2: Quick Block

**Goal:** Test with quick block active

**Steps:**
1. Add a website (e.g., `facebook.com`) if not already added
2. In popup, click "15 min" quick block button
3. Try to navigate to `https://www.facebook.com`
4. Check blocked page

**✅ Expected:**
- Shows "facebook.com" (not extension ID)
- Time shows "Quick block active for X more minutes"
- All elements display correctly

### Test 3: Scheduled Block

**Goal:** Test with scheduled block

**Steps:**
1. Add a website (e.g., `twitter.com`)
2. Click "Add Schedule"
3. Set start time: Current time (e.g., if it's 2:00 PM, set 2:00 PM)
4. Set end time: 1 hour later (e.g., 3:00 PM)
5. Check current day (e.g., Monday)
6. Click "Save"
7. Try to navigate to `https://twitter.com`

**✅ Expected:**
- Shows "twitter.com" (not extension ID)
- Time shows "Scheduled block ends in Xh Ym"
- All elements display correctly

### Test 4: Multiple Websites

**Goal:** Test fallback behavior

**Steps:**
1. Add multiple websites: `reddit.com`, `facebook.com`, `youtube.com`
2. Enable blocking
3. Try navigating to one of them
4. Check what displays

**✅ Expected:**
- Shows the specific website name you tried to visit
- If referrer fails, shows generic message or website count
- Never shows extension ID

### Test 5: Edge Cases

#### Test 5a: Direct Navigation to Blocked Page
1. Get your extension ID:
   - Go to `chrome://extensions/`
   - Find FocusWarden
   - Copy the ID (long string like `abcdefghijklmnopqrstuvwxyz123456`)
2. Navigate directly to: `chrome-extension://[YOUR-EXTENSION-ID]/blocked.html`
3. **Expected:** Shows "Blocked website" or website count, NOT extension ID

#### Test 5b: Extension Disabled
1. Disable the toggle in popup
2. Try navigating to a blocked site
3. **Expected:** Site loads normally (not blocked)

#### Test 5c: No Websites Added
1. Remove all websites from list
2. Enable toggle
3. Try navigating to any site
4. **Expected:** Site loads normally (nothing to block)

#### Test 5d: Referrer is Extension URL
1. This tests the fix directly
2. Navigate to a blocked site
3. If blocked page shows, check if it's the site name or extension ID
4. **Expected:** Site name, not extension ID

## 🔍 Debugging Checklist

### Check Console for Errors

**On Blocked Page:**
1. Right-click blocked page → Inspect (F12)
2. Go to Console tab
3. Look for:
   - ✅ No red errors
   - ✅ No "undefined" errors
   - ✅ Storage calls succeed

**In Background Script:**
1. Go to `chrome://extensions/`
2. Click "service worker" link
3. Check console for:
   - ✅ Rule updates succeed
   - ✅ No storage errors

### Check Storage

**Verify URL Storage:**
1. Open DevTools on blocked page (F12)
2. Go to Application tab
3. Left sidebar: Storage → Local Storage → `chrome-extension://[your-id]`
4. Look for `lastBlockedUrl` key
5. **Expected:** Should contain the blocked website URL

**Verify Sync Storage:**
1. Same DevTools → Application tab
2. Storage → Sync Storage → `chrome-extension://[your-id]`
3. Check for:
   - `enabled`: true/false
   - `websites`: array of websites
   - `schedules`: array of schedules
   - `quickBlockEnd`: timestamp (if quick block active)

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Reload blocked page
4. **Expected:** No failed requests, all resources load

## 🐛 Common Issues & Fixes

### Issue: Extension ID Still Shows

**Possible Causes:**
1. Old version still cached
   - **Fix:** Go to `chrome://extensions/` → Click reload icon on FocusWarden
2. Storage not working
   - **Fix:** Check Console for storage errors
3. Content script didn't run
   - **Fix:** Check if `declarativeNetRequest` is working (background console)

**Debug Steps:**
```javascript
// In blocked page console (F12):
chrome.storage.local.get(['lastBlockedUrl'], (data) => {
  console.log('Stored URL:', data.lastBlockedUrl);
});
```

### Issue: Blocked Page Doesn't Load

**Check:**
1. Is extension enabled? (chrome://extensions/)
2. Is blocking toggle on? (popup)
3. Are websites added? (popup)
4. Is blocking active? (quick block or schedule)

### Issue: Wrong Website Name Shows

**Check:**
1. Open Console on blocked page
2. Run: `document.getElementById('blockedUrl').textContent`
3. Should show website name, not extension ID

## ✅ Final Verification Checklist

Before publishing, verify:

- [ ] Extension loads without errors
- [ ] Can add/remove websites
- [ ] Blocked page shows website name (not extension ID)
- [ ] Quick block works correctly
- [ ] Scheduled block works correctly
- [ ] Time info displays correctly
- [ ] All buttons work (Settings, Go Back, New Tab)
- [ ] No console errors
- [ ] Fallback messages work (when referrer unavailable)
- [ ] Extension ID never appears on blocked page
- [ ] Works with multiple websites
- [ ] Works when extension disabled/enabled

## 🎬 Quick Test Script

Run through this quick sequence:

1. **Load extension** → `chrome://extensions/` → Load unpacked
2. **Add website** → `reddit.com`
3. **Enable toggle** → Should be green
4. **Navigate** → `https://reddit.com`
5. **Verify** → Shows "reddit.com", not extension ID
6. **Check console** → No errors
7. **Test buttons** → All work
8. **Done!** ✅

## 📝 Test Results Template

```
Test Date: ___________
Chrome Version: ___________
Extension Version: 1.0.1

✅ Basic Blocking: PASS / FAIL
✅ Quick Block: PASS / FAIL  
✅ Scheduled Block: PASS / FAIL
✅ Multiple Websites: PASS / FAIL
✅ Edge Cases: PASS / FAIL
✅ No Extension ID Shown: PASS / FAIL
✅ Console Errors: NONE / ERRORS FOUND
✅ Storage Working: YES / NO

Notes:
_________________________________
_________________________________
```

## 🚀 Ready to Publish?

Once all tests pass:
1. ✅ All scenarios work correctly
2. ✅ No extension ID appears
3. ✅ No console errors
4. ✅ All features functional

Then proceed to publish using `CHROME_WEB_STORE_PUBLISH.md` guide!

