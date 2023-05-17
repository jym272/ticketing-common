import { utilsController, authController } from '@controllers/index';

export const commonController = {
  requireAuth: authController.requireAuth,
  verifyCurrentUser: authController.verifyCurrentUser,
  errorHandler: utilsController.errorHandler
};
// test_line ignore 2
export * as utils from '@utils/index';
export * as routes from '@routes/index';
export * as events from '@events/index';
