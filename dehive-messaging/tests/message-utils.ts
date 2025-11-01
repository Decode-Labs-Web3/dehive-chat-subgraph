import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ConversationCreated,
  FeeCharged,
  FundsDeposited,
  MessageSent,
  PayAsYouGoFeeSet,
  RelayerFeeSet,
  RelayerSet
} from "../generated/Message/Message"

export function createConversationCreatedEvent(
  conversationId: BigInt,
  smallerAddress: Address,
  largerAddress: Address,
  createdAt: BigInt
): ConversationCreated {
  let conversationCreatedEvent = changetype<ConversationCreated>(newMockEvent())

  conversationCreatedEvent.parameters = new Array()

  conversationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "conversationId",
      ethereum.Value.fromUnsignedBigInt(conversationId)
    )
  )
  conversationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "smallerAddress",
      ethereum.Value.fromAddress(smallerAddress)
    )
  )
  conversationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "largerAddress",
      ethereum.Value.fromAddress(largerAddress)
    )
  )
  conversationCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return conversationCreatedEvent
}

export function createFeeChargedEvent(
  amount: BigInt,
  from: Address,
  createdAt: BigInt
): FeeCharged {
  let feeChargedEvent = changetype<FeeCharged>(newMockEvent())

  feeChargedEvent.parameters = new Array()

  feeChargedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  feeChargedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  feeChargedEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return feeChargedEvent
}

export function createFundsDepositedEvent(
  amount: BigInt,
  from: Address,
  createdAt: BigInt
): FundsDeposited {
  let fundsDepositedEvent = changetype<FundsDeposited>(newMockEvent())

  fundsDepositedEvent.parameters = new Array()

  fundsDepositedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsDepositedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  fundsDepositedEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return fundsDepositedEvent
}

export function createMessageSentEvent(
  conversationId: BigInt,
  from: Address,
  to: Address,
  encryptedMessage: string
): MessageSent {
  let messageSentEvent = changetype<MessageSent>(newMockEvent())

  messageSentEvent.parameters = new Array()

  messageSentEvent.parameters.push(
    new ethereum.EventParam(
      "conversationId",
      ethereum.Value.fromUnsignedBigInt(conversationId)
    )
  )
  messageSentEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  messageSentEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  messageSentEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedMessage",
      ethereum.Value.fromString(encryptedMessage)
    )
  )

  return messageSentEvent
}

export function createPayAsYouGoFeeSetEvent(
  amount: BigInt,
  createdAt: BigInt
): PayAsYouGoFeeSet {
  let payAsYouGoFeeSetEvent = changetype<PayAsYouGoFeeSet>(newMockEvent())

  payAsYouGoFeeSetEvent.parameters = new Array()

  payAsYouGoFeeSetEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  payAsYouGoFeeSetEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return payAsYouGoFeeSetEvent
}

export function createRelayerFeeSetEvent(
  amount: BigInt,
  createdAt: BigInt
): RelayerFeeSet {
  let relayerFeeSetEvent = changetype<RelayerFeeSet>(newMockEvent())

  relayerFeeSetEvent.parameters = new Array()

  relayerFeeSetEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  relayerFeeSetEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return relayerFeeSetEvent
}

export function createRelayerSetEvent(
  relayer: Address,
  createdAt: BigInt
): RelayerSet {
  let relayerSetEvent = changetype<RelayerSet>(newMockEvent())

  relayerSetEvent.parameters = new Array()

  relayerSetEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )
  relayerSetEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )

  return relayerSetEvent
}
