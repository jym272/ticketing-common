import { JwtPayload } from 'jsonwebtoken';

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
