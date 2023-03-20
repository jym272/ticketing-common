import { authController } from '@controllers/auth';

export const commonController = {
  requireAuth: authController.requireAuth,
  verifyCurrentUser: authController.verifyCurrentUser
};

export * as utils from '@utils/index';
export * as routes from '@routes/index';
