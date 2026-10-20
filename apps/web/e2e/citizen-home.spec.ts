import { test, expect } from '@playwright/test';

test('citizen home displays quick actions, Swachh rewards and village progress', async ({
  page,
}) => {
  // 1. Navigate to the citizen home page
  await page.goto('/citizen/home');

  // 2. Quick action cards: Report Full Bin, Learn Segregation, View Schedule
  await expect(page.getByText('Report Full Bin')).toBeVisible();
  await expect(page.getByText('Learn Segregation')).toBeVisible();
  await expect(page.getByText('View Schedule')).toBeVisible();

  // 3. "125 pts" Swachh rewards and village progress stats display
  await expect(page.getByText('125 pts')).toBeVisible();
  await expect(page.getByText('320.5 kg')).toBeVisible();
  await expect(page.getByText('86.4 kg')).toBeVisible();
});
