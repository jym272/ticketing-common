import { JwtPayloadCustom } from '@custom-types/jwt';

// export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: JwtPayloadCustom;
    }
  }
}
