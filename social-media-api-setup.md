# Social Media API Setup Guide for Fashion Oracle

## Overview
This guide will help you obtain API keys for Instagram, Twitter (X), and TikTok to enable social media data collection in your Fashion Oracle platform.

---

## 📸 Instagram API Setup

### Option 1: Instagram Basic Display API (Recommended for Getting Started)
Best for: Reading public Instagram data, user's own posts

1. **Create a Facebook Developer Account**
   - Go to: https://developers.facebook.com/
   - Click "Get Started"
   - Log in with your Facebook account

2. **Create a New App**
   - Click "Create App"
   - Choose "Consumer" as app type
   - Fill in app details:
     - App Name: "Fashion Oracle"
     - App Contact Email: your email
     - App Purpose: Select appropriate category

3. **Add Instagram Basic Display Product**
   - In your app dashboard, click "+ Add Product"
   - Find "Instagram Basic Display" and click "Set Up"
   - Click "Create New App"

4. **Configure Instagram Basic Display**
   - Go to: Basic Display → Basic Display
   - Add these OAuth Redirect URIs:
     ```
     https://localhost:3000/auth/instagram/callback
     https://your-domain.com/auth/instagram/callback
     ```
   - Add Deauthorize Callback URL:
     ```
     https://your-domain.com/auth/instagram/deauthorize
     ```
   - Add Data Deletion Request URL:
     ```
     https://your-domain.com/auth/instagram/delete
     ```

5. **Add Instagram Test User**
   - Go to: Roles → Instagram Testers
   - Click "Add Instagram Testers"
   - Enter your Instagram username
   - Accept the invitation in Instagram (Settings → Apps and Websites → Tester Invites)

6. **Generate Access Token**
   - Go to: Basic Display → User Token Generator
   - Click "Generate Token" for your test user
   - Authorize the app when prompted
   - Copy the access token

7. **Get Long-Lived Token (60 days)**
   ```bash
   curl -X GET \
     "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
   ```

### Option 2: Instagram Graph API (For Business Accounts)
Best for: Analyzing business accounts, getting insights, hashtag data

1. **Requirements**
   - Instagram Business or Creator Account
   - Facebook Page connected to Instagram account
   - Facebook Developer Account

2. **Setup Process**
   - Create Facebook App (same as above)
   - Add "Instagram Graph API" product
   - Connect your Facebook Page
   - Get Page Access Token
   - Use Page Access Token to access Instagram data

**API Limits:**
- Basic Display: 200 calls/hour
- Graph API: 200 calls/hour per user

---

## 🐦 Twitter (X) API Setup

### Getting Twitter API v2 Access

1. **Create Twitter Developer Account**
   - Go to: https://developer.twitter.com/
   - Click "Sign up"
   - Log in with your Twitter account

2. **Apply for Developer Access**
   - Choose your use case: "Student" or "Building customized solutions"
   - Fill out the application:
     - **What would you like us to call you?** Your name/company
     - **How will you use the Twitter API?** 
       ```
       Fashion Oracle uses the Twitter API to:
       1. Analyze fashion-related tweets and trends
       2. Track hashtag performance for fashion items
       3. Monitor influencer engagement with fashion content
       4. Collect public sentiment about fashion trends
       ```
     - **Are you planning to analyze Twitter data?** Yes
     - **Will your app use Tweet, Retweet, Like, Follow, or Direct Message functionality?** No (for data collection only)
     - **Do you plan to display Tweets outside Twitter?** No

3. **Wait for Approval**
   - Usually takes 1-2 days
   - You'll receive an email when approved

4. **Create a Project and App**
   - Go to Developer Portal: https://developer.twitter.com/en/portal/dashboard
   - Click "New Project"
   - Name: "Fashion Oracle"
   - Use case: "Exploring the API"
   - Description: "Fashion trend analysis platform"

5. **Get API Keys**
   - In your app settings, go to "Keys and tokens"
   - Generate and save:
     - API Key (Consumer Key)
     - API Key Secret
     - Bearer Token ← **This is what you need for Fashion Oracle**

**Free Tier Limits:**
- 500,000 Tweets per month
- 1 request per second
- Access to recent Tweets (last 7 days)

**Paid Tiers Available:**
- Basic ($100/month): 10M Tweets
- Pro ($5,000/month): Full archive access

---

## 🎵 TikTok API Setup

### TikTok for Developers

**Note:** TikTok's API is more restricted and requires approval for most use cases.

1. **Create TikTok Developer Account**
   - Go to: https://developers.tiktok.com/
   - Click "Get Started"
   - Sign up with email or TikTok account

2. **Create an App**
   - Go to "Manage apps" → "Create app"
   - Fill in details:
     - App name: "Fashion Oracle"
     - Description: "Fashion trend analysis platform"
     - Category: "Utility & Productivity"
     - Platform: Web

