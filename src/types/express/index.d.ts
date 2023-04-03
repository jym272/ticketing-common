import { JwtPayloadCustom } from '@custom-types/jwt';

// export {};

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayloadCustom;
    }
  }
}
