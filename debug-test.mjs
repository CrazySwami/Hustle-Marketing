import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Collect console messages
  const messages = [];
  page.on('console', msg => {
    messages.push({ type: msg.type(), text: msg.text() });
  });

  // Collect page errors
  page.on('pageerror', error => {
    messages.push({ type: 'pageerror', text: error.message });
  });

  await page.goto('http://localhost:5174/');

  // Wait for app to load
  await page.waitForSelector('.library-view', { timeout: 10000 });
  console.log('Library view loaded');

  // Click Create New
  await page.click('button:has-text("Create New")');
  await page.waitForSelector('.preset-modal');
  console.log('Preset modal opened');

  // Click first preset (Instagram Story)
  await page.click('.preset-option');
  await page.waitForSelector('.editor-view', { timeout: 5000 });
  console.log('Editor view loaded');

  // Find chat input and type something
  const chatInput = page.locator('.chat-input input');
  await chatInput.fill('Add a headline');
  console.log('Typed in chat input');

  // Click send button
  await page.click('.chat-input button');
  console.log('Clicked send');

  // Wait for loading to finish and response to appear
  await page.waitForTimeout(2000);

  // Count messages and check for response
  const messageCount = await page.locator('.chat-message').count();
  console.log('Total messages:', messageCount);

  // Check for assistant response (should be more than initial + user message)
  const assistantMessages = await page.locator('.chat-message.assistant').count();
  console.log('Assistant messages:', assistantMessages);

  // Check if there's an operations badge (indicates successful operation)
  const hasBadge = await page.locator('.operations-badge').isVisible().catch(() => false);
  console.log('Operations badge visible:', hasBadge);

  // Get the last assistant message
  const lastResponse = await page.locator('.chat-message.assistant').last().innerText().catch(() => 'none');
  console.log('Last response:', lastResponse.substring(0, 100) + '...');

  console.log('\n=== Console Errors ===');
  messages.forEach(m => {
    if (m.type === 'error' || m.type === 'pageerror' || m.text.includes('error') || m.text.includes('Error')) {
      console.log(`[${m.type}] ${m.text}`);
    }
  });

  await browser.close();
})();
