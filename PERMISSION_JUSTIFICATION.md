# Recommended Permission Justification for Chrome Web Store

## Host Permissions (<all_urls>)

**Enhanced Version (Recommended):**

```
Required to enable users to block any website they find distracting, not just common social media sites. This permission allows the extension to detect and block user-specified domains, creating a personalized productivity tool that adapts to individual work habits and distraction patterns.

Technical Requirement:
- Chrome's declarativeNetRequest API requires host permissions to create blocking rules for user-specified websites
- Since users can configure any domain to block, we cannot request specific host permissions in advance
- The extension must monitor page loads to detect when users visit blocked sites
- There is no alternative way to implement user-configurable website blocking without this permission

Privacy & Security:
- Zero data collection - no browsing history, personal information, or usage data is collected
- All processing occurs locally on the user's device
- No external server communication - extension makes no network requests
- No tracking or analytics - user behavior is not monitored
- Privacy policy: https://vanjara.github.io/focus-warden/privacy.html

The extension uses this permission solely for blocking user-specified websites. No data is collected, transmitted, or stored externally.
```

**Shorter Version (If character limit):**

```
Required to enable users to block any website they find distracting. Chrome's declarativeNetRequest API requires host permissions to create blocking rules for user-specified websites. Since users can configure any domain, we cannot request specific permissions in advance.

Privacy: Zero data collection, all processing local, no external communication. Privacy policy: https://vanjara.github.io/focus-warden/privacy.html
```

## Storage Permission

**Current (Keep as is):**

```
The storage permission is required to save user preferences, blocked website lists, and schedule settings locally. This allows users to customize their blocking rules and maintain their settings across browser sessions. No data is transmitted to external servers - all information is stored locally on the user's device.
```

---

## Why the Enhanced Version Helps

1. **Technical Justification**: Explains WHY the API requires it (not just what it does)
2. **Privacy Emphasis**: Addresses Chrome's main concern about broad permissions
3. **No Alternative**: Shows this isn't excessive - it's the only way
4. **Transparency**: Links to privacy policy (required for broad permissions)
5. **Security Focus**: Emphasizes zero data collection

This should significantly improve your chances of approval.
