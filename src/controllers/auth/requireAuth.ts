import { NextFunction, Request, Response } from 'express';
import { throwError } from '@utils/messages';
import { httpStatusCodes } from '@utils/statusCodes';

export const requireAuthController = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return throwError('Not authorized.', httpStatusCodes.UNAUTHORIZED);
    }
    next();
  };
};
