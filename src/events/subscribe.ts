import { consumerOpts, JetStreamSubscription, JsMsg } from 'nats';
import { ConsumerOptsBuilder } from 'nats/lib/nats-base-client/types';
import { extractStreamName, getDurableName, js, logMessage, Subjects } from '@events/nats';
import { getEnvOrFail, log } from '@utils/index';
import chalk from 'chalk';

const getOptsBuilderConfigured = (subj: Subjects, queueGroupName: string): ConsumerOptsBuilder => {
  const opts = consumerOpts();
  opts.queue(queueGroupName);
  opts.manualAck();
  opts.bind(extractStreamName(subj), getDurableName(subj, queueGroupName));
  return opts;
};

export const subscribe = async (subj: Subjects, queueGroupName: string, cb: (m: JsMsg) => Promise<void>) => {
  if (!js) {
    throw new Error('Jetstream is not defined');
  }
  let sub: JetStreamSubscription;
  try {
    sub = await js.subscribe(subj, getOptsBuilderConfigured(subj, queueGroupName));
  } catch (e) {
    log(`Error subscribing to ${subj}`, e);
    throw e;
  }
  log(chalk`{gray [}{blue ${subj}}{gray ]} {bold.green subscription opened}`);

  for await (const m of sub) {
    const seq = m.seq;
    const strSeq = m.info.streamSequence;
    const redeliveryCount = m.info.redeliveryCount;
    const coloredLog = chalk`{bold.green SUB }{gray [}{cyan str_seq=${strSeq}}{gray ]}{gray [}{magenta seq=${seq}}{gray ]}{gray [}{red rdlvery=${redeliveryCount}}{gray ]}: ${logMessage(
      m.data
    )}`;
    log(coloredLog);
    void cb(m);
  }
  log(chalk`{gray [}{blue ${subj}}{gray ]} {bold.green subscription closed}`);
};

/**
 Naks a message with retries and delay - NACK_DELAY_MS env var

 @param {JsMsg} m - The message to be nacked
 @param {number} [maxRetries] - The maximum number of retries allowed. Defaults to the value of the NACK_MAX_RETRIES env var
 @param {number} delay - The delay in milliseconds. Defaults to the value of the NACK_DELAY_MS env var
 @returns {void}
 */
export const nakTheMsg = (
  m: JsMsg,
  maxRetries = Number(getEnvOrFail('NACK_MAX_RETRIES')),
  delay = Number(getEnvOrFail('NACK_DELAY_MS'))
) => {
  if (m.info.redeliveryCount >= maxRetries) {
    log(`Max retries reached ${maxRetries}, terminating message`);
    m.term();
    return;
  }
  m.nak(delay);
};
