import { HttpStatusCodes } from '@utils/statusCodes';
import { JwtPayload } from 'jsonwebtoken';

export interface ErrorWithStatus extends Error {
  statusCode: HttpStatusCodes;
}

export interface JwtPayloadCustom extends JwtPayload {
  permissions: {
    authenticated: boolean;
  };
  exp: number;
  iss: string;
  sub: string;
  aud: string | string[];
  jti: string;
}
