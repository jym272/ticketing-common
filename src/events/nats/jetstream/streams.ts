import { JetStreamManager } from 'nats';
import { Streams } from '@events/nats';
import { log } from '@utils/logs';
import { STREAM_NOT_FOUND } from '@utils/constants';
import chalk from 'chalk';

export const verifyStreams = async (jsm: JetStreamManager, streams: Streams[]) => {
  for (const stream of streams) {
    const streamSubj = `${stream}.*`;
    try {
      await jsm.streams.find(streamSubj);
    } catch (e) {
      if (e instanceof Error && e.message === STREAM_NOT_FOUND) {
        log(chalk`{bold.yellow notFound}\t{gray [}{cyan stream=${stream}}{gray ]}`);
        await jsm.streams.add({ name: stream, subjects: [streamSubj] });
        log(
          chalk`{bold.green created}\t{gray [}{cyan stream=${stream}}{gray ]}\t{gray [}{magenta subjects=${streamSubj}}{gray ]}`
        );
        continue;
      }
      throw e;
    }
  }
};
