import { test, expect } from '@playwright/test';

test('role switching: home → admin dashboard → worker dashboard → citizen home', async ({
  page,
}) => {
  // 1. Visit the home page
  await page.goto('/');

  // 2. Home page shows GRAM-CIRCULAR and all 5 role cards
  await expect(page.getByText('GRAM-CIRCULAR').first()).toBeVisible();
  await expect(page.getByText('Admin / Panchayat').first()).toBeVisible();
  await expect(page.getByText('Collection Worker').first()).toBeVisible();
  await expect(page.getByText('MRF / PWMU Operator').first()).toBeVisible();
  await expect(page.getByText('Buyer / Authorized Recycler').first()).toBeVisible();
  await expect(page.getByText('Village Citizen').first()).toBeVisible();

  // 3. Click the "Admin" role card → navigates to /admin/dashboard, dashboard heading appears
  await page.getByRole('button', { name: 'Enter Admin Portal' }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // 4. Use the top role-switcher banner to switch to Worker → /worker/dashboard
  await page.getByRole('button', { name: /Worker/ }).click();
  await expect(page).toHaveURL(/\/worker\/dashboard/);

  // 5. Switch to Citizen → /citizen/home
  await page.getByRole('button', { name: /Citizen/ }).click();
  await expect(page).toHaveURL(/\/citizen\/home/);
});
