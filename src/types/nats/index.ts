import { Streams, subjects } from '@events/nats';

export type SubjectsValues = (typeof subjects)[keyof typeof subjects];

export interface UniqueConsumerProps {
  durableName: string;
  queueGroupName: string;
  filterSubject: SubjectsValues;
}

export interface Options {
  queueGroupName: string;
  streams: [Streams, ...Streams[]];
  nats: {
    url: string;
    maxReconnectAttempts?: number;
  };
}
