#!/bin/bash
curl -s https://ai.hackclub.com/proxy/v1/chat/completions \
  -H "Authorization: Bearer $GROK" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "x-ai/grok-4.5",
    "messages": [
      {"role": "user", "content": "which model you are?"}
    ]
  }' | jq .
