// Modify manually generateApiSubjects if new streams are added
export enum Streams {
  TICKETS = 'tickets',
  ORDERS = 'orders',
  EXPIRATION = 'expiration',
  CHARGES = 'charges'
}

export enum OrderSubjects {
  OrderCreated = 'orders.created',
  OrderCancelled = 'orders.cancelled'
}
export enum TicketSubjects {
  TicketCreated = 'tickets.created',
  TicketUpdated = 'tickets.updated'
}
export enum ChargeSubjects {
  ChargeCreated = 'charges.created'
}

export enum ExpirationSubjects {
  ExpirationComplete = 'expiration.complete'
}

export type Subjects = TicketSubjects | OrderSubjects | ExpirationSubjects | ChargeSubjects;

export const subjects = {
  ...OrderSubjects,
  ...TicketSubjects,
  ...ExpirationSubjects,
  ...ChargeSubjects
};
