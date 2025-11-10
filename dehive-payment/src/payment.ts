import { BigInt } from "@graphprotocol/graph-ts";
import { PaymentSent as PaymentSentEvent } from "../generated/PaymentHub/PaymentHub";
import { Payment } from "../generated/schema";

/**
 * Handles the PaymentSent event from the PaymentHub contract.
 * Creates a Payment entity to track user payment transactions.
 */
export function handlePaymentSent(event: PaymentSentEvent): void {
  // Create unique Payment ID: `${transactionHash}-${logIndex}`
  const paymentId = `${event.transaction.hash.toHexString()}-${event.logIndex.toString()}`;

  const payment = new Payment(paymentId);
  payment.conversationId = event.params.conversationId;
  payment.sender = event.params.sender;
  payment.recipient = event.params.recipient;
  payment.token = event.params.token;
  payment.amount = event.params.amount;
  payment.fee = event.params.fee;
  payment.ipfsCid = event.params.ipfsCid;
  payment.contentHash = event.params.contentHash;
  payment.mode = event.params.mode;
  payment.clientMsgId = event.params.clientMsgId;
  payment.timestamp = event.params.timestamp;
  payment.blockNumber = event.block.number;
  payment.blockTimestamp = event.block.timestamp;
  payment.transactionHash = event.transaction.hash;

  payment.save();
}
