# DeHive Chat Subgraph

### Decentralized Indexing for Messaging, Payments, and Airdrops
*(The Graph Protocol + AssemblyScript + GraphQL)*

---

## Overview

The **DeHive Chat Subgraph** is a monorepo containing three specialized subgraphs that index events from the DeHive smart contract ecosystem. These subgraphs provide efficient, queryable access to messaging data, payment transactions, and airdrop campaigns on the Ethereum Sepolia testnet.

### Subgraph Modules

1. **dehive-messaging** - Indexes Message contract events for conversations and messages
2. **dehive-airdrop** - Indexes Airdrop system events for campaigns and claims
3. **dehive-payment** - Indexes PaymentHub events for payment transactions

### Key Features

- 🔍 **Event Indexing** - Real-time indexing of all contract events
- 📊 **GraphQL API** - Queryable data via The Graph Protocol
- 🔗 **Relationship Mapping** - Entity relationships for complex queries
- ⚡ **Efficient Queries** - Optimized for frontend applications
- 🔄 **Auto-Sync** - Automatic synchronization with blockchain state

---

## Architecture

### Monorepo Structure

```
dehive-chat-subgraph/
├── dehive-messaging/          # Message contract subgraph
│   ├── schema.graphql         # GraphQL schema
│   ├── subgraph.yaml          # Subgraph manifest
│   ├── src/
│   │   └── message.ts         # Event handlers
│   ├── abis/
│   │   ├── Message.json
│   │   └── PaymentHub.json
│   └── tests/
│       ├── message.test.ts
│       └── message-utils.ts
│
├── dehive-airdrop/            # Airdrop system subgraph
│   ├── schema.graphql         # GraphQL schema
│   ├── subgraph.yaml          # Subgraph manifest
│   ├── src/
│   │   ├── registry.ts        # Registry event handlers
│   │   ├── factory.ts          # Factory event handlers
│   │   └── campaign.ts         # Campaign event handlers
│   └── abis/
│       ├── ServerAirdropRegistry.json
│       ├── AirdropFactory.json
│       └── MerkleAirdrop.json
│
├── dehive-payment/            # PaymentHub subgraph
│   ├── schema.graphql         # GraphQL schema
│   ├── subgraph.yaml          # Subgraph manifest
│   ├── src/
│   │   └── payment.ts         # Payment event handlers
│   └── abis/
│       └── PaymentHub.json
│
├── contracts/                 # Shared contract ABIs
│   ├── Message.sol/
│   ├── PaymentHub.sol/
│   ├── AirdropFactory.sol/
│   ├── MerkleAirdrop.sol/
│   └── ServerAirdropRegistry.sol/
│
└── package.json               # Root package configuration
```

### Data Flow

```
Smart Contracts (Sepolia)
    │
    ├── Message Contract ──────┐
    │                          │
    ├── PaymentHub Contract ────┤
    │                          │
    └── Airdrop Contracts ──────┤
                               │
                               ▼
                    The Graph Network
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
            dehive-messaging  dehive-airdrop  dehive-payment
                    │          │          │
                    └──────────┼──────────┘
                               │
                               ▼
                    GraphQL API Endpoints
                               │
                               ▼
                    Frontend Applications
```

### Event Indexing Strategy

**dehive-messaging:**
- Indexes events from Message facet in DehiveProxy
- Tracks conversations, messages, fees, and deposits
- Uses proxy address for event source

**dehive-airdrop:**
- Uses dynamic data sources for factory and campaign indexing
- Registry creates factory templates
- Factories create campaign templates
- Hierarchical indexing structure

**dehive-payment:**
- Indexes PaymentSent events from PaymentHub facet
- Tracks all payment transactions
- Links payments to conversations

---

## Subgraph Modules

### 1. dehive-messaging

**Purpose:** Index Message contract events for conversations and messaging

**Indexed Events:**
- `ConversationCreated` - New conversation established
- `MessageSent` - Message sent in conversation
- `FundsDeposited` - User deposited credits
- `FeeCharged` - Fee deducted from user balance
- `RelayerSet` - Relayer address updated
- `PayAsYouGoFeeSet` - Pay-as-you-go fee updated
- `RelayerFeeSet` - Relayer fee updated

**Key Entities:**
- `ConversationCreated` - Conversation records
- `MessageSent` - Message records
- `FeeCharged` - Fee transaction records
- `FundsDeposited` - Deposit records

**Contract Configuration:**
- **Proxy Address**: `0x83Eb2fC1925522434C17C6a32eCE67f4620b73C8`
- **Network**: Sepolia
- **Start Block**: 9535551

**Documentation:** See [dehive-messaging/README.md](./dehive-messaging/README.md)

### 2. dehive-airdrop

**Purpose:** Index Airdrop system events for campaigns and claims

**Indexed Events:**
- `FactoryCreated` - Factory clone created for server
- `AirdropCampaignCreated` - New airdrop campaign created
- `Claimed` - Token claim in campaign

**Key Entities:**
- `Factory` - Factory instances per server
- `Campaign` - Airdrop campaign instances
- `Claim` - Individual user claims

