# Dehive Payment Subgraph - Query Guide

## Endpoint

```
https://api.studio.thegraph.com/query/1713799/dehive-payment/version/latest
```

## Authentication

Include the authorization header:
```
Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2
```

## Query Examples

### 1. Get All Payments Sent by a User (Outgoing Payments)

This query fetches all payments sent by a specific user, ordered by most recent first.

```graphql
query GetOutgoingPayments($sender: Bytes!, $first: Int!, $skip: Int!) {
  payments(
    where: { sender: $sender }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
  ) {
    id
    conversationId
    recipient
    token
    amount
    fee
    ipfsCid
    contentHash
    mode
    clientMsgId
    timestamp
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

**JavaScript Example:**
```typescript
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/1713799/dehive-payment/version/latest';

async function getOutgoingPayments(
  senderAddress: string,
  first = 10,
  skip = 0
) {
  const query = `
    query GetOutgoingPayments($sender: Bytes!, $first: Int!, $skip: Int!) {
      payments(
        where: { sender: $sender }
        orderBy: blockTimestamp
        orderDirection: desc
        first: $first
        skip: $skip
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
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 112c016bdd600a7de3fa8e9379471bf2',
    },
    body: JSON.stringify({
      query,
      variables: { sender: senderAddress, first, skip },
      operationName: 'GetOutgoingPayments',
    }),
  });

  const { data } = await response.json();
  return data.payments;
}
```

### 2. Get All Payments Received by a User (Incoming Payments)

This query fetches all payments received by a specific user.

```graphql
query GetIncomingPayments($recipient: Bytes!, $first: Int!, $skip: Int!) {
  payments(
    where: { recipient: $recipient }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
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

### 3. Get All Payments in a Conversation

This query fetches all payments within a specific conversation.

```graphql
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
    mode
    clientMsgId
    timestamp
    blockTimestamp
    transactionHash
  }
}
```

### 4. Get User's Complete Payment History (Both Sent and Received)

This query fetches all payments where the user is either sender or recipient.

```graphql
query GetUserPaymentHistory($user: Bytes!, $first: Int!, $skip: Int!) {
  sent: payments(
    where: { sender: $user }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
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
  received: payments(
    where: { recipient: $user }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
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

### 5. Get Payments by Token

This query fetches all payments for a specific token.

```graphql
query GetPaymentsByToken($token: Bytes!, $first: Int!, $skip: Int!) {
  payments(
    where: { token: $token }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
  ) {
    id
    conversationId
    sender
    recipient
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

### 6. Get Payments Between Two Users

This query fetches all payments between two specific users.

```graphql
query GetPaymentsBetweenUsers($user1: Bytes!, $user2: Bytes!, $first: Int!, $skip: Int!) {
  payments(
    where: {
      or: [
        { sender: $user1, recipient: $user2 }
        { sender: $user2, recipient: $user1 }
      ]
    }
    orderBy: blockTimestamp
    orderDirection: desc
    first: $first
    skip: $skip
  ) {
    id
    conversationId
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

## cURL Examples

### Get Outgoing Payments

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2" \
  -d '{
    "query": "query GetOutgoingPayments($sender: Bytes!, $first: Int!, $skip: Int!) { payments(where: { sender: $sender } orderBy: blockTimestamp orderDirection: desc first: $first skip: $skip) { id conversationId recipient token amount fee ipfsCid mode clientMsgId timestamp blockTimestamp transactionHash } }",
    "variables": {
      "sender": "0x...",
      "first": 10,
      "skip": 0
    },
    "operationName": "GetOutgoingPayments"
  }' \
  https://api.studio.thegraph.com/query/1713799/dehive-payment/version/latest
```

## Notes

- ⚠️ **Important**: Replace `0x...` with actual user addresses
- `token` field: Use `0x0000000000000000000000000000000000000000` for native ETH payments
- `ipfsCid`: Contains the IPFS CID where the payment message/note is stored
- `mode`: Payment mode (0 = ERC20, 1 = Native ETH, etc.)
- Use `orderBy` and `orderDirection` to sort payments by timestamp
- Use `first` and `skip` for pagination
- `BigInt` fields are returned as strings
- All `Bytes` fields (addresses, hashes) are returned as hex strings
