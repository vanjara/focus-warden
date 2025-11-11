# 🚀 Publishing FocusWarden Fix to Chrome Web Store

## 📋 Pre-Publishing Checklist

### 1. Update Version Number
- [x] Update `manifest.json` version (e.g., `1.0.0` → `1.0.1`)
- [ ] Test the extension thoroughly (see `TESTING.md`)
- [ ] Verify all changes work correctly

### 2. Prepare Release Package
- [ ] Create a clean zip file with all necessary files
- [ ] Exclude development files (node_modules, .git, coverage, etc.)

## 🔄 Chrome Web Store Update Process

### Step 1: Update Version in manifest.json

**Current version:** `1.0.0`  
**New version:** `1.0.1` (or `1.0.2` if you've already published `1.0.1`)

Update the version field in `manifest.json`:
```json
"version": "1.0.1"
```

### Step 2: Create Release Package

Create a zip file with only the necessary files:

**Files to INCLUDE:**
- `manifest.json`
- `background.js`
- `content.js`
- `blocked.js`
- `blocked.html`
- `popup.js`
- `popup.html`
- `popup.css`
- `options.html` (if exists)
- `options.css` (if exists)
- `rules.json`
- All icon files (`icon-*.png` or `icon-*.svg`)
- Any other assets needed

**Files to EXCLUDE:**
- `node_modules/`
- `.git/`
- `coverage/`
- `src/` (if not needed in production)
- `*.test.ts`, `*.test.tsx`
- `package.json`, `package-lock.json`
- `tsconfig*.json`
- `vite.config.ts`
- `vitest.config.ts`
- `eslint.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `README.md`, `TESTING.md`, `*.md` files (optional)
- Any build artifacts or development files

### Step 3: Upload to Chrome Web Store

1. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account

2. **Find Your Extension**
   - Click on "FocusWarden - Website Blocker" from your extensions list

3. **Upload New Version**
   - Click "Package" tab or "Upload new package" button
   - Upload your new zip file
   - Chrome will validate the package

4. **Fill Out Update Details**

   **What's New:**
   ```
   Bug Fix: Fixed blocked page display issue
   
   - Fixed bug where extension ID was sometimes shown instead of blocked website name
   - Improved blocked page URL detection with multiple fallback methods
   - Enhanced error handling for edge cases
   - Better user experience when sites are blocked
   ```

   **Detailed Description** (optional update):
   - You can update the description if needed
   - Or leave it as is if it's just a bug fix

5. **Submit for Review**
   - Click "Submit for review"
   - Chrome will process the update

## ✅ Re-Verification Status

### **Good News: You likely DON'T need full re-verification!**

**Why:**
- ✅ **No permission changes** - You didn't add or modify any permissions
- ✅ **Bug fix only** - This is a bug fix, not a feature change
- ✅ **No new capabilities** - No new APIs or functionality added
- ✅ **Same scope** - Extension still does the same thing

**What to Expect:**
- **Fast-track review** (usually 1-3 days for bug fixes)
- **Automated review** if no permission changes
- **Manual review** only if flagged by automated systems

**However, Chrome may still review if:**
- The update is significant (large code changes)
- Automated systems flag something
- It's your first update after initial publication
- Random quality checks

## 📝 Release Notes Template

### For Chrome Web Store "What's New" Section:

```
Bug Fix: Fixed blocked page display issue

- Fixed bug where extension ID was sometimes shown instead of blocked website name
- Improved blocked page URL detection with multiple fallback methods  
- Enhanced error handling for edge cases
- Better user experience when sites are blocked
```

### For Users (if you have a website/blog):

```markdown
## FocusWarden v1.0.1 - Bug Fix Release

### 🐛 Bug Fixes
- **Fixed blocked page display bug**: Previously, when a website was blocked, 
  the blocked page would sometimes show the extension ID instead of the 
  actual website name. This has been fixed with improved URL detection.

### 🔧 Technical Improvements
- Enhanced blocked page URL detection with multiple fallback methods
- Better error handling for edge cases
- Improved reliability when referrer information is unavailable

### 📦 Update Information
- **Version**: 1.0.1
- **Release Type**: Bug Fix
- **Update Size**: Minimal (code improvements only)
- **Breaking Changes**: None
- **Action Required**: None - update automatically via Chrome Web Store
```

## ⏱️ Timeline Expectations

- **Upload & Submit**: 5-10 minutes
- **Automated Review**: Usually instant to a few hours
- **Manual Review** (if needed): 1-3 business days
- **Publication**: Once approved, goes live immediately

## 🔍 After Submission

1. **Check Status**
   - Go to Developer Dashboard
   - Check "Status" column for your extension
   - Statuses: "Pending review" → "Published" or "Rejected"

2. **If Rejected**
   - Check email for rejection reason
   - Fix issues and resubmit
   - Usually quick fixes are fast-tracked

3. **If Published**
   - Update goes live automatically
   - Users will get update notification
   - No action needed from users

## 📊 Version History Best Practices

Keep track of versions:
- `1.0.0` - Initial release
- `1.0.1` - Bug fix (this update)
- `1.0.2` - Future bug fixes
- `1.1.0` - Minor features
- `2.0.0` - Major changes

## 🛠️ Quick Commands

### Create Release Zip (macOS/Linux):
```bash
cd /Users/umang/projects/focus-warden
zip -r FocusWarden-v1.0.1.zip \
  manifest.json \
  background.js \
  content.js \
  blocked.js \
  blocked.html \
  popup.js \
  popup.html \
  popup.css \
  rules.json \
  icon-*.png \
  -x "*.md" "node_modules/*" ".git/*" "coverage/*" "src/*" "*.test.*" "package*.json" "tsconfig*.json" "*.config.*"
```

### Or manually:
1. Create a new folder: `FocusWarden-v1.0.1`
2. Copy only production files
3. Zip the folder
4. Upload to Chrome Web Store

## ⚠️ Important Notes

1. **Version Number**: Must be higher than current published version
2. **Test First**: Always test locally before uploading
3. **Backup**: Keep a copy of the previous version
4. **Release Notes**: Be clear about what changed
5. **Privacy**: No new data collection (you're good here!)

## 🎯 Summary

- ✅ **Update version** in manifest.json
- ✅ **Create zip** with production files only
- ✅ **Upload** to Chrome Web Store Developer Dashboard
- ✅ **Submit** for review
- ✅ **Wait** 1-3 days (usually faster for bug fixes)
- ✅ **No full re-verification** needed (bug fix, no permission changes)

The update should be approved quickly since it's a bug fix with no permission changes!