**Architecture:**
- Root data source: `ServerAirdropRegistry`
- Dynamic template: `AirdropFactory` (created per factory)
- Dynamic template: `MerkleAirdrop` (created per campaign)

**Contract Configuration:**
- **Registry Address**: `0x387D6D818F0cafF8a98E9EFecB75694246cF8D92`
- **Network**: Sepolia
- **Start Block**: 9552434

**Documentation:** See [dehive-airdrop/README.md](./dehive-airdrop/README.md)

### 3. dehive-payment

**Purpose:** Index PaymentHub events for payment transactions

**Indexed Events:**
- `PaymentSent` - Payment transaction completed

**Key Entities:**
- `Payment` - Payment transaction records

**Contract Configuration:**
- **PaymentHub Address**: `0x83Eb2fC1925522434C17C6a32eCE67f4620b73C8` (same proxy as Message)
- **Network**: Sepolia
- **Start Block**: 9535551

**Documentation:** See [dehive-payment/README.md](./dehive-payment/README.md)

---

## Prerequisites

- **Node.js 18+** - Required for The Graph CLI
- **npm or yarn** - Package manager
- **Graph CLI** - `npm install -g @graphprotocol/graph-cli`
- **The Graph Studio Account** - For deployment

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Decode-Labs-Web3/dehive-chat-subgraph.git
   cd dehive-chat-subgraph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install subgraph dependencies**
   ```bash
   cd dehive-messaging && npm install && cd ..
   cd dehive-airdrop && npm install && cd ..
   cd dehive-payment && npm install && cd ..
   ```

4. **Authenticate with The Graph Studio**
   ```bash
   graph auth --studio <your-deployment-key>
   ```

---

## Development Workflow

### Code Generation

Generate TypeScript types from GraphQL schemas and ABIs:

```bash
# Generate for messaging subgraph
cd dehive-messaging
npm run codegen

# Generate for airdrop subgraph
cd ../dehive-airdrop
npm run codegen

# Generate for payment subgraph
cd ../dehive-payment
npm run codegen
```

### Building

Build the subgraph manifests:

```bash
# Build messaging subgraph
cd dehive-messaging
npm run build

# Build airdrop subgraph
cd ../dehive-airdrop
npm run build

# Build payment subgraph
cd ../dehive-payment
npm run build
```

### Testing

Run tests for subgraphs:

```bash
# Test messaging subgraph
cd dehive-messaging
npm test

# Test other subgraphs (if tests exist)
cd ../dehive-airdrop
npm test
```

### Deployment

Deploy to The Graph Studio:

```bash
# Deploy messaging subgraph
cd dehive-messaging
npm run deploy

# Deploy airdrop subgraph
cd ../dehive-airdrop
npm run deploy

# Deploy payment subgraph
cd ../dehive-payment
npm run deploy
```

### Local Development

For local development with Docker:

```bash
# Start local graph node (in dehive-messaging)
cd dehive-messaging
docker-compose up

# Create and deploy locally
npm run create-local
npm run deploy-local
```

---

## Querying Data

### GraphQL Endpoints

After deployment, each subgraph provides a GraphQL endpoint:

**The Graph Studio:**
- Messaging: `https://api.studio.thegraph.com/query/<subgraph-id>/dehive-messaging/<version>`
- Airdrop: `https://api.studio.thegraph.com/query/<subgraph-id>/dehive-airdrop/<version>`
- Payment: `https://api.studio.thegraph.com/query/<subgraph-id>/dehive-payment/<version>`

**The Graph Network (when published):**
- Messaging: `https://gateway.thegraph.com/api/<api-key>/subgraphs/id/<subgraph-id>`
- Airdrop: `https://gateway.thegraph.com/api/<api-key>/subgraphs/id/<subgraph-id>`
- Payment: `https://gateway.thegraph.com/api/<api-key>/subgraphs/id/<subgraph-id>`

### Example Queries

#### Messaging Subgraph

```graphql
# Get all conversations for a user
query GetUserConversations($user: Bytes!) {
  conversationCreateds(
    where: {
      or: [
        { smallerAddress: $user }
        { largerAddress: $user }
      ]
    }
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    conversationId
    smallerAddress
    largerAddress
    createdAt
  }
}

# Get messages in a conversation
query GetConversationMessages($conversationId: BigInt!) {
  messageSents(
    where: { conversationId: $conversationId }
    orderBy: blockTimestamp
    orderDirection: asc
  ) {
    id
    from
    to
    encryptedMessage
    blockTimestamp
  }
}
```

#### Airdrop Subgraph

```graphql
# Get all campaigns for a server
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

# Get user claims
query GetUserClaims($user: Bytes!) {
  claims(where: { user: $user }) {
    id
    campaign {
      id
      token
      metadataURI
    }
    amount
    blockTimestamp
  }
}
```

#### Payment Subgraph

