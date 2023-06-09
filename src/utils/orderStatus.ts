export enum OrderStatus {
  // When the order has been created, but the ticket it is trying to order has not been reserved
  Created = 'created',
  // The ticket the order is trying to reserve has already been reserved, or when the user has cancelled the order
  // The order expires before payment TODO: it can be three different statuses
  Cancelled = 'cancelled',
  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',
  // The order has reserved the ticket and the user has provided payment successfully
  Complete = 'complete'
}

export const getRandomOrderStatus = () => {
  const values = Object.values(OrderStatus);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as OrderStatus;
};
