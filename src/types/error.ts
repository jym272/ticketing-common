import { HttpStatusCodes } from '@utils/statusCodes';

export interface ErrorWithStatus extends Error {
  statusCode: HttpStatusCodes;
}
