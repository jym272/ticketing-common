import { AckPolicy, createInbox, DeliverPolicy, JetStreamManager, nanos } from 'nats';
import { apiSubjects, extractStreamName, getDurableName, Streams } from '@events/nats';
import { SubjectsValues, UniqueConsumerProps } from '@custom-types/nats';
import { log } from '@utils/logs';

const STREAM_NOT_FOUND = 'no stream matches subject';

const createConsumerProps = (values: SubjectsValues[]) =>
  values.map(subjectValue => {
    return {
      durableName: getDurableName(subjectValue),
      queueGroupName: subjectValue,
      filterSubject: subjectValue
    };
  });

const findConsumer = async (jsm: JetStreamManager, durableName: string, stream: Streams) => {
  const consumers = await jsm.consumers.list(stream).next();
  for (const ci of consumers) {
    const { config } = ci;
    if (config.durable_name === durableName) {
      return true;
    }
  }
  return false;
};

const verifyStream = async (jsm: JetStreamManager, stream: Streams) => {
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
};

const verifyConsumer = async (jsm: JetStreamManager, uniqueConsumer: UniqueConsumerProps) => {
  const { durableName, queueGroupName, filterSubject } = uniqueConsumer;

  const stream = extractStreamName(filterSubject);
  await verifyStream(jsm, stream);

  if (!(await findConsumer(jsm, durableName, stream))) {
    log(`Consumer with name ${durableName} not found. Creating consumer...`);
    await jsm.consumers.add(stream, {
      durable_name: durableName,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      deliver_subject: createInbox(),
      deliver_group: queueGroupName,
      filter_subject: filterSubject,
      ack_wait: nanos(10 * 1000) // 10 seconds
    });
    log(`Consumer with name ${durableName} CREATED`);
    return;
  }
  log(`Consumer with name ${durableName} FOUND`);
};

export const verifyConsumers = async (jsm: JetStreamManager) => {
  if (!apiSubjects.length) {
    throw new Error('No subjects found');
  }
  for (const subjectsValuesPerStream of apiSubjects) {
    const durables = createConsumerProps(subjectsValuesPerStream);
    for (const durable of durables) {
      await verifyConsumer(jsm, durable);
    }
  }
};
