import { test, expect } from '@playwright/test';
import { logFinished, logRunning } from '../../test-utils';
import { httpStatusCodes } from '@utils/statusCodes';

// eslint-disable-next-line no-empty-pattern
test.beforeEach(({}, testInfo) => logRunning(testInfo));

// eslint-disable-next-line no-empty-pattern
test.afterEach(({}, testInfo) => logFinished(testInfo));

test.describe('routes: home', () => {
  test('get home route', async ({ request }) => {
    const response = await request.get('/');
    const body = await response.body();
    expect(response.ok()).toBe(true);
    expect(body.toString()).toBe('Hello there!');
    expect(response.status()).toBe(httpStatusCodes.OK);
  });
});
