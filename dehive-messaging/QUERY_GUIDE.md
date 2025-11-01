# Query Guide: Message Contract On-Chain Queries

This guide shows how to query messages and conversations from the Message contract deployed via DehiveProxy.

## Contract Information

- **Proxy Address (Sepolia)**: `0x41BC86bA44813b2B106E1942CB68cc471714df2D`
- **Network**: Sepolia
- **ABI**: Available in `abis/Message.json`

## Query Methods

### Method 1: Direct Contract Calls (ethers.js)

Direct contract calls are best for:
- Real-time state queries
- Single conversation lookups
- User balance checks

#### Setup

```typescript
import { ethers } from 'ethers';
import MessageABI from './abis/Message.json';

const RPC_URL = 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';
const MESSAGE_PROXY_ADDRESS = '0x41BC86bA44813b2B106E1942CB68cc471714df2D';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const messageContract = new ethers.Contract(
  MESSAGE_PROXY_ADDRESS,
  MessageABI,
  provider
);
```

#### Query Functions

##### 1. Get Conversation Details

```typescript
async function getConversation(conversationId: bigint) {
  const conversation = await messageContract.conversations(conversationId);

  return {
    smallerAddress: conversation[0],
    largerAddress: conversation[1],
    encryptedConversationKeyForSmallerAddress: conversation[2],
    encryptedConversationKeyForLargerAddress: conversation[3],
    createdAt: conversation[4]
  };
}

// Usage
const convId = BigInt('123456789');
const conversation = await getConversation(convId);
console.log('Conversation participants:', conversation.smallerAddress, conversation.largerAddress);
```

##### 2. Get User Balance

```typescript
async function getUserBalance(userAddress: string) {
  const balance = await messageContract.funds(userAddress);
  return ethers.formatEther(balance); // Returns balance in ETH
}

// Usage
const userAddress = '0x...';
const balance = await getUserBalance(userAddress);
console.log('User balance:', balance, 'ETH');
```

##### 3. Get User's Encrypted Conversation Key

```typescript
// Note: This requires a signer (needs to be called by the user)
async function getMyEncryptedKey(conversationId: bigint, signer: ethers.Signer) {
  const contractWithSigner = messageContract.connect(signer);
  const encryptedKey = await contractWithSigner.getMyEncryptedConversationKeys(conversationId);
  return encryptedKey;
}
```

##### 4. Get Fee Information

```typescript
async function getFeeInfo() {
  const [payAsYouGoFee, relayerFee, relayer] = await Promise.all([
    messageContract.payAsYouGoFee(),
    messageContract.relayerFee(),
    messageContract.relayer()
  ]);

  return {
    payAsYouGoFee: ethers.formatEther(payAsYouGoFee),
    relayerFee: ethers.formatEther(relayerFee),
    relayer: relayer
  };
}

// Usage
const fees = await getFeeInfo();
console.log('Pay-as-you-go fee:', fees.payAsYouGoFee);
console.log('Relayer fee:', fees.relayerFee);
console.log('Relayer address:', fees.relayer);
```

##### 5. Query MessageSent Events

```typescript
async function getMessageEvents(conversationId?: bigint, fromBlock?: number) {
  const filter = messageContract.filters.MessageSent(
    conversationId || null, // indexed uint256
    null, // indexed address (from)
    null  // indexed address (to)
  );

  const events = await messageContract.queryFilter(
    filter,
    fromBlock || 9535551 // Start from proxy deployment block
  );

  return events.map(event => ({
    conversationId: event.args[0].toString(),
    from: event.args[1],
    to: event.args[2],
    encryptedMessage: event.args[3],
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash
  }));
}

// Usage - Get all messages
const allMessages = await getMessageEvents();

// Usage - Get messages for specific conversation
const convId = BigInt('123456789');
const conversationMessages = await getMessageEvents(convId);
```

##### 6. Query ConversationCreated Events

