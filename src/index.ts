import { requireAuthController, verifyCurrentUserController } from '@controllers/auth';

export const commonController = {
  requireAuth: requireAuthController(),
  verifyCurrentUser: verifyCurrentUserController
};

export * as utils from '@utils/index';
export * as routes from '@routes/index';