```graphql
# Get payments by sender
query GetPaymentsBySender($sender: Bytes!) {
  payments(
    where: { sender: $sender }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    recipient
    token
    amount
    fee
    ipfsCid
    blockTimestamp
  }
}

# Get payments in a conversation
query GetConversationPayments($conversationId: BigInt!) {
  payments(
    where: { conversationId: $conversationId }
    orderBy: blockTimestamp
    orderDirection: asc
  ) {
    id
    sender
    recipient
    token
    amount
    fee
    ipfsCid
    blockTimestamp
  }
}
```

### Query Guides

For detailed query examples and patterns, see:
- **Messaging**: [dehive-messaging/QUERY_GUIDE.md](./dehive-messaging/QUERY_GUIDE.md)
- **Airdrop**: [dehive-airdrop/QUERY_GUIDE.md](./dehive-airdrop/QUERY_GUIDE.md)
- **Payment**: [dehive-payment/QUERY_GUIDE.md](./dehive-payment/QUERY_GUIDE.md)

---

## Contract Addresses

### Sepolia Testnet

**DehiveProxy (Message & PaymentHub):**
- Address: `0x83Eb2fC1925522434C17C6a32eCE67f4620b73C8`
- Start Block: `9535551`
- Network: Sepolia (Chain ID: 11155111)

**ServerAirdropRegistry:**
- Address: `0x387D6D818F0cafF8a98E9EFecB75694246cF8D92`
- Start Block: `9552434`
- Network: Sepolia (Chain ID: 11155111)

**AirdropFactory Implementation:**
- Address: `0xbB74D9DbDA62E8cc28DcC59a461F903D9E5246E0`
- Network: Sepolia

**MerkleAirdrop Implementation:**
- Address: `0x1910CaEF722E6811a8b293942DFfFb7c38c23b48`
- Network: Sepolia

---

## Project Structure Details

### Shared Contracts

The `contracts/` directory contains compiled contract artifacts used by all subgraphs:

- **Message.sol/** - Message contract ABI and artifacts
- **PaymentHub.sol/** - PaymentHub contract ABI and artifacts
- **AirdropFactory.sol/** - AirdropFactory contract ABI
- **MerkleAirdrop.sol/** - MerkleAirdrop contract ABI
- **ServerAirdropRegistry.sol/** - Registry contract ABI

### Configuration Files

Each subgraph has:
- `schema.graphql` - GraphQL schema definition
- `subgraph.yaml` - Subgraph manifest (data sources, templates, handlers)
- `networks.json` - Network configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

---

## Troubleshooting

### Common Issues

**1. Code Generation Failures**
```bash
# Clean and regenerate
cd <subgraph-directory>
rm -rf generated/
npm run codegen
```

**2. Build Failures**
```bash
# Check schema syntax
# Verify ABI files exist
# Ensure all imports are correct
```

**3. Deployment Failures**
```bash
# Verify authentication
graph auth --studio <deployment-key>

# Check network configuration
# Verify contract addresses
# Ensure start blocks are correct
```

**4. Query Issues**
```bash
# Check subgraph sync status in The Graph Studio
# Verify entity IDs are correct
# Check GraphQL query syntax
```

### Debugging Tips

1. **Check Subgraph Status**
   - Visit The Graph Studio dashboard
   - Check sync status and latest block
   - Review error logs

2. **Test Locally**
   - Use local graph node for testing
   - Verify event handlers work correctly
   - Test queries before deployment

3. **Validate Schema**
   - Ensure all entities are defined
   - Check field types match event parameters
   - Verify relationships are correct

---

## Development Best Practices

### Schema Design

- Use descriptive entity and field names
- Include all relevant event parameters
- Add relationships for complex queries
- Use appropriate scalar types

### Event Handlers

- Validate all event parameters
- Handle edge cases gracefully
- Use entity IDs consistently
- Emit clear error messages

### Testing

- Write unit tests for handlers
- Test with mock events
- Verify entity creation
- Test query patterns

### Performance

- Index only necessary fields
- Use efficient query patterns
- Avoid N+1 query problems
- Optimize entity relationships

---

## Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Code Style

- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep handlers focused and simple

---

## Resources

### Documentation

- **The Graph Documentation**: https://thegraph.com/docs/
- **AssemblyScript Guide**: https://www.assemblyscript.org/
- **GraphQL Documentation**: https://graphql.org/learn/

### Subgraph-Specific Docs

- [dehive-messaging/README.md](./dehive-messaging/README.md)
- [dehive-airdrop/README.md](./dehive-airdrop/README.md)
- [dehive-payment/README.md](./dehive-payment/README.md)

### Query Guides

- [dehive-messaging/QUERY_GUIDE.md](./dehive-messaging/QUERY_GUIDE.md)
- [dehive-airdrop/QUERY_GUIDE.md](./dehive-airdrop/QUERY_GUIDE.md)
- [dehive-payment/QUERY_GUIDE.md](./dehive-payment/QUERY_GUIDE.md)

---

## License

ISC

---

## Acknowledgments

- **The Graph Protocol** - Decentralized indexing infrastructure
- **OpenZeppelin** - Smart contract libraries
- **Ethereum Foundation** - Core protocol development
