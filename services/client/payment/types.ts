export type VerifyPaymentRequest = {
  orderId: string;
  paymentId: string;
  signature: string;
};
