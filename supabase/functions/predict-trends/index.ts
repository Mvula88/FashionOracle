import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrendPrediction {
  item_id: string
  predicted_trend_start: Date
  predicted_peak: Date
  predicted_decline: Date
  confidence_score: number
  geographic_markets: string[]
  target_audience: {
    age_groups: string[]
    demographics: string[]
    interests: string[]
  }
  prediction_factors: {
    social_velocity: number
    influencer_adoption: number
    seasonal_relevance: number
    historical_patterns: number
    market_saturation: number
  }
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

    // Get recent social media data (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: socialPosts, error: socialError } = await supabase
      .from('social_posts')
      .select('*')
      .gte('posted_at', thirtyDaysAgo.toISOString())
      .order('engagement_rate', { ascending: false })

    if (socialError) throw socialError

    // Get current trends that need prediction updates
    const { data: currentTrends, error: trendsError } = await supabase
      .from('trends')
      .select(`
        *,
        fashion_items (*)
      `)
      .in('current_status', ['emerging', 'rising'])
      .order('trend_score', { ascending: false })
      .limit(50)

    if (trendsError) throw trendsError

    // Analyze social velocity and engagement patterns
    const socialMetrics = analyzeSocialMetrics(socialPosts || [])
    
    // Generate predictions for each trend
    const predictions: TrendPrediction[] = []
    
    for (const trend of currentTrends || []) {
      const prediction = await generateTrendPrediction(
        trend,
        socialMetrics,
        socialPosts || []
      )
      predictions.push(prediction)

      // Update trend status based on prediction
      const newStatus = determineTrendStatus(trend.trend_score, prediction.confidence_score)
      
      await supabase
        .from('trends')
        .update({
          current_status: newStatus,
          predicted_peak_date: prediction.predicted_peak,
          prediction_confidence: prediction.confidence_score,
          target_demographics: prediction.target_audience,
          updated_at: new Date().toISOString()
        })
        .eq('id', trend.id)
    }

    // Store predictions in database
    if (predictions.length > 0) {
      const { data: predictionData, error: predictionError } = await supabase
        .from('trend_predictions')
        .insert(predictions.map(p => ({
          ...p,
          predicted_trend_start: p.predicted_trend_start.toISOString(),
          predicted_peak: p.predicted_peak.toISOString(),
          predicted_decline: p.predicted_decline.toISOString(),
          created_by: 'edge_function'
        })))
        .select()

      if (predictionError) console.error('Error storing predictions:', predictionError)
    }

    // Calculate market insights
    const marketInsights = generateMarketInsights(predictions, currentTrends || [])

    return new Response(
      JSON.stringify({ 
        success: true, 
        predictions_generated: predictions.length,
        predictions: predictions.slice(0, 10), // Return top 10 predictions
        market_insights: marketInsights,
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
    console.error('Error in predict-trends function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during trend prediction' 
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

function analyzeSocialMetrics(posts: any[]) {
  const metrics = {
    total_posts: posts.length,
    avg_engagement: 0,
    trending_hashtags: {} as Record<string, number>,
    platform_distribution: {} as Record<string, number>,
    velocity: 0
  }

  if (posts.length === 0) return metrics

  let totalEngagement = 0
  const hashtagCounts: Record<string, number> = {}
  const platformCounts: Record<string, number> = {}

  for (const post of posts) {
    // Calculate engagement
    totalEngagement += post.engagement_rate || 0
    
    // Count hashtags
    if (post.hashtags && Array.isArray(post.hashtags)) {
      for (const tag of post.hashtags) {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
      }
    }
    
    // Count platforms
    if (post.platform) {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1
    }
  }

  metrics.avg_engagement = totalEngagement / posts.length
  metrics.trending_hashtags = hashtagCounts
  metrics.platform_distribution = platformCounts

  // Calculate velocity (posts per day trend)
  const sortedPosts = posts.sort((a, b) => 
    new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime()
  )
  
  if (sortedPosts.length > 1) {
    const timeSpan = new Date(sortedPosts[sortedPosts.length - 1].posted_at).getTime() - 
                     new Date(sortedPosts[0].posted_at).getTime()
    const days = timeSpan / (1000 * 60 * 60 * 24)
    metrics.velocity = posts.length / (days || 1)
  }

  return metrics
}

async function generateTrendPrediction(
  trend: any,
  socialMetrics: any,
  socialPosts: any[]
): Promise<TrendPrediction> {
  // Calculate prediction factors
  const factors = {
    social_velocity: calculateSocialVelocity(trend, socialPosts),
    influencer_adoption: calculateInfluencerAdoption(trend, socialPosts),
    seasonal_relevance: calculateSeasonalRelevance(trend.fashion_items),
    historical_patterns: 0.5, // Placeholder - would use historical data
    market_saturation: calculateMarketSaturation(trend)
  }

  // Calculate confidence score based on factors
  const confidence = 
    factors.social_velocity * 0.3 +
    factors.influencer_adoption * 0.25 +
    factors.seasonal_relevance * 0.2 +
    factors.historical_patterns * 0.15 +
    (1 - factors.market_saturation) * 0.1

  // Predict timeline based on current momentum
  const now = new Date()
  const trendStart = new Date(now)
  trendStart.setDate(trendStart.getDate() + Math.floor(Math.random() * 14 + 7)) // 7-21 days

  const peak = new Date(trendStart)
  peak.setDate(peak.getDate() + Math.floor(30 + (confidence * 60))) // 30-90 days after start

  const decline = new Date(peak)
  decline.setDate(decline.getDate() + Math.floor(45 + (Math.random() * 45))) // 45-90 days after peak

  return {
    item_id: trend.fashion_items?.id || trend.item_id,
    predicted_trend_start: trendStart,
    predicted_peak: peak,
    predicted_decline: decline,
    confidence_score: confidence,
    geographic_markets: determineGeographicMarkets(trend, socialPosts),
    target_audience: {
      age_groups: ['18-24', '25-34', '35-44'],
      demographics: ['urban', 'suburban'],
      interests: ['fashion', 'lifestyle', 'social media']
    },
    prediction_factors: factors
  }
}

function calculateSocialVelocity(trend: any, posts: any[]): number {
  // Calculate how fast the trend is spreading on social media
  const relevantPosts = posts.filter(p => 
    p.detected_items?.includes(trend.item_id) ||
    p.content?.toLowerCase().includes(trend.fashion_items?.category?.toLowerCase())
  )
  
  if (relevantPosts.length === 0) return 0.1
  
  // Calculate growth rate
  const recentPosts = relevantPosts.filter(p => {
    const postDate = new Date(p.posted_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return postDate > weekAgo
  })
  
  const growthRate = recentPosts.length / (relevantPosts.length || 1)
  return Math.min(growthRate, 1)
}

function calculateInfluencerAdoption(trend: any, posts: any[]): number {
  // Check if influencers are adopting the trend
  const influencerThreshold = 10000 // followers
  const influencerPosts = posts.filter(p => 
    p.follower_count > influencerThreshold &&
    (p.detected_items?.includes(trend.item_id) ||
     p.content?.toLowerCase().includes(trend.fashion_items?.category?.toLowerCase()))
  )
  
  // Normalize to 0-1 range
  return Math.min(influencerPosts.length / 10, 1)
}

function calculateSeasonalRelevance(fashionItem: any): number {
  if (!fashionItem?.season) return 0.5
  
  const currentMonth = new Date().getMonth()
  const season = fashionItem.season.toLowerCase()
  
  const seasonMonths = {
    'spring': [2, 3, 4],
    'summer': [5, 6, 7],
    'fall': [8, 9, 10],
    'autumn': [8, 9, 10],
    'winter': [11, 0, 1],
    'all-season': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
  
  const relevantMonths = seasonMonths[season] || [currentMonth]
  return relevantMonths.includes(currentMonth) ? 0.9 : 0.3
}

function calculateMarketSaturation(trend: any): number {
  // Calculate how saturated the market is
  // Lower saturation = more growth potential
  const currentScore = trend.trend_score || 0
  const mentions = trend.social_mentions || 0
  
  // Normalize mentions (assuming 10000+ is saturated)
  const mentionSaturation = Math.min(mentions / 10000, 1)
  
  // Combine with trend score
  return (currentScore + mentionSaturation) / 2
}

function determineTrendStatus(trendScore: number, confidence: number): string {
  const combined = (trendScore + confidence) / 2
  
  if (combined > 0.8) return 'trending'
  if (combined > 0.6) return 'rising'
  if (combined > 0.4) return 'emerging'
  if (combined > 0.2) return 'declining'
  return 'faded'
}

function determineGeographicMarkets(trend: any, posts: any[]): string[] {
  // Analyze geographic origin from social posts
  // In production, would use geolocation data
  const markets = ['North America', 'Europe', 'Asia']
  
  // For now, return top markets based on trend score
  if (trend.trend_score > 0.7) {
    return markets
  } else if (trend.trend_score > 0.4) {
    return markets.slice(0, 2)
  }
  return [markets[0]]
}

function generateMarketInsights(predictions: TrendPrediction[], trends: any[]) {
  const insights = {
    emerging_categories: [] as string[],
    declining_categories: [] as string[],
    peak_season: '',
    top_markets: [] as string[],
    confidence_avg: 0,
    total_trends_analyzed: trends.length
  }

  // Identify emerging and declining categories
  const categoryScores: Record<string, number[]> = {}
  
  for (const trend of trends) {
    const category = trend.fashion_items?.category
    if (category) {
      if (!categoryScores[category]) categoryScores[category] = []
      categoryScores[category].push(trend.trend_score)
    }
  }

  // Calculate average scores per category
  for (const [category, scores] of Object.entries(categoryScores)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    if (avg > 0.6) {
      insights.emerging_categories.push(category)
    } else if (avg < 0.3) {
      insights.declining_categories.push(category)
    }
  }

  // Calculate average confidence
  if (predictions.length > 0) {
    insights.confidence_avg = 
      predictions.reduce((sum, p) => sum + p.confidence_score, 0) / predictions.length
  }

  // Determine peak season
  const months = predictions.map(p => p.predicted_peak.getMonth())
  const monthCounts = months.reduce((acc, month) => {
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  const peakMonth = Object.entries(monthCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0]
  
  if (peakMonth !== undefined) {
    const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 
                    'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter']
    insights.peak_season = seasons[parseInt(peakMonth)]
  }

  // Get top markets
  const allMarkets = predictions.flatMap(p => p.geographic_markets)
  const marketCounts = allMarkets.reduce((acc, market) => {
    acc[market] = (acc[market] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  insights.top_markets = Object.entries(marketCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([market]) => market)

  return insights
}