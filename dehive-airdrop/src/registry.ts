import { Address } from "@graphprotocol/graph-ts";
import { FactoryCreated as FactoryCreatedEvent } from "../generated/ServerAirdropRegistry/ServerAirdropRegistry";
import { Factory } from "../generated/schema";
import { AirdropFactory as AirdropFactoryTemplate } from "../generated/templates";

/**
 * Handles the FactoryCreated event from the ServerAirdropRegistry contract.
 * Creates a Factory entity and spawns a dynamic data source template for the factory.
 */
export function handleFactoryCreated(event: FactoryCreatedEvent): void {
  // Create Factory entity
  const factory = new Factory(event.params.factory.toHexString());
  // serverId is indexed string in Solidity, which means it's stored as bytes32 hash
  // We cannot retrieve the original string from indexed event parameters
  // Store the hash as Bytes - to query by serverId, hash the string first
  factory.serverId = event.params.serverId;
  factory.owner = event.params.owner;
  factory.creator = event.params.creator;
  factory.createdAt = event.params.timestamp;
  factory.blockNumber = event.params.blockNumber;
  factory.save();

  // Create a dynamic data source for this factory
  // This will start indexing events from this factory contract
  AirdropFactoryTemplate.create(event.params.factory);
}
