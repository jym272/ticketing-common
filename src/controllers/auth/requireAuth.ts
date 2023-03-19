import { NextFunction, Request, Response } from 'express';
import { throwError } from '@utils/messages';
import { httpStatusCodes } from '@utils/statusCodes';

export const requireAuthController = () => {
  /*
   * If the currentUser property is undefined, the user is not authorized.
   * If the currentUser property is defined, the user is authorized.
   * If the user is not authorized, an error will be thrown.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return throwError('Not authorized.', httpStatusCodes.UNAUTHORIZED);
    }
    next();
  };
};
