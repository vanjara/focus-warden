# Short Permission Justification (< 1000 characters)

## Host Permissions (<all_urls>) - Concise Version

**Version 1 (Most Concise - ~450 chars):**

```
Required to block any website users find distracting. Chrome's declarativeNetRequest API requires host permissions to create blocking rules for user-specified websites. Since users can configure any domain, we cannot request specific permissions in advance.

Privacy: Zero data collection, all processing local, no external communication. Privacy policy: https://vanjara.github.io/focus-warden/privacy.html
```

**Version 2 (Balanced - ~650 chars):**

```
Required to enable users to block any website they find distracting, not just common social media sites. Chrome's declarativeNetRequest API requires host permissions to create blocking rules for user-specified websites. Since users can configure any domain, we cannot request specific permissions in advance. There is no alternative way to implement user-configurable website blocking.

Privacy: Zero data collection - no browsing history or personal information collected. All processing occurs locally. No external server communication. Privacy policy: https://vanjara.github.io/focus-warden/privacy.html
```

**Version 3 (More Detailed - ~850 chars):**

```
Required to enable users to block any website they find distracting. Chrome's declarativeNetRequest API requires host permissions to create blocking rules for user-specified websites. Since users can configure any domain to block, we cannot request specific host permissions in advance. The extension must monitor page loads to detect blocked sites. There is no alternative way to implement user-configurable website blocking without this permission.

Privacy: Zero data collection - no browsing history, personal information, or usage data collected. All processing occurs locally on device. No external server communication. Privacy policy: https://vanjara.github.io/focus-warden/privacy.html
```

---

## Character Counts:
- Version 1: ~450 characters ✅
- Version 2: ~650 characters ✅
- Version 3: ~850 characters ✅

All versions are under 1000 characters and include:
- ✅ Why permission is needed
- ✅ Technical requirement (API)
- ✅ Privacy commitment
- ✅ Privacy policy link

**Recommendation:** Use Version 2 or 3 for better coverage while staying under limit.
