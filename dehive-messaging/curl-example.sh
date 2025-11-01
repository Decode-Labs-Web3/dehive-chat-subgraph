#!/bin/bash

# Example: Get messages by conversationId with pagination
# Replace CONVERSATION_ID, FIRST, and SKIP with actual values

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
