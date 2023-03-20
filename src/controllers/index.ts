import { getHomeController } from '@controllers/home';
import { requireAuthController, verifyCurrentUserController } from '@controllers/auth';

export const commonController = {
  getHome: getHomeController(),
  requireAuth: requireAuthController(),
  verifyCurrentUser: verifyCurrentUserController
};

export * as utils from '@utils/index';
