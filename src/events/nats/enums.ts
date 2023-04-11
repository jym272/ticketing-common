// Modify manually generateApiSubjects if new streams are added
export enum Streams {
  TICKETS = 'tickets',
  ORDERS = 'orders',
  EXPIRATION = 'expiration',
  PAYMENTS = 'payments'
}

export enum OrderSubjects {
  OrderCreated = 'orders.created',
  OrderCancelled = 'orders.cancelled'
}
export enum TicketSubjects {
  TicketCreated = 'tickets.created',
  TicketUpdated = 'tickets.updated'
}
export enum PaymentSubjects {
  PaymentCreated = 'payments.created'
}

export enum ExpirationSubjects {
  ExpirationComplete = 'expiration.complete'
}

export type Subjects = TicketSubjects | OrderSubjects | ExpirationSubjects | PaymentSubjects;

export const subjects = {
  ...OrderSubjects,
  ...TicketSubjects,
  ...ExpirationSubjects,
  ...PaymentSubjects
};
