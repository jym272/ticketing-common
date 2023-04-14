import { generateApiSubjects, getNatsConnection, monitorNatsConnectionStatus, verifyConsumers } from '@events/nats';
import { Options, SubjectsValues } from '@custom-types/nats';
import { JetStreamClient, NatsConnection } from 'nats';

export let js: JetStreamClient | undefined;

const getJetStreamClient = (nc: NatsConnection) => {
  if (js) {
    return js;
  }

  js = nc.jetstream();
  return js;
};

const createJetStreamClient = (nc: NatsConnection) => {
  getJetStreamClient(nc);
};

export let apiSubjects: SubjectsValues[][] = [];

export const startJetStream = async (opts: Options) => {
  apiSubjects = generateApiSubjects(...opts.streams);
  const nc = await getNatsConnection(opts.nats);
  const jsm = await nc.jetstreamManager();
  await verifyConsumers(jsm, opts.queueGroupName);
  createJetStreamClient(nc);
  void monitorNatsConnectionStatus();
};
