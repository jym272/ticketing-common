import { consumerOpts, JetStreamSubscription, JsMsg } from 'nats';
import { ConsumerOptsBuilder } from 'nats/lib/nats-base-client/types';
import { extractStreamName, getDurableName, js, sc, Subjects } from '@events/nats';
import { log } from '@utils/logs';
import { getEnvOrFail } from '@utils/env';

const getOptsBuilderConfigured = (subj: Subjects): ConsumerOptsBuilder => {
  const opts = consumerOpts();
  opts.queue(subj);
  opts.manualAck();
  opts.bind(extractStreamName(subj), getDurableName(subj));
  return opts;
};

export const subscribe = async (subj: Subjects, cb: (m: JsMsg) => Promise<void>) => {
  if (!js) {
    throw new Error('Jetstream is not defined');
  }
  let sub: JetStreamSubscription;
  try {
    sub = await js.subscribe(subj, getOptsBuilderConfigured(subj));
  } catch (e) {
    log(`Error subscribing to ${subj}`, e);
    throw e;
  }
  log(`[${subj}] subscription opened`);
  for await (const m of sub) {
    log(`[${m.seq}]: [${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    // igual no puedo esperar nada
    void cb(m);
  }
  log(`[${subj}] subscription closed`);
};

/**
 Naks a message with retries and delay - NACK_DELAY_MS env var.
 @param {JsMsg} m - The message to be nacked.
 @param {number} [maxRetries] - The maximum number of retries allowed. Defaults to the value of the NACK_MAX_RETRIES env var.
 @returns {void}
 */
export const nakTheMsg = (m: JsMsg, maxRetries = Number(getEnvOrFail('NACK_MAX_RETRIES'))) => {
  if (m.info.redeliveryCount >= maxRetries) {
    log(`Max retries reached ${maxRetries}, terminating message`);
    m.term();
    return;
  }
  m.nak(Number(getEnvOrFail('NACK_DELAY_MS')));
};
