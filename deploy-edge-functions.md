# Deploying Supabase Edge Functions for Fashion Oracle

## Prerequisites

1. Supabase CLI installed (we're using npx)
2. Your Supabase project credentials
3. Access to your Supabase Dashboard

## Step 1: Link Your Supabase Project

First, link your local project to your remote Supabase project:

```bash
npx supabase link --project-ref ifyyxkwwmnbokjbqgsmi
```

When prompted, enter your database password: `YYHVnNhafcgH05LB`

## Step 2: Deploy Individual Edge Functions

Deploy each function one by one:

### Deploy Image Analysis Function
```bash
npx supabase functions deploy analyze-image
```

### Deploy Trend Prediction Function
```bash
npx supabase functions deploy predict-trends
```

### Deploy Social Data Collection Function
```bash
npx supabase functions deploy collect-social-data
```

## Step 3: Set Environment Variables in Supabase Dashboard

Go to your Supabase Dashboard > Edge Functions > Manage Secrets and add:

```
# These are already set in your project
SUPABASE_URL=https://ifyyxkwwmnbokjbqgsmi.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Add these for social media integration (optional)
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
TWITTER_BEARER_TOKEN=your_twitter_token
TIKTOK_ACCESS_TOKEN=your_tiktok_token

# Add these for AI services (optional)
HUGGINGFACE_API_KEY=your_huggingface_key
OPENAI_API_KEY=your_openai_key
```

## Step 4: Update Your Frontend Code

Update the ImageAnalyzer component to use the Edge Function:

```typescript
// In src/components/fashion/ImageAnalyzer.tsx
const { data, error } = await supabase.functions
  .invoke('analyze-image', {
    body: { imageUrl: publicUrl, userId: user?.id }
  })
```

## Step 5: Set Up Scheduled Jobs (Optional)

For automatic social data collection and trend prediction, set up cron jobs in Supabase:

1. Go to Database > Extensions
2. Enable `pg_cron` extension
3. Create scheduled jobs:

```sql
-- Run trend prediction every 6 hours
SELECT cron.schedule(
  'predict-trends',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/predict-trends',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_ANON_KEY',
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- Collect social data every 2 hours
SELECT cron.schedule(
  'collect-social-data',
  '0 */2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/collect-social-data',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_ANON_KEY',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

## Testing Your Edge Functions

### Test Image Analysis
```bash
curl -X POST https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/analyze-image \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/fashion.jpg"}'
```

### Test Trend Prediction
```bash
curl -X POST https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/predict-trends \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### Test Social Data Collection
```bash
curl -X POST https://ifyyxkwwmnbokjbqgsmi.supabase.co/functions/v1/collect-social-data \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Monitoring

Monitor your Edge Functions in the Supabase Dashboard:
- Go to Edge Functions > Logs to see execution logs
- Check Edge Functions > Metrics for performance data

## Troubleshooting

### Common Issues:

1. **Function not found**: Make sure you've deployed the function
2. **Authentication error**: Check your API keys are correct
3. **CORS errors**: The functions include CORS headers, but check your domain is allowed
4. **Timeout errors**: Edge Functions have a 10-second timeout by default

### Debugging locally:

```bash
# Serve functions locally
npx supabase functions serve

# Test locally
curl -X POST http://localhost:54321/functions/v1/analyze-image \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/fashion.jpg"}'
```

## Next Steps

1. **Add Real AI Integration**: 
   - Sign up for Hugging Face API
   - Or use OpenAI Vision API
   - Update the `analyzeImageWithAI` function

2. **Connect Social Media APIs**:
   - Instagram Basic Display API
   - Twitter API v2
   - TikTok for Developers

3. **Enhance Trend Algorithms**:
   - Implement machine learning models
   - Add historical data analysis
   - Improve prediction accuracy

4. **Scale Your Functions**:
   - Monitor usage and performance
   - Optimize for larger datasets
   - Consider caching strategies