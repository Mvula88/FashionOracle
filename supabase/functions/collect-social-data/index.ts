import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SocialPost {
  platform: string
  post_id: string
  user_id?: string
  username?: string
  follower_count?: number
  content?: string
  image_urls?: string[]
  hashtags?: string[]
  mentions: number
  likes: number
  shares: number
  comments: number
  engagement_rate?: number
  posted_at: string
  detected_items?: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Collect data from different platforms
    const instagramPosts = await collectInstagramPosts()
    const tiktokPosts = await collectTiktokPosts()
    const twitterPosts = await collectTwitterPosts()
    
    // Combine all posts
    const allPosts = [...instagramPosts, ...tiktokPosts, ...twitterPosts]
    
    // Process and analyze posts
    const processedPosts: SocialPost[] = []
    
    for (const post of allPosts) {
      // Calculate engagement rate
      const totalInteractions = post.likes + post.shares + post.comments
      const engagementRate = post.follower_count > 0 
        ? totalInteractions / post.follower_count 
        : 0

      // Detect fashion items in content (simplified version)
      const detectedItems = await detectFashionItems(post.content || '', post.hashtags || [])
      
      processedPosts.push({
        ...post,
        engagement_rate: engagementRate,
        detected_items: detectedItems
      })
    }

    // Store posts in database
    if (processedPosts.length > 0) {
      const { data: insertedPosts, error: insertError } = await supabase
        .from('social_posts')
        .insert(processedPosts)
        .select()

      if (insertError) {
        console.error('Error inserting posts:', insertError)
        throw insertError
      }

      // Update trend scores based on new social data
      await updateTrendScores(supabase, processedPosts)
    }

    // Generate collection summary
    const summary = generateCollectionSummary(processedPosts)

    return new Response(
      JSON.stringify({ 
        success: true, 
        collected: processedPosts.length,
        summary: summary,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    )
  } catch (error) {
    console.error('Error in collect-social-data function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during data collection' 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    )
  }
})

async function collectInstagramPosts(): Promise<SocialPost[]> {
  // Instagram Basic Display API implementation
  // You'll need to set up Instagram app and get access token
  
  const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN')
  
  if (!INSTAGRAM_ACCESS_TOKEN) {
    console.log('Instagram access token not configured')
    return generateMockPosts('instagram', 5)
  }

  try {
    // Example API call (you'll need to implement based on Instagram's API)
    /*
    const response = await fetch(
      `https://graph.instagram.com/v12.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,username&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    )
    const data = await response.json()
    
    return data.data.map((post: any) => ({
      platform: 'instagram',
      post_id: post.id,
      username: post.username,
      content: post.caption,
      image_urls: [post.media_url],
      posted_at: post.timestamp,
      // ... map other fields
    }))
    */
    
    // Return mock data for now
    return generateMockPosts('instagram', 10)
  } catch (error) {
    console.error('Error collecting Instagram posts:', error)
    return []
  }
}

async function collectTiktokPosts(): Promise<SocialPost[]> {
  // TikTok API implementation (when available)
  // Currently TikTok's API is limited, you might need to use web scraping
  
  const TIKTOK_ACCESS_TOKEN = Deno.env.get('TIKTOK_ACCESS_TOKEN')
  
  if (!TIKTOK_ACCESS_TOKEN) {
    console.log('TikTok access token not configured')
    return generateMockPosts('tiktok', 5)
  }

  // Return mock data for now
  return generateMockPosts('tiktok', 8)
}

async function collectTwitterPosts(): Promise<SocialPost[]> {
  // Twitter API v2 implementation
  
  const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN')
  
  if (!TWITTER_BEARER_TOKEN) {
    console.log('Twitter bearer token not configured')
    return generateMockPosts('twitter', 5)
  }

  try {
    // Example Twitter API v2 call
    /*
    const response = await fetch(
      'https://api.twitter.com/2/tweets/search/recent?query=fashion trend -is:retweet&tweet.fields=created_at,public_metrics,author_id&user.fields=username,public_metrics',
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
      posted_at: tweet.created_at,
      // ... map other fields
    }))
    */
    
    // Return mock data for now
    return generateMockPosts('twitter', 7)
  } catch (error) {
    console.error('Error collecting Twitter posts:', error)
    return []
  }
}

