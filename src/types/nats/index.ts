import { Streams, subjects } from '@events/nats';

export type SubjectsValues = (typeof subjects)[keyof typeof subjects];

export interface UniqueConsumerProps {
  durableName: string;
  queueGroupName: SubjectsValues;
  filterSubject: SubjectsValues;
}

export interface Options {
  streams: [Streams, ...Streams[]];
  nats: {
    url: string;
    maxReconnectAttempts?: number;
  };
}
