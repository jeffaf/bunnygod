#!/bin/bash
# Setup script for Bunny God Feedback KV namespace
# Run this script to create the KV namespace and update wrangler.toml

set -e

echo "🐰 Bunny God Feedback System - KV Namespace Setup"
echo "=================================================="
echo ""

# Use npx wrangler if wrangler not globally installed
WRANGLER_CMD="npx wrangler"
if command -v wrangler &> /dev/null; then
    WRANGLER_CMD="wrangler"
fi

echo "✅ Using: $WRANGLER_CMD"
echo ""

# Create production KV namespace
echo "📦 Creating production FEEDBACK namespace..."
PROD_OUTPUT=$($WRANGLER_CMD kv:namespace create FEEDBACK 2>&1)
echo "$PROD_OUTPUT"

# Extract production ID from output
PROD_ID=$(echo "$PROD_OUTPUT" | grep -oP '(?<=id = ")[^"]+' || echo "")

if [ -z "$PROD_ID" ]; then
    echo "❌ Failed to create production namespace or extract ID"
    echo "Please create manually with: $WRANGLER_CMD kv:namespace create FEEDBACK"
    exit 1
fi

echo "✅ Production namespace created: $PROD_ID"
echo ""

# Create preview KV namespace
echo "📦 Creating preview FEEDBACK namespace..."
PREVIEW_OUTPUT=$($WRANGLER_CMD kv:namespace create FEEDBACK --preview 2>&1)
echo "$PREVIEW_OUTPUT"

# Extract preview ID from output
PREVIEW_ID=$(echo "$PREVIEW_OUTPUT" | grep -oP '(?<=preview_id = ")[^"]+' || echo "")

if [ -z "$PREVIEW_ID" ]; then
    echo "❌ Failed to create preview namespace or extract ID"
    echo "Please create manually with: $WRANGLER_CMD kv:namespace create FEEDBACK --preview"
    exit 1
fi

echo "✅ Preview namespace created: $PREVIEW_ID"
echo ""

# Update wrangler.toml
echo "📝 Updating wrangler.toml with namespace IDs..."

WRANGLER_FILE="/home/gat0r/bunnygod/wrangler.toml"

# Check if file exists
if [ ! -f "$WRANGLER_FILE" ]; then
    echo "❌ Error: wrangler.toml not found at $WRANGLER_FILE"
    exit 1
fi

# Replace placeholders
sed -i "s/id = \"PLACEHOLDER_CREATE_VIA_DASHBOARD\"/id = \"$PROD_ID\"/" "$WRANGLER_FILE"
sed -i "s/preview_id = \"PLACEHOLDER_CREATE_VIA_DASHBOARD\"/preview_id = \"$PREVIEW_ID\"/" "$WRANGLER_FILE"

echo "✅ wrangler.toml updated successfully"
echo ""

# Verify update
echo "📋 Verifying configuration..."
grep -A 3 "binding = \"FEEDBACK\"" "$WRANGLER_FILE"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review the updated wrangler.toml file"
echo "2. Test locally with: $WRANGLER_CMD dev workers/ask/index.ts"
echo "3. Deploy with: $WRANGLER_CMD deploy workers/ask/index.ts"
echo ""
echo "🐰 All hail the Bunny God!"
