import { connect, NatsConnection } from 'nats';
import { Options } from '@custom-types/nats';

export let nc: NatsConnection | undefined;

export const getNatsConnection = async (opts: Options['nats']) => {
  if (nc) {
    return nc;
  }
  nc = await connect({ servers: opts.url, maxReconnectAttempts: opts.maxReconnectAttempts });
  return nc;
};
