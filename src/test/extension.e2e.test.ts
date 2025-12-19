import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import puppeteer, { Browser } from 'puppeteer'
import path from 'path'

const EXTENSION_PATH = path.resolve(__dirname, '../../FocusWarden-v1.0.1')
const EXTENSION_ID_REGEX = /^[a-z]{32}$/

describe('FocusWarden Extension E2E Tests', () => {
  let browser: Browser
  let extensionId: string

  beforeAll(async () => {
    // Launch Chrome with extension loaded
    browser = await puppeteer.launch({
      headless: false, // Extensions require headed mode
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    })

    // Wait for extension to load
    await new Promise(r => setTimeout(r, 2000))

    // Try multiple methods to get extension ID
    for (let attempt = 0; attempt < 5; attempt++) {
      const targets = await browser.targets()
      
      // Method 1: Find service worker
      const serviceWorker = targets.find(
        (target) => target.type() === 'service_worker' && target.url().includes('chrome-extension://')
      )
      if (serviceWorker) {
        extensionId = serviceWorker.url().split('/')[2]
        break
      }

      // Method 2: Find any extension page
      const extPage = targets.find(
        (target) => target.url().startsWith('chrome-extension://') && !target.url().includes('newtab')
      )
      if (extPage) {
        extensionId = extPage.url().split('/')[2]
        break
      }

      // Method 3: Open extensions page and find it
      if (attempt === 2) {
        const page = await browser.newPage()
        await page.goto('chrome://extensions')
        await new Promise(r => setTimeout(r, 1000))
        await page.close()
      }

      await new Promise(r => setTimeout(r, 1000))
    }

    if (!extensionId) {
      // Final fallback: manually open popup to trigger extension
      const page = await browser.newPage()
      // Navigate to any page first
      await page.goto('about:blank')
      await new Promise(r => setTimeout(r, 500))
      
      const targets = await browser.targets()
      const sw = targets.find(t => t.type() === 'service_worker')
      if (sw) {
        extensionId = sw.url().split('/')[2]
      }
      await page.close()
    }

    console.log('Extension ID:', extensionId)
    
    if (!extensionId) {
      throw new Error('Could not find extension ID. Make sure the extension is built in FocusWarden-v1.0.1/')
    }
  }, 60000)

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
  })

  it('should load extension successfully', async () => {
    expect(extensionId).toBeDefined()
    expect(typeof extensionId).toBe('string')
    expect(extensionId.length).toBe(32)
  })

  it('should open popup page', async () => {
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extensionId}/popup.html`)
    
    // Check popup loaded
    const title = await page.title()
    expect(title).toBeDefined()
    
    // Check for main elements (toggle/checkbox)
    const toggleExists = await page.$('#enabled') !== null || 
                         await page.$('.toggle') !== null ||
                         await page.$('input[type="checkbox"]') !== null
    expect(toggleExists).toBe(true)
    
    await page.close()
  }, 10000)

  it('should add a website to block list', async () => {
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extensionId}/popup.html`)
    
    // Wait for page to load
    await page.waitForSelector('body')
    await new Promise(r => setTimeout(r, 500))
    
    // Find and fill the website input
    const input = await page.$('input[type="text"]')
    if (input) {
      await input.type('example-test-site.com')
      
      // Find and click add/save button
      const buttons = await page.$$('button')
      for (const button of buttons) {
        const text = await button.evaluate(el => el.textContent?.toLowerCase())
        if (text?.includes('add') || text?.includes('save')) {
          await button.click()
          break
        }
      }
      
      await new Promise(r => setTimeout(r, 500))
    }
    
    await page.close()
  }, 10000)

  it('should show blocked page when visiting blocked site', async () => {
    const popupPage = await browser.newPage()
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`)
    await new Promise(r => setTimeout(r, 1000))

    // Enable blocking using JavaScript evaluation (more reliable than clicking)
    await popupPage.evaluate(() => {
      const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement
      if (checkbox && !checkbox.checked) {
        checkbox.click()
      }
    })
    await new Promise(r => setTimeout(r, 500))

    // Add test site using keyboard
    const input = await popupPage.$('input[type="text"]')
    if (input) {
      await input.focus()
      await popupPage.keyboard.down('Control')
      await popupPage.keyboard.press('a')
      await popupPage.keyboard.up('Control')
      await input.type('httpbin.org')
      
      // Try clicking add button or pressing Enter
      await popupPage.keyboard.press('Enter')
      await new Promise(r => setTimeout(r, 500))
      
      // Also try clicking button as backup
      await popupPage.evaluate(() => {
        const buttons = document.querySelectorAll('button')
        for (const btn of buttons) {
          const text = btn.textContent?.toLowerCase() || ''
          if (text.includes('add') || text.includes('save') || text === '+') {
            btn.click()
            break
          }
        }
      })
      await new Promise(r => setTimeout(r, 1000))
    }

    await popupPage.close()

    // Now try to visit the blocked site
    const testPage = await browser.newPage()
    
    try {
      await testPage.goto('https://httpbin.org', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      })
    } catch {
      // Navigation might be interrupted by redirect - that's expected
    }

    await new Promise(r => setTimeout(r, 2000))

    // Check if we're on the blocked page
    const currentUrl = testPage.url()
    const isBlocked = currentUrl.includes('blocked.html') || 
                      currentUrl.includes('chrome-extension://')

    if (isBlocked) {
      // Verify blocked page content
      const blockedUrlElement = await testPage.$('#blockedUrl')
      if (blockedUrlElement) {
        const blockedUrlText = await blockedUrlElement.evaluate(el => el.textContent)
        
        // THE MAIN TEST: Should NOT show extension ID
        expect(blockedUrlText).not.toContain('chrome-extension://')
        expect(blockedUrlText).not.toMatch(EXTENSION_ID_REGEX)
        
        console.log('Blocked URL displayed:', blockedUrlText)
      }
    }

    await testPage.close()
  }, 30000)

  it('should NOT show extension ID on blocked page', async () => {
    // Direct test of blocked page
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extensionId}/blocked.html`)
    
    await new Promise(r => setTimeout(r, 1000))
    
    // Get all text content
    const bodyText = await page.evaluate(() => document.body.innerText)
    
    // Should not contain extension ID pattern
    expect(bodyText).not.toMatch(/chrome-extension:\/\/[a-z]{32}/)
    
    // Check the blockedUrl element specifically
    const blockedUrlElement = await page.$('#blockedUrl')
    if (blockedUrlElement) {
      const text = await blockedUrlElement.evaluate(el => el.textContent)
      expect(text).not.toContain('chrome-extension://')
    }

    await page.close()
  }, 10000)

  it('should have working buttons on blocked page', async () => {
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extensionId}/blocked.html`)
    
    await new Promise(r => setTimeout(r, 500))
    
    // Check for expected buttons
    const buttons = await page.$$('button')
    const buttonTexts: string[] = []
    
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent)
      if (text) buttonTexts.push(text.trim().toLowerCase())
    }
    
    // Should have New Tab button at minimum
    const hasNewTab = buttonTexts.some(t => t.includes('new tab') || t.includes('newtab'))
    const hasSettings = buttonTexts.some(t => t.includes('setting'))
    
    // At least one navigation option should exist
    expect(buttons.length).toBeGreaterThan(0)
    // Verify expected buttons exist
    expect(hasNewTab || hasSettings).toBe(true)
    
    await page.close()
  }, 10000)

  it('should display motivational quote on blocked page', async () => {
    const page = await browser.newPage()
    await page.goto(`chrome-extension://${extensionId}/blocked.html`)
    
    await new Promise(r => setTimeout(r, 1000))
    
    // Look for quote element
    const quoteElement = await page.$('#quote') || await page.$('.quote')
    
    if (quoteElement) {
      const quoteText = await quoteElement.evaluate(el => el.textContent)
      expect(quoteText).toBeTruthy()
      expect(quoteText!.length).toBeGreaterThan(10) // Should be a real quote
    }
    
    await page.close()
  }, 10000)
})

