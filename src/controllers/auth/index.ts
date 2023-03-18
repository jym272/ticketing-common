import { verifyCurrentUserController } from '@controllers/auth/verifyCurrentUser';

export const authController = {
  verifyCurrentUser: (secret: string) => verifyCurrentUserController(secret)
};