3. **Apply for API Access**
   - Most APIs require approval
   - Available APIs:
     - **Login Kit**: User authentication
     - **Share Kit**: Sharing content
     - **Display API**: Embed TikTok videos
     - **Research API**: Academic research (requires approval)
     - **Content Posting API**: Post content (requires approval)

4. **For Fashion Oracle, Request:**
   - **Research API** (if eligible)
   - **Webhooks** for real-time data
   
5. **Alternative: TikTok Scraping**
   Since official API is limited, consider:
   - Using TikTok's public web interface
   - Third-party services (be careful with ToS)
   - Manual data collection for testing

**Current Limitations:**
- No public API for searching/trending content
- Most features require partnership approval
- Consider starting without TikTok integration

---

## 🔧 Adding API Keys to Fashion Oracle

### Step 1: Add to Supabase Edge Functions

1. **Go to Supabase Dashboard**
   - Navigate to: Edge Functions → Manage Secrets
   - URL: https://supabase.com/dashboard/project/ifyyxkwwmnbokjbqgsmi/functions

2. **Add Environment Variables**
   ```
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   TIKTOK_ACCESS_TOKEN=your_tiktok_token_here
   ```

### Step 2: Update Local Development

1. **Update `.env.local`**
   ```env
   # Social Media APIs
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   TIKTOK_ACCESS_TOKEN=your_tiktok_token_here
   ```

2. **Update `supabase/functions/.env`**
   ```env
   # Social Media APIs
   INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   TIKTOK_ACCESS_TOKEN=your_tiktok_token_here
   ```

---

## 🚀 Quick Start (Without Real APIs)

If you want to test the platform without setting up APIs immediately:

1. **The Edge Functions already include mock data generation**
   - They will work without API keys
   - Mock data simulates real social media posts

2. **Priority Order for Setup:**
   1. Start with mock data (already working!)
   2. Add Twitter API (easiest to get)
   3. Add Instagram Basic Display (moderate difficulty)
   4. Add TikTok later (most difficult)

---

## 📝 Implementation Examples

### Using Instagram API in Edge Function

```typescript
// In collect-social-data/index.ts
async function collectInstagramPosts(): Promise<SocialPost[]> {
  const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
  
  if (!INSTAGRAM_ACCESS_TOKEN) {
    return generateMockPosts('instagram', 5) // Fallback to mock
  }

  const response = await fetch(
    `https://graph.instagram.com/v17.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,username&access_token=${INSTAGRAM_ACCESS_TOKEN}`
  )
  
  const data = await response.json()
  
  return data.data.map((post: any) => ({
    platform: 'instagram',
    post_id: post.id,
    username: post.username,
    content: post.caption,
    image_urls: [post.media_url],
    posted_at: post.timestamp,
    likes: 0, // Requires additional API call
    shares: 0,
    comments: 0
  }))
}
```

### Using Twitter API in Edge Function

```typescript
// In collect-social-data/index.ts
async function collectTwitterPosts(): Promise<SocialPost[]> {
  const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN')
  
  if (!TWITTER_BEARER_TOKEN) {
    return generateMockPosts('twitter', 5) // Fallback to mock
  }

  const response = await fetch(
    'https://api.twitter.com/2/tweets/search/recent?query=fashion trend -is:retweet&tweet.fields=created_at,public_metrics,author_id&expansions=author_id&user.fields=username,public_metrics&max_results=10',
    {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
      }
    }
  )
  
  const data = await response.json()
  
  return data.data.map((tweet: any) => ({
    platform: 'twitter',
    post_id: tweet.id,
    content: tweet.text,
    likes: tweet.public_metrics.like_count,
    shares: tweet.public_metrics.retweet_count,
    comments: tweet.public_metrics.reply_count,
    posted_at: tweet.created_at
  }))
}
```

---

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Use environment variables
   - Add `.env` files to `.gitignore`

2. **Rotate tokens regularly**
   - Instagram: Every 60 days
   - Twitter: As needed
   - TikTok: Follow their guidelines

3. **Use rate limiting**
   - Implement caching
   - Batch requests
   - Use webhooks when available

4. **Monitor usage**
   - Check API dashboards regularly
   - Set up alerts for rate limits
   - Log API calls

---

## 📚 Additional Resources

### Documentation
- Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api
- Twitter API v2: https://developer.twitter.com/en/docs/twitter-api
- TikTok for Developers: https://developers.tiktok.com/doc/overview

### Tools
- Postman for API testing: https://www.postman.com/
- Instagram Token Generator: https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions
- Twitter API Playground: https://developer.twitter.com/apitools/api

### Community
- Twitter Developer Community: https://twittercommunity.com/
- Facebook Developer Community: https://developers.facebook.com/community/
- Stack Overflow: Tag with `instagram-api`, `twitter-api`, `tiktok-api`

---

## 🎯 Next Steps

1. **Start with Twitter API** (easiest to set up)
2. **Test with mock data first** (already implemented)
3. **Add Instagram when you have test content**
4. **Consider TikTok for future enhancement**

Remember: The platform works without these APIs thanks to mock data generation!