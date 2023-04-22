import { AckPolicy, createInbox, DeliverPolicy, JetStreamManager, nanos } from 'nats';
import { apiSubjects, extractStreamName, getDurableName, Streams } from '@events/nats';
import { SubjectsValues, UniqueConsumerProps } from '@custom-types/nats';
import { log } from '@utils/logs';
import chalk from 'chalk';

const createConsumerProps = (values: SubjectsValues[], queueGroupName: string) =>
  values.map(subjectValue => {
    return {
      durableName: getDurableName(subjectValue, queueGroupName),
      queueGroupName,
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

const verifyConsumer = async (jsm: JetStreamManager, uniqueConsumer: UniqueConsumerProps) => {
  const { durableName, queueGroupName, filterSubject } = uniqueConsumer;

  const stream = extractStreamName(filterSubject);

  if (!(await findConsumer(jsm, durableName, stream))) {
    log(
      chalk`{bold.yellow notFound}\t{gray [}{cyan consumer=${durableName}}{gray ]}\t{gray [}{magenta stream=${stream}}{gray ]}`
    );
    await jsm.consumers.add(stream, {
      durable_name: durableName,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      deliver_subject: createInbox(),
      deliver_group: queueGroupName,
      filter_subject: filterSubject,
      ack_wait: nanos(10 * 1000)
    });
    log(
      chalk`{bold.green created}\t{gray [}{cyan consumer=${durableName}}{gray ]}\t{gray [}{magenta stream=${stream}}{gray ]}`
    );
    return;
  }
};

export const verifyConsumers = async (jsm: JetStreamManager, queueGroupName: string) => {
  if (!apiSubjects.length) {
    throw new Error('No subjects found');
  }
  for (const subjectsValuesPerStream of apiSubjects) {
    const durables = createConsumerProps(subjectsValuesPerStream, queueGroupName);
    for (const durable of durables) {
      await verifyConsumer(jsm, durable);
    }
  }
};
