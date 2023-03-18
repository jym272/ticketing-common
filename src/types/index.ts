import { HttpStatusCodes } from '@utils/statusCodes';
import { JwtPayload } from 'jsonwebtoken';

export interface Credentials {
  password: string;
  email: string;
}

export interface ErrorWithStatus extends Error {
  statusCode: HttpStatusCodes;
}

export interface JwtPayloadCustom extends JwtPayload {
  permissions: {
    authenticated: boolean;
  };
}
