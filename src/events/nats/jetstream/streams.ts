import { JetStreamManager } from 'nats';
import { Streams } from '@events/nats';
import { log } from '@utils/logs';
import { STREAM_NOT_FOUND } from '@utils/constants';

export const verifyStreams = async (jsm: JetStreamManager, streams: Streams[]) => {
  for (const stream of streams) {
    const streamSubj = `${stream}.*`;
    try {
      await jsm.streams.find(streamSubj);
    } catch (e) {
      if (e instanceof Error && e.message === STREAM_NOT_FOUND) {
        log(`Stream ${stream} not found, creating...`);
        await jsm.streams.add({ name: stream, subjects: [streamSubj] });
        log(`Stream ${stream} with subject ${streamSubj} CREATED`);
        return;
      }
      throw e;
    }
    log(`Stream '${stream}' with subject '${streamSubj}' FOUND`);
  }
};
