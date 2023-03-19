import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadCustom } from '@custom-types/index';

export const verifyCurrentUserController = (secret: string) => {
  /*
   * If the request has a session(cookie) with a jwt property, it will be verified.
   * If the jwt is valid, the currentUser property will be added to the request.
   * If the jwt is invalid, the currentUser property will be undefined.
   * If the request does not have a session with a jwt property, the currentUser property will be undefined.
   */
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
      return next();
    }
    try {
      req.currentUser = jwt.verify(String(req.session.jwt), secret) as JwtPayloadCustom;
    } catch (e) {
      /* empty */
    }
    next();
  };
};
