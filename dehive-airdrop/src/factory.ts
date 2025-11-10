import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  AirdropCampaignCreated as AirdropCampaignCreatedEvent,
  AirdropFactory,
} from "../generated/templates/AirdropFactory/AirdropFactory";
import { Factory, Campaign } from "../generated/schema";
import { MerkleAirdrop as MerkleAirdropTemplate } from "../generated/templates";

/**
 * Handles the AirdropCampaignCreated event from an AirdropFactory contract.
 * Creates a Campaign entity and spawns a dynamic data source template for the campaign.
 */
export function handleAirdropCampaignCreated(
  event: AirdropCampaignCreatedEvent
): void {
  // Load the Factory entity
  // event.address is the factory contract that emitted this event
  const factory = Factory.load(event.address.toHexString());
  if (!factory) {
    // Factory should exist, but handle edge case
    return;
  }

  // Create Campaign entity
  const campaign = new Campaign(event.params.campaign.toHexString());
  campaign.factory = factory.id;

  // Get the actual serverId string from the factory contract
  // Since serverId is indexed in the event, we need to query the contract
  const factoryContract = AirdropFactory.bind(event.address);
  const serverIdResult = factoryContract.try_getServerId();
  if (!serverIdResult.reverted) {
    campaign.serverId = serverIdResult.value;
  } else {
    // Fallback: use the serverId from the factory entity
    campaign.serverId = factory.serverId;
  }

  campaign.creator = event.params.creator;
  campaign.token = event.params.token;
  campaign.merkleRoot = event.params.merkleRoot;
  campaign.metadataURI = event.params.metadataURI;
  campaign.totalAmount = event.params.totalAmount;
  campaign.claimedAmount = BigInt.zero(); // Initialize claimed amount to 0
  campaign.createdAt = event.params.timestamp;
  campaign.blockNumber = event.params.blockNumber;
  campaign.save();

  // Create a dynamic data source for this campaign
  // This will start indexing events from this campaign contract
  MerkleAirdropTemplate.create(event.params.campaign);
}
