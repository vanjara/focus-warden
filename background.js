class FocusGuardBackground {
    constructor() {
        this.initializeListeners();
        this.updateRules();
    }

    initializeListeners() {
        // Handle installation
        chrome.runtime.onInstalled.addListener(() => {
            this.initializeStorage();
        });

        // Handle messages from popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'updateRules') {
                this.updateRules();
            } else if (message.action === 'openExtensionPage') {
                // Open the extensions page
                chrome.tabs.create({ url: 'chrome://extensions/' });
            } else if (message.action === 'createNewTab') {
                // Create a new tab
                chrome.tabs.create({ url: 'chrome://newtab/' });
            } else if (message.action === 'checkBlockStatus') {
                // Handle block status check from content script
                this.checkBlockStatus().then(shouldBlock => {
                    sendResponse({ shouldBlock });
                });
                return true; // Keep message channel open for async response
            }
        });

        // Handle alarms for scheduled blocks
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'updateRules') {
                this.updateRules();
            }
        });

        // Set up periodic rule updates
        chrome.alarms.create('updateRules', { periodInMinutes: 1 });
    }

    async initializeStorage() {
        const data = await chrome.storage.sync.get(['enabled', 'websites', 'schedules']);
        
        if (!data.enabled) {
            await chrome.storage.sync.set({
                enabled: false,
                websites: [],
                schedules: [],
                quickBlockEnd: null
            });
        }
    }

    async updateRules() {
        try {
            const data = await chrome.storage.sync.get(['enabled', 'websites', 'schedules', 'quickBlockEnd']);
            
            if (!data.enabled) {
                // Remove all blocking rules
                await this.removeAllRules();
                return;
            }

            // If no websites are configured, don't block anything
            if (!data.websites || data.websites.length === 0) {
                await this.removeAllRules();
                return;
            }

            const shouldBlock = await this.shouldBlockNow(data);
            
            // Get extension ID to create exception rule
            const extensionId = chrome.runtime.id;
            
            // Always add exception rule to never block extension's own pages
            // This must have higher priority and be present always
            const exceptionRule = {
                id: 9999,
                priority: 1000, // Much higher priority than blocking rules
                action: {
                    type: 'allow'
                },
                condition: {
                    urlFilter: `chrome-extension://${extensionId}/*`,
                    resourceTypes: ['main_frame']
                }
            };

            if (shouldBlock) {
                // Create blocking rules - only for http/https URLs
                // The urlFilter pattern *:// only matches http and https, not chrome-extension://
                const rules = data.websites.map((website, index) => ({
                    id: index + 1,
                    priority: 1,
                    action: {
                        type: 'redirect',
                        redirect: {
                            extensionPath: '/blocked.html'
                        }
                    },
                    condition: {
                        // Only match http and https (not chrome-extension://)
                        urlFilter: `*://*.${website.url}/*`,
                        resourceTypes: ['main_frame']
                    }
                }));

                // Update rules - include exception rule to protect extension pages
                await chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: await this.getAllRuleIds(),
                    addRules: [...rules, exceptionRule]
                });
            } else {
                // Remove blocking rules but keep exception rule
                const currentRuleIds = await this.getAllRuleIds();
                const blockingRuleIds = currentRuleIds.filter(id => id !== 9999);
                
                if (blockingRuleIds.length > 0) {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                        removeRuleIds: blockingRuleIds
                    });
                }
                
                // Ensure exception rule exists
                const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
                const hasExceptionRule = existingRules.some(rule => rule.id === 9999);
                if (!hasExceptionRule) {
                    await chrome.declarativeNetRequest.updateDynamicRules({
                        addRules: [exceptionRule]
                    });
                }
            }
        } catch (error) {
            console.error('Error updating rules:', error);
        }
    }

    async shouldBlockNow(data) {
        const now = new Date();
        
        // Check quick block
        if (data.quickBlockEnd && now < new Date(data.quickBlockEnd)) {
            return true;
        }

        // Check scheduled blocks
        if (data.schedules && data.schedules.length > 0) {
            const currentDay = now.getDay();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            for (const schedule of data.schedules) {
                if (schedule.days.includes(currentDay)) {
                    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
                    const [endHour, endMin] = schedule.endTime.split(':').map(Number);
                    const startTime = startHour * 60 + startMin;
                    const endTime = endHour * 60 + endMin;

                    if (currentTime >= startTime && currentTime < endTime) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    async checkBlockStatus() {
        try {
            const data = await chrome.storage.sync.get(['enabled', 'websites', 'schedules', 'quickBlockEnd']);
            
            if (!data.enabled || !data.websites || data.websites.length === 0) {
                return false;
            }

            return await this.shouldBlockNow(data);
        } catch (error) {
            return false;
        }
    }

    async getAllRuleIds() {
        const rules = await chrome.declarativeNetRequest.getDynamicRules();
        return rules.map(rule => rule.id);
    }

    async removeAllRules() {
        const ruleIds = await this.getAllRuleIds();
        if (ruleIds.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds
            });
        }
    }
}

// Initialize background script
new FocusGuardBackground();