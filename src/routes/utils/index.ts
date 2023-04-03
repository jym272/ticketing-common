import { Router } from 'express';
import { utilsController } from '@controllers/index';
import { httpStatusCodes, throwError } from '@utils/index';
// import { nc } from '@events/nats';

const { NOT_FOUND } = httpStatusCodes;

export const utils = Router();

// the instance of nc is unique in the lib, it must be initialized by the api
// utils.get('/api/healthz', (req, res) => {
//   const ncIsClosed = nc ? nc.isClosed() : true;
//   if (ncIsClosed) {
//     return res.status(BAD_REQUEST).send({ status: 'error' });
//   }
//   return res.status(OK).send({ status: 'ok' });
// });

utils.get('/crash-server', utilsController.crashServer);
utils.get('/health', utilsController.health);
utils.get('/env', utilsController.env);
utils.all('*', () => {
  throwError('Not Found.', NOT_FOUND);
});
