import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

test('UI audit: navigate every key page and capture screenshots', async ({ page }) => {
  test.setTimeout(180000);
  const screenshots: string[] = [];

  const capture = async (name: string) => {
    try {
      await page.evaluate(() => document.fonts.ready);
    } catch {}
    await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true, timeout: 20000 });
    screenshots.push(name);
  };

  const visit = async (url: string) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
  };

  const assertVisible = async (label: string, locator: string) => {
    await expect(page.locator(locator).first()).toBeVisible({ timeout: 10000 });
    console.log(`[OK] ${label}: visible`);
  };

  // 1. Home / Demo Role Selector
  await visit('/');
  await assertVisible('home page title', 'text=GRAM-CIRCULAR');
  await assertVisible('admin role card', 'text=Admin / Panchayat');
  await assertVisible('worker role card', 'text=Collection Worker');
  await assertVisible('mrf role card', 'text=MRF / PWMU Operator');
  await assertVisible('buyer role card', 'text=Buyer / Authorized Recycler');
  await assertVisible('citizen role card', 'text=Village Citizen');
  await capture('01-home-role-selector');

  // 2. Admin Dashboard
  await visit('/admin/dashboard');
  await assertVisible('admin dashboard title', 'h1:has-text("Dashboard")');
  await assertVisible('total waste KPI', 'text=1,248.6 kg');
  await assertVisible('MLP collected KPI', 'text=328.4 kg');
  await assertVisible('collection points KPI', 'text=24 / 28');
  await assertVisible('revenue KPI', 'text=₹18,450');
  await assertVisible('waste collection trend chart', 'text=Waste Collection Trend');
  await assertVisible('waste type distribution', 'text=Waste Type Distribution');
  await assertVisible('top villages', 'text=Top Villages');
  await assertVisible('collection points status table', 'text=Collection Points Status');
  await capture('02-admin-dashboard');

  // 3. Admin Villages
  await visit('/admin/villages');
  await assertVisible('villages page', 'h1:has-text("Villages")');
  await capture('03-admin-villages');

  // 4. Admin Collection Points + Map
  await visit('/admin/collection-points');
  await assertVisible('collection points page', 'h1:has-text("Collection Points")');
  await capture('04-admin-collection-points');

  // 5. Admin Bins
  await visit('/admin/bins');
  await assertVisible('bins page', 'h1:has-text("Live Bins")');
  await capture('05-admin-bins');

  // 6. Admin Routes
  await visit('/admin/routes');
  await assertVisible('routes page', 'h1:has-text("Route Optimization")');
  await capture('06-admin-routes');

  // 7. Admin Pooling
  await visit('/admin/pooling');
  await assertVisible('pooling page', 'h1:has-text("Waste Pooling")');
  await capture('07-admin-pooling');

  // 8. Admin Processors
  await visit('/admin/processors');
  await assertVisible('processors page', 'h1:has-text("Buyer & Processor Directory")');
  await capture('08-admin-processors');

  // 9. Admin Analytics
  await visit('/admin/analytics');
  await assertVisible('analytics page', 'h1:has-text("Mass-Balance Ledger")');
  await capture('09-admin-analytics');

  // 9b. Admin Reports
  await visit('/admin/reports');
  await assertVisible('reports page', 'h1:has-text("Reports & Compliance")');
  await capture('09b-admin-reports');

  // 10. Admin Simulations
  await visit('/admin/simulations');
  await assertVisible('simulations page', 'h1:has-text("What-If Resilience Simulator")');
  await capture('10-admin-simulations');

  // 11. Admin Anomalies
  await visit('/admin/anomalies');
  await assertVisible('anomalies page', 'h1:has-text("Anomaly Detection & Audit Review")');
  await capture('11-admin-anomalies');

  // 12. Worker Dashboard
  await visit('/worker/dashboard');
  await assertVisible('worker dashboard title', 'h1:has-text("Collection Worker Dashboard")');
  await assertVisible('collected today', 'text=70');
  await assertVisible('target today', 'text=120');
  await assertVisible('progress bar', 'text=58%');
  await capture('12-worker-dashboard');

  // 13. Worker Routes
  await visit('/worker/routes');
  await assertVisibleCheck(page, 'worker routes', 'h1:has-text("Today Collection Route")');
  await capture('13-worker-routes');

  // 14. Worker Weighing Station
  await visit('/worker/weighing');
  await assertVisibleCheck(page, 'weighing station title', 'h1:has-text("Weighing Station")');
  await assertVisibleCheck(page, 'scale display', 'text=12.8');
  await assertVisibleCheck(page, 'waste type selector', 'text=MLP (Foil)');
  await assertVisibleCheck(page, 'generate QR button', 'text=Save & Generate QR Passport');
  await capture('14-worker-weighing');

  // 15. Worker Collections
  await visit('/worker/collections');
  await assertVisibleCheck(page, 'collections page', 'h1:has-text("My Collections")');
  await capture('15-worker-collections');

  // 16. Worker Batches
  await visit('/worker/batches');
  await assertVisibleCheck(page, 'batches page', 'h1:has-text("Batch QR Passports")');
  await capture('16-worker-batches');

  // 17. Worker Sync
  await visit('/worker/sync');
  await assertVisibleCheck(page, 'sync page', 'h1:has-text("Offline Sync Queue")');
  await capture('17-worker-sync');

  // 18. MRF Dashboard
  await visit('/mrf/dashboard');
  await assertVisibleCheck(page, 'mrf dashboard title', 'h1:has-text("MRF Operator Dashboard")');
  await assertVisibleCheck(page, 'MLP stock KPI', 'text=420 kg');
  await assertVisibleCheck(page, 'new batches KPI', 'text=12');
  await assertVisibleCheck(page, 'inspection pending KPI', 'text=8');
  await assertVisibleCheck(page, 'dispatch ready KPI', 'text=3');
  await capture('18-mrf-dashboard');

  // 19. MRF Batches
  await visit('/mrf/batches');
  await assertVisibleCheck(page, 'mrf batches', 'h1:has-text("Incoming Batches")');
  await capture('19-mrf-batches');

  // 20. MRF Inspection
  await visit('/mrf/inspection');
  await assertVisibleCheck(page, 'inspection page', 'h1:has-text("Quality Inspection")');
  await capture('20-mrf-inspection');

  // 21. MRF Storage
  await visit('/mrf/storage');
  await assertVisibleCheck(page, 'storage page', 'h1:has-text("Storage & Inventory")');
  await capture('21-mrf-storage');

  // 21b. MRF Inventory Ledger
  await visit('/mrf/inventory');
  await assertVisibleCheck(page, 'inventory ledger page', 'h1:has-text("Inventory Ledger")');
  await capture('21b-mrf-inventory');

  // 22. MRF Dispatch
  await visit('/mrf/dispatch');
  await assertVisibleCheck(page, 'dispatch page', 'h1:has-text("Dispatch to Processor")');
  await capture('22-mrf-dispatch');

  // 23. MRF Traceability
  await visit('/mrf/traceability');
  await assertVisibleCheck(page, 'traceability page', 'h1:has-text("Batch Traceability & Digital Provenance")');
  await capture('23-mrf-traceability');

  // 24. Buyer Dashboard
  await visit('/buyer/dashboard');
  await assertVisibleCheck(page, 'buyer dashboard title', 'h1:has-text("Procurement Dashboard")');
  await assertVisibleCheck(page, 'available batches KPI', 'text=12');
  await assertVisibleCheck(page, 'received this month', 'text=412 kg');
  await assertVisibleCheck(page, 'total purchased', 'text=2,450');
  await capture('24-buyer-dashboard');

  // 25. Buyer Batches
  await visit('/buyer/batches');
  await assertVisibleCheck(page, 'buyer batches', 'h1:has-text("Available MLP Batches")');
  await capture('25-buyer-batches');

  // 26. Buyer Requests
  await visit('/buyer/requests');
  await assertVisibleCheck(page, 'buyer requests', 'h1:has-text("Pickup Requests & Scheduling")');
  await capture('26-buyer-requests');

  // 27. Buyer Receipts
  await visit('/buyer/receipts');
  await assertVisibleCheck(page, 'buyer receipts', 'h1:has-text("Handover Receipts")');
  await capture('27-buyer-receipts');

  // 28. Buyer History
  await visit('/buyer/history');
  await assertVisibleCheck(page, 'buyer history', 'h1:has-text("Purchase History")');
  await capture('28-buyer-history');

  // 29. Citizen Home
  await visit('/citizen/home');
  await assertVisibleCheck(page, 'citizen home title', 'h1:has-text("Village Citizen Portal")');
  await assertVisibleCheck(page, 'swachh rewards', 'text=125 pts');
  await assertVisibleCheck(page, 'village progress', 'text=320.5 kg');
  await assertVisibleCheck(page, 'MLP diverted', 'text=86.4 kg');
  await capture('29-citizen-home');

  // 30. Citizen Report
  await visit('/citizen/report');
  await assertVisibleCheck(page, 'citizen report', 'h1:has-text("Report Full / Damaged Bin")');
  await capture('30-citizen-report');

  // 31. Citizen Schedule
  await visit('/citizen/schedule');
  await assertVisibleCheck(page, 'citizen schedule', 'h1:has-text("Collection Schedule")');
  await capture('31-citizen-schedule');

  // 32. Citizen Learn
  await visit('/citizen/learn');
  await assertVisibleCheck(page, 'citizen learn', 'h1:has-text("Segregation Guide")');
  await capture('32-citizen-learn');

  // 33. Citizen Progress
  await visit('/citizen/progress');
  await assertVisibleCheck(page, 'citizen progress', 'h1:has-text("Village Cleanliness Leaderboard")');
  await capture('33-citizen-progress');

  // 34. Shared Batch Passport
  await visit('/shared/batches/MLP-2026-0143');
  await assertVisibleCheck(page, 'shared batch title', 'text=Public Digital Waste Provenance Passport');
  await assertVisibleCheck(page, 'batch number', 'text=MLP-2026-0143');
  await assertVisibleCheck(page, 'QR code', 'canvas, svg');
  await capture('34-shared-batch-passport');

  // 35. Shared QR token (redirects to batch page)
  await page.goto('/shared/qr/QR-MLP-2026-0143-SECURE-984', { waitUntil: 'domcontentloaded' });
  await page.waitForURL('**/shared/batches/**', { timeout: 10000 });
  await page.waitForTimeout(500);
  await assertVisibleCheck(page, 'shared QR redirect target', 'text=Public Digital Waste Provenance Passport');
  await capture('35-shared-qr-token');

  // Role switching via top banner
  await visit('/admin/dashboard');
  await page.click('text=Worker', { timeout: 10000 });
  await assertVisibleCheck(page, 'switched to worker dashboard', 'h1:has-text("Collection Worker Dashboard")');
  await capture('36-role-switch-worker');

  await page.goBack({ timeout: 10000 });
  await page.click('text=Citizen', { timeout: 10000 });
  await assertVisibleCheck(page, 'switched to citizen home', 'h1:has-text("Village Citizen Portal")');
  await capture('37-role-switch-citizen');

  console.log(`\nCaptured ${screenshots.length} screenshots:`);
  screenshots.forEach((s) => console.log(`  - e2e/screenshots/${s}.png`));
});

async function assertVisibleCheck(page: any, label: string, locator: string) {
  await expect(page.locator(locator).first()).toBeVisible({ timeout: 10000 });
  console.log(`[OK] ${label}: visible`);
}
