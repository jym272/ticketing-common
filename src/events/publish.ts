import { js, sc, Subjects } from '@events/nats';
import { colorObject, log } from '@utils/logs';
import chalk from 'chalk';

const logMessage = (data: Uint8Array) => {
  const msgString = sc.decode(data);
  const msg = JSON.parse(msgString) as Record<string, unknown>;
  return colorObject(msg);
};

export const publish = async <T>(msg: T, subj: Subjects) => {
  const msgString = JSON.stringify({ [subj]: msg });
  if (!js) {
    throw new Error('JetStream not initialized');
  }
  const data = sc.encode(msgString);
  const pa = await js.publish(subj, data);
  const { seq, duplicate } = pa;
  const coloredLog = chalk`{bold.green PUB }{gray [}{cyan seq=${seq}}{gray ]}{gray [}{magenta dupl=${duplicate.toString()}}{gray ]}: ${logMessage(
    data
  )}`;
  log(coloredLog);
  return pa;
};
