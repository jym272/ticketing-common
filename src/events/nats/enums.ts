// Modify manually generateApiSubjects if new streams are added
export enum Streams {
  TICKETS = 'tickets',
  ORDERS = 'orders',
  EXPIRATION = 'expiration'
}

export enum OrderSubjects {
  OrderCreated = 'orders.created',
  OrderCancelled = 'orders.cancelled'
}
export enum TicketSubjects {
  TicketCreated = 'tickets.created',
  TicketUpdated = 'tickets.updated'
}

export enum ExpirationSubjects {
  ExpirationComplete = 'expiration.complete'
}

export type Subjects = TicketSubjects | OrderSubjects | ExpirationSubjects;

export const subjects = {
  ...OrderSubjects,
  ...TicketSubjects,
  ...ExpirationSubjects
};
