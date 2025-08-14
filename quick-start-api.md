# 🚀 Quick Start: Getting Your First API Key (Twitter)

Since Twitter/X API is the easiest to obtain, let's start there!

## Step 1: Get Twitter API Access (5 minutes)

1. **Go to Twitter Developer Portal**
   - Link: https://developer.twitter.com/
   - Click "Sign up" → Log in with your Twitter account

2. **Quick Application**
   - Select: "Hobbyist" → "Exploring the API"
   - Fill basic info:
     - **Name**: Your name
     - **Country**: Your country
     - **Use case**: "Learning and exploring"

3. **Describe Your Use**
   ```
   I'm building Fashion Oracle, a platform that analyzes fashion trends
   by monitoring public tweets about fashion, style, and clothing.
   The app will:
   - Search for fashion-related hashtags
   - Analyze engagement on fashion content
   - Track emerging style trends
   - No automated posting or user interaction
   ```

4. **Get Your Bearer Token**
   - Once approved (usually instant for basic access)
   - Go to your app → "Keys and tokens"
   - Copy the "Bearer Token"

## Step 2: Add to Fashion Oracle

### Option A: Add to Supabase Dashboard (Production)
1. Go to: https://supabase.com/dashboard/project/ifyyxkwwmnbokjbqgsmi/settings/vault
2. Click "New secret"
3. Add:
   - Name: `TWITTER_BEARER_TOKEN`
   - Value: `your-bearer-token-here`

### Option B: Test Locally First
1. Open `supabase/functions/.env`
2. Add your token:
   ```env
   TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAmlheaAAAAA...
   ```

## Step 3: Test It!

Run this command to test Twitter data collection:

```bash
curl -X POST http://localhost:54321/functions/v1/collect-social-data \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmeXl4a3d3bW5ib2tqYnFnc21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzg2OTUsImV4cCI6MjA3MDc1NDY5NX0.to23KV-wt2NknukM-Zbz-RShKyyZIpwC2DqJqIKgbHA" \
  -H "Content-Type: application/json"
```

## What You Can Do With Just Twitter API:

✅ **Search fashion tweets** - Find posts with #fashion, #ootd, #style
✅ **Track hashtag trends** - Monitor trending fashion hashtags
✅ **Analyze engagement** - See what fashion content gets likes/retweets
✅ **Identify influencers** - Find fashion accounts with high engagement
✅ **Real-time monitoring** - Track fashion events and shows

## Free Tier Limits:
- 500,000 tweets per month (plenty for testing!)
- Search last 7 days of tweets
- 300 requests per 15 minutes

## Sample Searches Your App Can Make:

```javascript
// Fashion hashtags
"#fashion OR #style OR #ootd OR #fashionweek"

// Specific trends
"streetwear trend"
"sustainable fashion"
"vintage style"

// Brand mentions
"@nike OR @adidas OR @zara"

// Fashion events
"#NYFW OR #ParisFashionWeek"
```

## 🎉 That's It!

With just the Twitter API, your Fashion Oracle can:
- Start collecting real fashion data
- Analyze trending styles
- Build a database of fashion insights
- Make AI-powered predictions

**No Instagram or TikTok needed to start!** The platform already includes mock data for those platforms.

---

## Optional: Instagram (If You Want More Data)

If you want Instagram data too, the simplest approach:

1. **Use your personal Instagram**
   - Convert to Creator/Business account (free, instant)
   - Link to a Facebook page (can be private)
   
2. **Get Basic Access Token** (10 minutes)
   - Go to: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Add permission: `instagram_basic`
   - Generate token
   - Add to Fashion Oracle

---

## 🤔 FAQ

**Q: Do I need all three APIs?**
A: No! The app works with mock data. Start with Twitter, add others later.

**Q: Is Twitter API free?**
A: Yes! Free tier gives you 500,000 tweets/month.

**Q: Can I use the app without any APIs?**
A: Yes! Mock data is already implemented and working.

**Q: Which API is most important?**
A: Twitter - it's easiest to get and has the most public fashion data.

---

## Next Step:

Once you have your Twitter Bearer Token:
1. Deploy the Edge Functions using `.\deploy-functions.ps1`
2. Add the token in Supabase Dashboard
3. Your Fashion Oracle will start collecting real fashion data!

**Need help?** The mock data will keep everything working while you set up the APIs.