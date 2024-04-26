import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/vehicle-search.html');
  await page.getByRole('link', { name: 'Add a vehicle' }).click();
  await page.goto('http://127.0.0.1:3000/add-vehicle.html');
  await page.getByPlaceholder('Enter registration plate').click();
  await page.goto('http://127.0.0.1:3000/add-vehicle.html');
});