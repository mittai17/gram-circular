import { test, expect } from '@playwright/test';

test('worker weighing generates a QR passport and opens the shared batch page', async ({
  page,
}) => {
  // 1. Navigate to the worker weighing station
  await page.goto('/worker/weighing');

  // 2. Stable weight reading displays (12.8 kg)
  await expect(page.getByText('12.8').first()).toBeVisible();
  await expect(page.getByText(/Stable Reading/)).toBeVisible();

  // 3. Select waste type MLP and collection point CP-03
  await page.getByText('MLP (Foil)').click();
  await page
    .locator('select')
    .filter({ has: page.locator('option[value="CP-03"]') })
    .selectOption('CP-03');

  // 4. Click "Save & Generate QR Passport"
  await page.getByRole('button', { name: 'Save & Generate QR Passport' }).click();

  // 5. A batch ID and QR code appear
  await expect(page.getByText(/MLP-2026-\d+/)).toBeVisible();
  await expect(page.locator('svg[height="180"]')).toBeVisible();

  // 6. Click "View Passport" → navigates to /shared/batches/<batchId>,
  //    batch number and custody timeline display
  await page.locator('a[href*="/shared/batches/"]').click();
  await expect(page).toHaveURL(/\/shared\/batches\/MLP-2026-\d+/);
  await expect(page.getByText(/MLP-2026-\d+/)).toBeVisible();
  await expect(page.getByText('Origin Collection & Sensor Weigh-in')).toBeVisible();
});
