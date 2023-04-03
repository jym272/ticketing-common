import { connect, NatsConnection } from 'nats';
import { Options } from '@custom-types/nats';

export let nc: NatsConnection | undefined;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;

export const getNatsConnection = async (opts: Options['nats']) => {
  const { url, maxReconnectAttempts: mra } = opts;
  const maxReconnectAttempts = mra ?? DEFAULT_MAX_RECONNECT_ATTEMPTS;
  if (nc) {
    return nc;
  }
  nc = await connect({ servers: url, maxReconnectAttempts });
  return nc;
};
