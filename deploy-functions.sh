#!/bin/bash

echo "🚀 Deploying Fashion Oracle Edge Functions to Supabase"
echo "======================================================="

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null && ! command -v npx &> /dev/null
then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Use npx if supabase is not installed globally
SUPABASE_CMD="npx supabase"

echo ""
echo "📋 Step 1: Linking to your Supabase project..."
echo "Project ref: ifyyxkwwmnbokjbqgsmi"
echo ""
$SUPABASE_CMD link --project-ref ifyyxkwwmnbokjbqgsmi

echo ""
echo "📋 Step 2: Deploying Edge Functions..."
echo ""

# Deploy analyze-image function
echo "🔄 Deploying analyze-image function..."
$SUPABASE_CMD functions deploy analyze-image
if [ $? -eq 0 ]; then
    echo "✅ analyze-image deployed successfully!"
else
    echo "❌ Failed to deploy analyze-image"
fi

echo ""

# Deploy predict-trends function
echo "🔄 Deploying predict-trends function..."
$SUPABASE_CMD functions deploy predict-trends
if [ $? -eq 0 ]; then
    echo "✅ predict-trends deployed successfully!"
else
    echo "❌ Failed to deploy predict-trends"
fi

echo ""

# Deploy collect-social-data function
echo "🔄 Deploying collect-social-data function..."
$SUPABASE_CMD functions deploy collect-social-data
if [ $? -eq 0 ]; then
    echo "✅ collect-social-data deployed successfully!"
else
    echo "❌ Failed to deploy collect-social-data"
fi

echo ""
echo "======================================================="
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Supabase Dashboard"
echo "2. Test your functions using the URLs below:"
echo ""
echo "   Image Analysis:"
echo "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/analyze-image"
echo ""
echo "   Trend Prediction:"
echo "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/predict-trends"
echo ""
echo "   Social Data Collection:"
echo "   https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/collect-social-data"
echo ""
echo "📖 See deploy-edge-functions.md for detailed instructions"