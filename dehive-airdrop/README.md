# Dehive Airdrop Subgraph

This subgraph indexes the Dehive Airdrop system on Sepolia testnet. It tracks:
- **Registry**: Creates factories for each server
- **Factories**: Creates campaigns for airdrops
- **Campaigns**: Tracks individual airdrop campaigns and claims

## Architecture

The subgraph uses dynamic data sources to index:
1. **ServerAirdropRegistry** (root data source) - Indexes `FactoryCreated` events
2. **AirdropFactory** (dynamic template) - Indexes `AirdropCampaignCreated` events
3. **MerkleAirdrop** (dynamic template) - Indexes `Claimed` events

## Setup

1. Install dependencies:
```bash
cd dehive-airdrop
npm install
```

2. Authenticate with The Graph Studio:
```bash
graph auth deb1def8039f8ccb94bd8e5365e23024
```

3. Generate code from the schema:
```bash
npm run codegen
```

4. Build the subgraph:
```bash
npm run build
```

5. Deploy to The Graph Studio:
```bash
npm run deploy
```

## Entities

### Factory
Tracks factory instances created per server.
- `id`: Factory contract address
- `serverId`: Discord server ID
- `owner`: Factory owner address
- `creator`: Address that created the factory
- `createdAt`: Timestamp of creation
- `campaigns`: List of campaigns created by this factory

### Campaign
Tracks airdrop campaign instances.
- `id`: Campaign contract address
- `factory`: Reference to the factory that created it
- `serverId`: Discord server ID
- `creator`: Campaign creator address
- `token`: ERC20 token address for rewards
- `merkleRoot`: Merkle tree root for eligibility
- `metadataURI`: IPFS/Arweave URI for campaign metadata
- `totalAmount`: Total token amount allocated
- `claimedAmount`: Total amount claimed so far
- `createdAt`: Timestamp of creation
- `claims`: List of claims made in this campaign

### Claim
Tracks individual user claims.
- `id`: Unique claim ID (`${campaign.address}-${index}`)
- `campaign`: Reference to the campaign
- `user`: User address that claimed
- `index`: Merkle proof index
- `amount`: Claimed token amount
- `blockNumber`: Block number of claim
- `blockTimestamp`: Timestamp of claim
- `transactionHash`: Transaction hash

## Example GraphQL Query

```graphql
query GetServerCampaigns($serverId: String!) {
  factories(where: { serverId: $serverId }) {
    id
    serverId
    campaigns {
      id
      token
      totalAmount
      claimedAmount
      metadataURI
      claims {
        user
        amount
        blockTimestamp
      }
    }
  }
}
```

**Note**: The `serverId` is now stored as a `String` by querying the contract directly, since indexed strings in events are stored as hashes. The handlers fetch the actual string value from the contract using `getServerId()` and `getServerIdByFactory()` functions.

## Contract Addresses (Sepolia)

- **Registry**: `0x387D6D818F0cafF8a98E9EFecB75694246cF8D92`
- **Factory Implementation**: `0xbB74D9DbDA62E8cc28DcC59a461F903D9E5246E0`
- **MerkleAirdrop Implementation**: `0x1910CaEF722E6811a8b293942DFfFb7c38c23b48`

## Start Block

The Registry contract was deployed at block **9552434** on Sepolia.
