import { test, expect } from '@playwright/test';

test.describe('Social Canvas AI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Wait for loading screen to disappear
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Should show library view
    await expect(page.locator('.library-view')).toBeVisible();
  });

  test('should display the header with logo', async ({ page }) => {
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Check for logo and app name
    await expect(page.locator('.logo')).toContainText('Social Canvas AI');
  });

  test('should show create new button', async ({ page }) => {
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Check for Create New button
    const createButton = page.locator('button:has-text("Create New")');
    await expect(createButton).toBeVisible();
  });

  test('should open preset modal when clicking Create New', async ({ page }) => {
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Click Create New button
    await page.click('button:has-text("Create New")');

    // Modal should appear
    await expect(page.locator('.preset-modal')).toBeVisible();
    await expect(page.locator('.preset-modal h2')).toContainText('Choose Canvas Size');
  });

  test('should have model stats button', async ({ page }) => {
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Check for model stats button (bar chart icon)
    const statsButton = page.locator('button[title="AI Model Stats & Pricing"]');
    await expect(statsButton).toBeVisible();
  });

  test('should have model tester button', async ({ page }) => {
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Check for model tester button (flask icon)
    const testerButton = page.locator('button[title="Test AI Models"]');
    await expect(testerButton).toBeVisible();
  });
});

test.describe('Model Stats Modal', () => {
  test('should open model stats modal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Click model stats button
    await page.click('button[title="AI Model Stats & Pricing"]');

    // Modal should appear with stats
    await expect(page.locator('.stats-modal, .model-stats-modal')).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Model Tester Modal', () => {
  test('should open model tester modal', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loading-screen')).toBeHidden({ timeout: 5000 });

    // Click model tester button
    await page.click('button[title="Test AI Models"]');

    // Modal should appear
    await expect(page.locator('.tester-modal')).toBeVisible({ timeout: 3000 });
  });
});
