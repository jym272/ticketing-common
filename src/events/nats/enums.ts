export enum Streams {
  TICKETS = 'tickets',
  ORDERS = 'orders'
}

export enum OrderSubjects {
  OrderCreated = 'orders.created',
  OrderCancelled = 'orders.cancelled'
}
export enum TicketSubjects {
  TicketCreated = 'tickets.created',
  TicketUpdated = 'tickets.updated'
}

export const subjects = {
  ...OrderSubjects,
  ...TicketSubjects
};
