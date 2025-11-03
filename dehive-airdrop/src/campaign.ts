import { Claimed as ClaimedEvent } from "../generated/templates/MerkleAirdrop/MerkleAirdrop";
import { Campaign, Claim } from "../generated/schema";

/**
 * Handles the Claimed event from a MerkleAirdrop campaign contract.
 * Creates a Claim entity and updates the campaign's claimed amount.
 */
export function handleClaimed(event: ClaimedEvent): void {
  // Get the campaign address from the event's address (the contract that emitted the event)
  const campaignAddress = event.address.toHexString();

  // Load the Campaign entity
  const campaign = Campaign.load(campaignAddress);
  if (!campaign) {
    // Campaign should exist, but handle edge case
    return;
  }

  // Create Claim entity ID: `${campaign.address}-${index}`
  const claimId = `${campaignAddress}-${event.params.index.toString()}`;
  const claim = new Claim(claimId);
  claim.campaign = campaign.id;
  claim.user = event.params.account;
  claim.index = event.params.index;
  claim.amount = event.params.amount;
  claim.blockNumber = event.block.number;
  claim.blockTimestamp = event.block.timestamp;
  claim.transactionHash = event.transaction.hash;
  claim.save();

  // Update campaign's claimed amount
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.save();
}
