import {
  ConversationCreated as ConversationCreatedEvent,
  FeeCharged as FeeChargedEvent,
  FundsDeposited as FundsDepositedEvent,
  MessageSent as MessageSentEvent,
  PayAsYouGoFeeSet as PayAsYouGoFeeSetEvent,
  RelayerFeeSet as RelayerFeeSetEvent,
  RelayerSet as RelayerSetEvent,
} from "../generated/Message/Message";
import { PaymentSent as PaymentSentEvent } from "../generated/PaymentHub/PaymentHub";
import {
  ConversationCreated,
  FeeCharged,
  FundsDeposited,
  MessageSent,
  PayAsYouGoFeeSet,
  RelayerFeeSet,
  RelayerSet,
} from "../generated/schema";

export function handleConversationCreated(
  event: ConversationCreatedEvent
): void {
  let entity = new ConversationCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.conversationId = event.params.conversationId;
  entity.smallerAddress = event.params.smallerAddress;
  entity.largerAddress = event.params.largerAddress;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeeCharged(event: FeeChargedEvent): void {
  let entity = new FeeCharged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.amount = event.params.amount;
  entity.from = event.params.from;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFundsDeposited(event: FundsDepositedEvent): void {
  let entity = new FundsDeposited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.amount = event.params.amount;
  entity.from = event.params.from;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMessageSent(event: MessageSentEvent): void {
  let entity = new MessageSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.conversationId = event.params.conversationId;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.encryptedMessage = event.params.encryptedMessage;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePayAsYouGoFeeSet(event: PayAsYouGoFeeSetEvent): void {
  let entity = new PayAsYouGoFeeSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.amount = event.params.amount;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRelayerFeeSet(event: RelayerFeeSetEvent): void {
  let entity = new RelayerFeeSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.amount = event.params.amount;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRelayerSet(event: RelayerSetEvent): void {
  let entity = new RelayerSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.relayer = event.params.relayer;
  entity.createdAt = event.params.createdAt;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

/**
 * Handles the PaymentSent event from the PaymentHub contract.
 * Creates a MessageSent entity with payment://ipfs://{ipfsCid} format
 * so payment events appear in chat conversations.
 */
export function handlePaymentSent(event: PaymentSentEvent): void {
  // Create MessageSent entity for payment event
  let entity = new MessageSent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.conversationId = event.params.conversationId;
  entity.from = event.params.sender;
  entity.to = event.params.recipient;
  // Format: payment://ipfs://{ipfsCid} so frontend can detect and render payment UI
  entity.encryptedMessage = "payment://ipfs://" + event.params.ipfsCid;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
