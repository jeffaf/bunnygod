#!/bin/bash
# Test script for Bunny God Feedback System
# Tests the /api/feedback endpoint

set -e

# Configuration
WORKER_URL="${1:-http://localhost:8787}"
ENDPOINT="$WORKER_URL/api/feedback"

echo "🐰 Bunny God Feedback System - Test Script"
echo "==========================================="
echo "Testing endpoint: $ENDPOINT"
echo ""

# Test 1: Valid feedback submission (helpful)
echo "Test 1: Submit helpful feedback"
echo "--------------------------------"
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "test123abc",
    "rating": "helpful",
    "timestamp": '$(date +%s)000',
    "sessionId": "test-session-'$(date +%s)'"
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Test 1 PASSED"
else
    echo "❌ Test 1 FAILED"
fi
echo ""

# Wait a moment
sleep 1

# Test 2: Valid feedback submission (not-helpful)
echo "Test 2: Submit not-helpful feedback"
echo "------------------------------------"
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "test456def",
    "rating": "not-helpful",
    "timestamp": '$(date +%s)000',
    "sessionId": "test-session-'$(date +%s)'"
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ Test 2 PASSED"
else
    echo "❌ Test 2 FAILED"
fi
echo ""

# Test 3: Duplicate submission (rate limiting)
echo "Test 3: Rate limiting (duplicate submission)"
echo "---------------------------------------------"
SESSION_ID="test-session-duplicate-$(date +%s)"
QUESTION_HASH="test789ghi"

# First submission
RESPONSE1=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "'$QUESTION_HASH'",
    "rating": "helpful",
    "timestamp": '$(date +%s)000',
    "sessionId": "'$SESSION_ID'"
  }')

echo "First submission: $RESPONSE1"

# Second submission (should be rate limited)
sleep 1
RESPONSE2=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "'$QUESTION_HASH'",
    "rating": "not-helpful",
    "timestamp": '$(date +%s)000',
    "sessionId": "'$SESSION_ID'"
  }')

echo "Second submission: $RESPONSE2"

if echo "$RESPONSE2" | grep -q "Already rated"; then
    echo "✅ Test 3 PASSED (rate limiting works)"
else
    echo "❌ Test 3 FAILED (rate limiting not working)"
fi
echo ""

# Test 4: Invalid rating value
echo "Test 4: Invalid rating validation"
echo "----------------------------------"
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "questionHash": "test-invalid",
    "rating": "super-helpful",
    "timestamp": '$(date +%s)000',
    "sessionId": "test-session-'$(date +%s)'"
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Invalid rating"; then
    echo "✅ Test 4 PASSED (validation works)"
else
    echo "❌ Test 4 FAILED (validation not working)"
fi
echo ""

# Test 5: Missing required field
echo "Test 5: Missing required field"
echo "-------------------------------"
RESPONSE=$(curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": "helpful",
    "timestamp": '$(date +%s)000'
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Invalid questionHash"; then
    echo "✅ Test 5 PASSED (required field validation works)"
else
    echo "❌ Test 5 FAILED (validation not working)"
fi
echo ""

echo "==========================================="
echo "✨ Testing complete!"
echo ""
echo "To view stored feedback data:"
echo "  npx wrangler kv:key list --binding=FEEDBACK --prefix=\"feedback:\""
echo ""
echo "To view a specific entry:"
echo "  npx wrangler kv:key get \"feedback:test123abc:TIMESTAMP\" --binding=FEEDBACK"
echo ""
echo "🐰 All hail the Bunny God!"
