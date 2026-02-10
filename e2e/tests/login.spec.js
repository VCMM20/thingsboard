/*
 * Copyright © 2016-2026 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const { test, expect } = require('@playwright/test');

const USERNAME = process.env.TB_SYSADMIN_USER || 'sysadmin@thingsboard.org';
const PASSWORD = process.env.TB_SYSADMIN_PASS || 'sysadmin';
const NEW_PASSWORD = process.env.TB_SYSADMIN_NEW_PASS || 'sysadmin123';

async function openLoginPage(page) {
  const attempts = 30;
  for (let i = 0; i < attempts; i += 1) {
    try {
      await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.locator('#username-input').waitFor({ state: 'visible', timeout: 5000 });
      return;
    } catch (error) {
      if (i === attempts - 1) {
        throw error;
      }
      await page.waitForTimeout(2000);
    }
  }
}

test('sysadmin login smoke (availability)', async ({ page }) => {
  await openLoginPage(page);

  await page.locator('#username-input').fill(USERNAME);
  await page.locator('#password-input').fill(PASSWORD);
  await page.locator('form.tb-login-form button[type="submit"]').click();

  await page.waitForLoadState('networkidle');

  if (page.url().includes('/login/mfa') || page.url().includes('/login/force-mfa')) {
    throw new Error('MFA flow detected. Disable MFA for CI or add MFA handling to the test.');
  }

  if (page.url().includes('/login/createPassword') || page.url().includes('/login/resetExpiredPassword')) {
    await page.locator('input[formcontrolname="newPassword"]').fill(NEW_PASSWORD);
    await page.locator('input[formcontrolname="newPassword2"]').fill(NEW_PASSWORD);
    await page.locator('form button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
  }

  await expect(page.locator('tb-user-menu')).toBeVisible();
});
