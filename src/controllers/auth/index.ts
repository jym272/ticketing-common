import { requireAuthController } from '@controllers/auth/requireAuth';
import { verifyCurrentUserController } from '@controllers/auth/verifyCurrentUser';

export const authController = {
  requireAuth: requireAuthController(),
  verifyCurrentUser: verifyCurrentUserController
};
