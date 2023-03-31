import { HttpStatusCodes } from '@utils/statusCodes';
import { ErrorWithStatus } from '@custom-types/index';
import { activateLogging, log } from '@utils/logs';

type ServerSideError = Error | undefined;

export const throwError = (
  clientMessage: string,
  statusCode: HttpStatusCodes = 500,
  serverSideError: ServerSideError = undefined
) => {
  if (activateLogging()) log(serverSideError ?? `Error: ${clientMessage}`);
  const newError = new Error(clientMessage) as ErrorWithStatus;
  newError.statusCode = statusCode;
  throw newError;
};

export const parseSequelizeError = (err: unknown, serverMessage: string): ServerSideError => {
  let error = new Error(serverMessage);
  if (err instanceof Error) {
    err.message = `${err.message} ${serverMessage}`;
    error = err;
  }
  return error;
};
