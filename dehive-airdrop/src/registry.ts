import { Address } from "@graphprotocol/graph-ts";
import {
  FactoryCreated as FactoryCreatedEvent,
  ServerAirdropRegistry,
} from "../generated/ServerAirdropRegistry/ServerAirdropRegistry";
import { Factory } from "../generated/schema";
import { AirdropFactory as AirdropFactoryTemplate } from "../generated/templates";

/**
 * Handles the FactoryCreated event from the ServerAirdropRegistry contract.
 * Creates a Factory entity and spawns a dynamic data source template for the factory.
 */
export function handleFactoryCreated(event: FactoryCreatedEvent): void {
  // Create Factory entity
  const factory = new Factory(event.params.factory.toHexString());

  // Get the actual serverId string from the contract since indexed strings are hashed in events
  const registry = ServerAirdropRegistry.bind(event.address);
  const serverIdResult = registry.try_getServerIdByFactory(
    event.params.factory
  );
  if (!serverIdResult.reverted) {
    factory.serverId = serverIdResult.value;
  } else {
    // Fallback: try to decode from bytes (though this won't work for indexed strings)
    factory.serverId = event.params.serverId.toString();
  }

  factory.owner = event.params.owner;
  factory.creator = event.params.creator;
  factory.createdAt = event.params.timestamp;
  factory.blockNumber = event.params.blockNumber;
  factory.save();

  // Create a dynamic data source for this factory
  // This will start indexing events from this factory contract
  AirdropFactoryTemplate.create(event.params.factory);
}
