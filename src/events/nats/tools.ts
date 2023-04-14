import { SubjectsValues } from '@custom-types/nats';
import { ExpirationSubjects, nc, OrderSubjects, PaymentSubjects, Streams, TicketSubjects } from '@events/index';
import { StringCodec } from 'nats';
import { colorObject, log } from '@utils/logs';

export const getDurableName = (subject: SubjectsValues, queueGroupName: string) => {
  const parts = subject.split('.');
  if (!parts.length) {
    throw new Error('Subject is empty');
  }
  parts.push(queueGroupName);
  const upperCaseParts = parts.map(part => part.toUpperCase());
  return upperCaseParts.join('_');
};

export const monitorNatsConnectionStatus = async () => {
  if (!nc) {
    throw new Error('Nats connection not found');
  }
  for await (const status of nc.status()) {
    // logs with chalk TODO with color according to type
    log('nats status: ', { data: status.data, type: status.type });
  }
};

export const generateApiSubjects = (...stream: [Streams, ...Streams[]]) => {
  const apiSubjects: SubjectsValues[][] = [];
  stream.forEach(str => {
    switch (str) {
      case Streams.ORDERS:
        apiSubjects.push(Object.values(OrderSubjects));
        break;
      case Streams.TICKETS:
        apiSubjects.push(Object.values(TicketSubjects));
        break;
      case Streams.EXPIRATION:
        apiSubjects.push(Object.values(ExpirationSubjects));
        break;
      case Streams.PAYMENTS:
        apiSubjects.push(Object.values(PaymentSubjects));
        break;
      default:
        throw new Error('Stream not found');
    }
  });
  return apiSubjects;
};

const enumValuesToArr = <T extends string>(e: Record<T, string>): string[] => {
  return Object.values(e);
};

export const extractStreamName = (subject: SubjectsValues) => {
  const parts = subject.split('.');
  if (!parts.length) {
    throw new Error('Subject is empty');
  }
  const stream = parts[0];
  if (!enumValuesToArr(Streams).includes(stream)) {
    throw new Error(`Stream name ${stream} is not valid`);
  }
  return stream as Streams;
};

export const sc = StringCodec();

export const logMessage = (data: Uint8Array) => {
  const msgString = sc.decode(data);
  const msg = JSON.parse(msgString) as Record<string, unknown>;
  return colorObject(msg);
};
