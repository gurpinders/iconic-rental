import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    
    // Check page title contains "Iconic"
    await expect(page).toHaveTitle(/Iconic/i);
    
    // Check first navigation is visible (desktop nav)
    await expect(page.locator('nav').first()).toBeVisible();
    
    console.log('✅ Homepage loaded successfully!');
  });

  test('can navigate to fleet page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Click on the VISIBLE Fleet link (not the mobile one)
    await page.locator('nav a[href="/fleet"]').first().click();
    
    // Should be on fleet page
    await expect(page).toHaveURL(/\/fleet/);
    
    // Check fleet heading exists
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    console.log('✅ Navigation to fleet works!');
  });

  test('can navigate to quote page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Click on the VISIBLE Quote link
    await page.locator('nav a[href="/quote"]').first().click();
    
    // Should be on quote page
    await expect(page).toHaveURL(/\/quote/);
    
    console.log('✅ Navigation to quote works!');
  });
});