```typescript
async function getConversationCreatedEvents(fromBlock?: number) {
  const filter = messageContract.filters.ConversationCreated();

  const events = await messageContract.queryFilter(
    filter,
    fromBlock || 9535551
  );

  return events.map(event => ({
    conversationId: event.args[0].toString(),
    smallerAddress: event.args[1],
    largerAddress: event.args[2],
    createdAt: event.args[3].toString(),
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash
  }));
}

// Usage
const conversations = await getConversationCreatedEvents();
console.log('Total conversations:', conversations.length);
```

### Method 2: GraphQL Subgraph Queries

The subgraph is best for:
- Historical queries
- Filtering and pagination
- Aggregating data
- Complex queries across multiple events

#### Subgraph Endpoint

After deployment, you'll have a GraphQL endpoint like:
```
https://api.studio.thegraph.com/query/<subgraph-id>/dehive-messaging/<version>
```

#### Example Queries

##### 1. Query All Messages

```graphql
query GetMessages($first: Int, $skip: Int) {
  messageSents(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    from
    to
    encryptedMessage
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

**JavaScript Example:**
```typescript
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/<id>/dehive-messaging/<version>';

async function queryMessages(first = 10, skip = 0) {
  const query = `
    query GetMessages($first: Int!, $skip: Int!) {
      messageSents(
        first: $first
        skip: $skip
        orderBy: blockTimestamp
        orderDirection: desc
      ) {
        id
        conversationId
        from
        to
        encryptedMessage
        blockNumber
        blockTimestamp
        transactionHash
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { first, skip }
    })
  });

  const { data } = await response.json();
  return data.messageSents;
}
```

##### 2. Query Messages by Conversation

```graphql
query GetMessagesByConversation($conversationId: BigInt!) {
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
    transactionHash
  }
}
```

##### 3. Query Messages by User (Sender or Receiver)

```graphql
query GetUserMessages($userAddress: Bytes!, $first: Int!) {
  sentAsSender: messageSents(
    where: { from: $userAddress }
    first: $first
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    to
    encryptedMessage
    blockTimestamp
  }

  receivedAsReceiver: messageSents(
    where: { to: $userAddress }
    first: $first
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    from
    encryptedMessage
    blockTimestamp
  }
}
```

##### 4. Query All Conversations

```graphql
query GetConversations($first: Int!, $skip: Int!) {
  conversationCreateds(
    first: $first
    skip: $skip
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    smallerAddress
    largerAddress
    createdAt
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

##### 5. Query User's Conversations

```graphql
query GetUserConversations($userAddress: Bytes!) {
  conversations: conversationCreateds(
    where: {
      or: [
        { smallerAddress: $userAddress }
        { largerAddress: $userAddress }
      ]
    }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    conversationId
    smallerAddress
    largerAddress
    createdAt
    blockTimestamp
  }
}
```

##### 6. Query User Balance History

```graphql
query GetUserDeposits($userAddress: Bytes!) {
  fundsDepositeds(
    where: { from: $userAddress }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    amount
    createdAt
    blockTimestamp
    transactionHash
  }

  feeChargeds(
    where: { from: $userAddress }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    amount
    createdAt
    blockTimestamp
    transactionHash
  }
}
```

##### 7. Get Latest Fee Configuration

```graphql
query GetFeeConfig {
  payAsYouGoFeeSets(
    first: 1
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    amount
    createdAt
    blockTimestamp
  }

  relayerFeeSets(
    first: 1
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    amount
    createdAt
    blockTimestamp
  }

  relayerSets(
    first: 1
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    relayer
    createdAt
    blockTimestamp
  }
}
```

## Complete Example: Fetching Conversation Messages

```typescript
import { ethers } from 'ethers';
import MessageABI from './abis/Message.json';

const MESSAGE_PROXY_ADDRESS = '0x41BC86bA44813b2B106E1942CB68cc471714df2D';
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/<id>/dehive-messaging/<version>';

// Get conversation details from contract
async function getConversationFromContract(conversationId: bigint) {
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
  const contract = new ethers.Contract(MESSAGE_PROXY_ADDRESS, MessageABI, provider);
  return await contract.conversations(conversationId);
}

// Get messages from subgraph
async function getMessagesFromSubgraph(conversationId: string) {
  const query = `
    query GetMessages($conversationId: BigInt!) {
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
        transactionHash
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { conversationId }
    })
  });

  const { data } = await response.json();
  return data.messageSents;
}

// Combined function
async function getConversationWithMessages(conversationId: bigint) {
  const [conversation, messages] = await Promise.all([
    getConversationFromContract(conversationId),
    getMessagesFromSubgraph(conversationId.toString())
  ]);

  return {
    conversation: {
      smallerAddress: conversation[0],
      largerAddress: conversation[1],
      createdAt: conversation[4].toString()
    },
    messages: messages
  };
}

// Usage
const conversationId = BigInt('123456789');
const data = await getConversationWithMessages(conversationId);
console.log('Conversation:', data.conversation);
console.log('Messages:', data.messages);
```

## Using Web3.js (Alternative)

```javascript
import Web3 from 'web3';
import MessageABI from './abis/Message.json';

const web3 = new Web3('https://sepolia.infura.io/v3/YOUR_KEY');
const messageContract = new web3.eth.Contract(
  MessageABI,
  '0x41BC86bA44813b2B106E1942CB68cc471714df2D'
);

// Query conversation
async function getConversation(conversationId) {
  const result = await messageContract.methods.conversations(conversationId).call();
  return {
    smallerAddress: result[0],
    largerAddress: result[1],
    encryptedConversationKeyForSmallerAddress: result[2],
    encryptedConversationKeyForLargerAddress: result[3],
    createdAt: result[4]
  };
}

// Query events
async function getMessageEvents(conversationId, fromBlock = 9535551) {
  const events = await messageContract.getPastEvents('MessageSent', {
    filter: { conversationId: conversationId },
    fromBlock: fromBlock,
    toBlock: 'latest'
  });

  return events.map(event => ({
    conversationId: event.returnValues.conversationId,
    from: event.returnValues.from,
    to: event.returnValues.to,
    encryptedMessage: event.returnValues.encryptedMessage,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash
  }));
}
```

## Best Practices

1. **Use Subgraph for Historical Queries**: The subgraph is faster for querying historical events and supports filtering, pagination, and aggregation.

2. **Use Direct Contract Calls for Real-Time Data**: When you need the latest state or current balances, query the contract directly.

3. **Cache Conversation IDs**: Store conversation IDs locally to avoid repeated queries.

4. **Handle Errors**: Always wrap queries in try-catch blocks and handle network errors gracefully.

5. **Pagination**: For large result sets, use pagination with `first` and `skip` parameters in GraphQL queries.

6. **Indexed Fields**: When querying events, use indexed fields (`conversationId`, `from`, `to`) for better performance.

## Contract View Functions Summary

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `conversations` | `uint256 conversationId` | `(address, address, bytes, bytes, uint256)` | Get conversation details |
| `funds` | `address user` | `uint256` | Get user's deposited balance |
| `getMyEncryptedConversationKeys` | `uint256 conversationId` | `bytes` | Get user's encrypted key (requires signer) |
| `payAsYouGoFee` | - | `uint256` | Get pay-as-you-go fee amount |
| `relayerFee` | - | `uint256` | Get relayer fee amount |
| `relayer` | - | `address` | Get relayer address |
| `owner` | - | `address` | Get contract owner |

## Event Queries Summary

| Event | Indexed Fields | Non-Indexed Fields |
|-------|---------------|-------------------|
| `MessageSent` | `conversationId`, `from`, `to` | `encryptedMessage` |
| `ConversationCreated` | `conversationId`, `smallerAddress`, `largerAddress` | `createdAt` |
| `FundsDeposited` | `from` | `amount`, `createdAt` |
| `FeeCharged` | `from` | `amount`, `createdAt` |
