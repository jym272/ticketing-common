import { NextFunction, Request, Response } from 'express';
import { httpStatusCodes, throwError } from '@utils/index';

export const requireAuthController = () => {
  /*
   * If the currentUser property is undefined, the user is not authorized.
   * If the currentUser property is defined, the user is authorized.
   * If the user is not authorized, an error will be thrown.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return throwError(
        'Not authorized.',
        httpStatusCodes.UNAUTHORIZED,
        new Error('req.currentUser is undefined in requireAuth controller')
      );
    }
    next();
  };
};
