# Dehive Payment Subgraph

This subgraph indexes the Dehive PaymentHub contract on Sepolia testnet. It tracks all payment transactions, allowing users to view their payment history including:
- Who they sent money to
- Payment amounts
- Payment messages/notes (stored as IPFS CIDs)
- Transaction timestamps
- Payment modes (ERC20, Native, etc.)

## Architecture

The subgraph indexes:
- **PaymentHub** (root data source) - Indexes `PaymentSent` events

## Setup

1. Install dependencies:
```bash
cd dehive-payment
npm install
```

2. Update contract address and start block in `subgraph.yaml` and `networks.json`:
   - Replace `0x0000000000000000000000000000000000000000` with the actual PaymentHub address
   - Replace `startBlock: 0` with the actual deployment block

3. Authenticate with The Graph Studio:
```bash
graph auth deb1def8039f8ccb94bd8e5365e23024
```

4. Generate code from the schema:
```bash
npm run codegen
```

5. Build the subgraph:
```bash
npm run build
```

6. Deploy to The Graph Studio:
```bash
npm run deploy
```

## Entities

### Payment
Tracks individual payment transactions.
- `id`: Unique payment ID (`${transactionHash}-${logIndex}`)
- `conversationId`: Conversation ID for the payment
- `sender`: Address that sent the payment
- `recipient`: Address that received the payment
- `token`: Token address (0x0 for native ETH)
- `amount`: Payment amount
- `fee`: Transaction fee charged
- `ipfsCid`: IPFS CID for payment message/note
- `contentHash`: Content hash for verification
- `mode`: Payment mode (0 = ERC20, 1 = Native, etc.)
- `clientMsgId`: Client-side message ID
- `timestamp`: Event timestamp
- `blockNumber`: Block number of transaction
- `blockTimestamp`: Block timestamp
- `transactionHash`: Transaction hash

## Example GraphQL Query

### Get All Payments by Sender

```graphql
query GetPaymentsBySender($sender: Bytes!) {
  payments(
    where: { sender: $sender }
    orderBy: blockTimestamp
    orderDirection: desc
    first: 10
    skip: 0
  ) {
    id
    conversationId
    recipient
    token
    amount
    fee
    ipfsCid
    mode
    clientMsgId
    timestamp
    blockTimestamp
    transactionHash
  }
}
```

### Get All Payments by Recipient

```graphql
query GetPaymentsByRecipient($recipient: Bytes!) {
  payments(
    where: { recipient: $recipient }
    orderBy: blockTimestamp
    orderDirection: desc
    first: 10
    skip: 0
  ) {
    id
    conversationId
    sender
    token
    amount
    fee
    ipfsCid
    mode
    clientMsgId
    timestamp
    blockTimestamp
    transactionHash
  }
}
```

### Get Payments in a Conversation

```graphql
query GetPaymentsByConversation($conversationId: BigInt!) {
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
    mode
    clientMsgId
    timestamp
    blockTimestamp
    transactionHash
  }
}
```

## Contract Addresses (Sepolia)

- **PaymentHub**: `0x83Eb2fC1925522434C17C6a32eCE67f4620b73C8` (same proxy address as Message)

## Start Block

The PaymentHub contract uses the same proxy as Message, so it uses the same start block: **9535551**.