function generateMockPosts(platform: string, count: number): SocialPost[] {
  const posts: SocialPost[] = []
  const hashtags = [
    '#fashion', '#style', '#ootd', '#fashionista', '#streetstyle',
    '#vintage', '#sustainable', '#fashionweek', '#trendy', '#outfit'
  ]
  
  const contents = [
    'Check out this amazing new style!',
    'Obsessed with this trend',
    'Fashion inspo for your feed',
    'Street style spotted',
    'Vintage vibes only',
    'Sustainable fashion is the future',
    'Today\'s outfit details',
    'Fashion week highlights',
    'Trending now',
    'Style of the day'
  ]

  for (let i = 0; i < count; i++) {
    const followerCount = Math.floor(Math.random() * 50000) + 1000
    const likes = Math.floor(Math.random() * followerCount * 0.1)
    const shares = Math.floor(Math.random() * likes * 0.1)
    const comments = Math.floor(Math.random() * likes * 0.05)
    
    posts.push({
      platform,
      post_id: `${platform}_${Date.now()}_${i}`,
      user_id: `user_${Math.floor(Math.random() * 10000)}`,
      username: `fashionuser${Math.floor(Math.random() * 1000)}`,
      follower_count: followerCount,
      content: contents[Math.floor(Math.random() * contents.length)],
      image_urls: [`https://example.com/image${i}.jpg`],
      hashtags: hashtags.slice(0, Math.floor(Math.random() * 5) + 1),
      mentions: Math.floor(Math.random() * 10),
      likes,
      shares,
      comments,
      posted_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return posts
}

async function detectFashionItems(content: string, hashtags: string[]): Promise<string[]> {
  // In production, this would use NLP and computer vision
  // to detect fashion items mentioned or shown in posts
  
  const detectedItems: string[] = []
  const fashionKeywords = [
    'dress', 'shirt', 'pants', 'shoes', 'jacket',
    'bag', 'accessories', 'jewelry', 'watch', 'sunglasses'
  ]

  // Check content for fashion keywords
  const lowerContent = content.toLowerCase()
  for (const keyword of fashionKeywords) {
    if (lowerContent.includes(keyword)) {
      // In production, would look up actual item IDs from database
      detectedItems.push(`item_${keyword}_${Math.floor(Math.random() * 100)}`)
    }
  }

  // Check hashtags
  for (const tag of hashtags) {
    const lowerTag = tag.toLowerCase()
    for (const keyword of fashionKeywords) {
      if (lowerTag.includes(keyword) && !detectedItems.some(item => item.includes(keyword))) {
        detectedItems.push(`item_${keyword}_${Math.floor(Math.random() * 100)}`)
      }
    }
  }

  return detectedItems
}

async function updateTrendScores(supabase: any, posts: SocialPost[]) {
  // Calculate trend updates based on new social data
  
  // Group posts by detected items
  const itemEngagement: Record<string, number> = {}
  const itemMentions: Record<string, number> = {}
  
  for (const post of posts) {
    if (post.detected_items) {
      for (const itemId of post.detected_items) {
        itemEngagement[itemId] = (itemEngagement[itemId] || 0) + (post.engagement_rate || 0)
        itemMentions[itemId] = (itemMentions[itemId] || 0) + 1
      }
    }
  }

  // Update trend scores for items with significant engagement
  for (const [itemId, mentions] of Object.entries(itemMentions)) {
    if (mentions > 2) { // Only update if mentioned multiple times
      const avgEngagement = itemEngagement[itemId] / mentions
      
      // Calculate new trend score (simplified formula)
      const trendScore = Math.min(
        0.3 + (mentions * 0.05) + (avgEngagement * 10),
        1.0
      )

      // Update trend in database
      const { error } = await supabase
        .from('trends')
        .update({
          trend_score: trendScore,
          social_mentions: mentions,
          engagement_rate: avgEngagement,
          updated_at: new Date().toISOString()
        })
        .eq('item_id', itemId)

      if (error) {
        console.error(`Error updating trend for item ${itemId}:`, error)
      }
    }
  }
}

function generateCollectionSummary(posts: SocialPost[]) {
  const summary = {
    total_posts: posts.length,
    platforms: {} as Record<string, number>,
    top_hashtags: [] as { tag: string; count: number }[],
    avg_engagement: 0,
    time_range: {
      earliest: '',
      latest: ''
    }
  }

  // Count by platform
  for (const post of posts) {
    summary.platforms[post.platform] = (summary.platforms[post.platform] || 0) + 1
  }

  // Calculate average engagement
  const totalEngagement = posts.reduce((sum, post) => sum + (post.engagement_rate || 0), 0)
  summary.avg_engagement = posts.length > 0 ? totalEngagement / posts.length : 0

  // Find top hashtags
  const hashtagCounts: Record<string, number> = {}
  for (const post of posts) {
    if (post.hashtags) {
      for (const tag of post.hashtags) {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
      }
    }
  }
  
  summary.top_hashtags = Object.entries(hashtagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }))

  // Find time range
  if (posts.length > 0) {
    const dates = posts.map(p => new Date(p.posted_at).getTime()).sort()
    summary.time_range.earliest = new Date(dates[0]).toISOString()
    summary.time_range.latest = new Date(dates[dates.length - 1]).toISOString()
  }

  return summary
}