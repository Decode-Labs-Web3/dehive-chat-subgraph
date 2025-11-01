# DeHive Messaging Subgraph

Subgraph for indexing events from the Message contract deployed via DehiveProxy (Diamond pattern) on Sepolia network.

## Contract Configuration

- **Proxy Address**: `0x41BC86bA44813b2B106E1942CB68cc471714df2D`
- **Network**: Sepolia
- **Start Block**: 9535551 (proxy deployment block)
- **Facet Address**: `0xEd0E195310A1419c309935DCe97fCA507d82DE11`

## Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Graph CLI (`@graphprotocol/graph-cli`)

### Installation

```bash
npm install
# or
yarn install
```

### Authentication

Set up authentication with The Graph Studio before deploying:

```bash
# Or use your own deployment key
graph auth <your-deployment-key>
```

**Note**: With graph-cli v0.98.1, the `graph auth` command only requires the deploy key. It automatically sets the key for The Graph Studio endpoint (`https://api.studio.thegraph.com/deploy/`).

### Code Generation

Generate TypeScript types from the schema and ABI:

```bash
# From dehive-messaging/ directory:
npm run codegen
# or
yarn codegen

# From root directory:
npm run codegen
```

### Build

Build the subgraph:

```bash
# From dehive-messaging/ directory:
npm run build
# or
yarn build

# From root directory:
npm run build
```

## Deployment

### Deploy to The Graph Studio

**Important**: Make sure you're in the `dehive-messaging/` directory or use the scripts from the root directory.

```bash
# From dehive-messaging/ directory:
npm run deploy
# or
yarn deploy

# From root directory:
npm run deploy
# or
npm run deploy:studio
```

### Deploy to Local Graph Node

First, start the local graph node (see `docker-compose.yml`):

```bash
docker-compose up
```

Then create and deploy:

```bash
npm run create-local
npm run deploy-local
# or
yarn create-local
yarn deploy-local
```

## Testing

Run tests:

```bash
npm test
# or
yarn test
```

## Proxy Pattern Notes

This subgraph indexes events from a Diamond proxy pattern:

- Events are emitted from the proxy address (`0x41BC86bA44813b2B106E1942CB68cc471714df2D`)
- Events use the Message contract ABI for decoding
- The proxy delegates calls to the Message facet, but events come from the proxy address
- All 7 events are indexed:
  - `ConversationCreated`
  - `FeeCharged`
  - `FundsDeposited`
  - `MessageSent`
  - `PayAsYouGoFeeSet`
  - `RelayerFeeSet`
  - `RelayerSet`

## Schema

The schema defines immutable entities for each event type, storing all event parameters along with block number, timestamp, and transaction hash for querying.

## Development

- Schema: `schema.graphql`
- Event Handlers: `src/message.ts`
- Configuration: `subgraph.yaml`
- ABI: `abis/Message.json`
