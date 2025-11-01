import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { ConversationCreated } from "../generated/schema"
import { ConversationCreated as ConversationCreatedEvent } from "../generated/Message/Message"
import { handleConversationCreated } from "../src/message"
import { createConversationCreatedEvent } from "./message-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let conversationId = BigInt.fromI32(234)
    let smallerAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let largerAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let createdAt = BigInt.fromI32(234)
    let newConversationCreatedEvent = createConversationCreatedEvent(
      conversationId,
      smallerAddress,
      largerAddress,
      createdAt
    )
    handleConversationCreated(newConversationCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ConversationCreated created and stored", () => {
    assert.entityCount("ConversationCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ConversationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "conversationId",
      "234"
    )
    assert.fieldEquals(
      "ConversationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "smallerAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ConversationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "largerAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ConversationCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "createdAt",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
