import { OrderSubjects, Streams, subjects, TicketSubjects } from '@events/nats';

// Dependencia de subject media faalopa podria fallar
export type SubjectsValues = (typeof subjects)[keyof typeof subjects];
//streams are derivated from subjects values and validated there
export type SubjectsKeys = keyof typeof subjects;
export type Subjects = TicketSubjects | OrderSubjects;
// type SubjectsArr = OrderSubjects[] | TicketSubjects[];

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
