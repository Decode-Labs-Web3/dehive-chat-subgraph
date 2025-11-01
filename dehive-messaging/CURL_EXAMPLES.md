# cURL Examples for Querying Messages

## Fixed cURL Command

The issue is that GraphQL queries must be sent as a JSON object with `query`, `variables`, and `operationName` fields, not as a raw string.

### Correct Format

```bash
curl --request POST \
  --url https://api.studio.thegraph.com/query/1713799/dehive-messaging/version/latest \
  --header 'Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "query GetMessagesByConversation($conversationId: BigInt!, $first: Int!, $skip: Int!) { messageSents(where: { conversationId: $conversationId }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: asc) { id conversationId from to encryptedMessage blockNumber blockTimestamp transactionHash } }",
    "variables": {
      "conversationId": "123456789",
      "first": 20,
      "skip": 0
    },
    "operationName": "GetMessagesByConversation"
  }'
```

### With Variables (Shell Script)

```bash
#!/bin/bash

CONVERSATION_ID="123456789"
FIRST=20
SKIP=0

curl --request POST \
  --url https://api.studio.thegraph.com/query/1713799/dehive-messaging/version/latest \
  --header 'Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "query GetMessagesByConversation($conversationId: BigInt!, $first: Int!, $skip: Int!) { messageSents(where: { conversationId: $conversationId }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: asc) { id conversationId from to encryptedMessage blockNumber blockTimestamp transactionHash } }",
    "variables": {
      "conversationId": "'"$CONVERSATION_ID"'",
      "first": '"$FIRST"',
      "skip": '"$SKIP"'
    },
    "operationName": "GetMessagesByConversation"
  }'
```

### Using a JSON File

Create `query.json`:
```json
{
  "query": "query GetMessagesByConversation($conversationId: BigInt!, $first: Int!, $skip: Int!) { messageSents(where: { conversationId: $conversationId }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: asc) { id conversationId from to encryptedMessage blockNumber blockTimestamp transactionHash } }",
  "variables": {
    "conversationId": "123456789",
    "first": 20,
    "skip": 0
  },
  "operationName": "GetMessagesByConversation"
}
```

Then use:
```bash
curl --request POST \
  --url https://api.studio.thegraph.com/query/1713799/dehive-messaging/version/latest \
  --header 'Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2' \
  --header 'Content-Type: application/json' \
  --data @query.json
```

### One-liner (All in Single Line)

```bash
curl -X POST https://api.studio.thegraph.com/query/1713799/dehive-messaging/version/latest -H "Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2" -H "Content-Type: application/json" -d '{"query":"query GetMessagesByConversation($conversationId: BigInt!, $first: Int!, $skip: Int!) { messageSents(where: { conversationId: $conversationId }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: asc) { id conversationId from to encryptedMessage blockNumber blockTimestamp transactionHash } }","variables":{"conversationId":"123456789","first":20,"skip":0},"operationName":"GetMessagesByConversation"}'
```

### Pretty Print Response (with jq)

```bash
curl --request POST \
  --url https://api.studio.thegraph.com/query/1713799/dehive-messaging/version/latest \
  --header 'Authorization: Bearer 112c016bdd600a7de3fa8e9379471bf2' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "query GetMessagesByConversation($conversationId: BigInt!, $first: Int!, $skip: Int!) { messageSents(where: { conversationId: $conversationId }, first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: asc) { id conversationId from to encryptedMessage blockNumber blockTimestamp transactionHash } }",
    "variables": {
      "conversationId": "123456789",
      "first": 20,
      "skip": 0
    },
    "operationName": "GetMessagesByConversation"
  }' | jq '.'
```

## Common Mistakes

### ❌ Wrong: Query as raw string
```bash
--data 'query GetMessagesByConversation(...) { ... }'
```

### ✅ Correct: Query in JSON object
```bash
--data '{
  "query": "query GetMessagesByConversation(...) { ... }",
  "variables": { ... },
  "operationName": "GetMessagesByConversation"
}'
```

## Response Format

```json
{
  "data": {
    "messageSents": [
      {
        "id": "0x...",
        "conversationId": "123456789",
        "from": "0x...",
        "to": "0x...",
        "encryptedMessage": "...",
        "blockNumber": "9535560",
        "blockTimestamp": "1704067200",
        "transactionHash": "0x..."
      }
    ]
  }
}
```
