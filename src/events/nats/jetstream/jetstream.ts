import { generateApiSubjects, getNatsConnection, monitorNatsConnectionStatus, verifyConsumers } from '@events/nats';
import { Options, SubjectsValues } from '@custom-types/nats';
import { JetStreamClient, NatsConnection } from 'nats';

export let js: JetStreamClient | undefined;

const getJetStreamClient = async (nc: NatsConnection) => {
  if (js) {
    return js;
  }
  const jsm = await nc.jetstreamManager();
  await verifyConsumers(jsm);
  js = nc.jetstream();
  return js;
};

const createJetStreamClient = async (nc: NatsConnection) => {
  await getJetStreamClient(nc);
};

export let apiSubjects: SubjectsValues[][] = [];

export const startJetStream = async (opts: Options) => {
  apiSubjects = generateApiSubjects(...opts.streams);
  const nc = await getNatsConnection(opts.nats);
  await createJetStreamClient(nc);
  void monitorNatsConnectionStatus();
};
