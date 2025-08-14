export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          style_preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          style_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          style_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      fashion_items: {
        Row: {
          id: string
          name: string
          category: string
          subcategory: string | null
          brand: string | null
          colors: string[] | null
          patterns: string[] | null
          materials: string[] | null
          price_range: string | null
          season: string | null
          gender: string | null
          image_urls: string[] | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          subcategory?: string | null
          brand?: string | null
          colors?: string[] | null
          patterns?: string[] | null
          materials?: string[] | null
          price_range?: string | null
          season?: string | null
          gender?: string | null
          image_urls?: string[] | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          subcategory?: string | null
          brand?: string | null
          colors?: string[] | null
          patterns?: string[] | null
          materials?: string[] | null
          price_range?: string | null
          season?: string | null
          gender?: string | null
          image_urls?: string[] | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trends: {
        Row: {
          id: string
          item_id: string | null
          trend_score: number
          prediction_confidence: number | null
          current_status: 'emerging' | 'rising' | 'trending' | 'declining' | 'faded' | null
          predicted_peak_date: string | null
          actual_peak_date: string | null
          geographic_origin: string | null
          target_demographics: Json | null
          social_mentions: number
          engagement_rate: number | null
          influencer_adoptions: number
          retail_availability: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          item_id?: string | null
          trend_score: number
          prediction_confidence?: number | null
          current_status?: 'emerging' | 'rising' | 'trending' | 'declining' | 'faded' | null
          predicted_peak_date?: string | null
          actual_peak_date?: string | null
          geographic_origin?: string | null
          target_demographics?: Json | null
          social_mentions?: number
          engagement_rate?: number | null
          influencer_adoptions?: number
          retail_availability?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          item_id?: string | null
          trend_score?: number
          prediction_confidence?: number | null
          current_status?: 'emerging' | 'rising' | 'trending' | 'declining' | 'faded' | null
          predicted_peak_date?: string | null
          actual_peak_date?: string | null
          geographic_origin?: string | null
          target_demographics?: Json | null
          social_mentions?: number
          engagement_rate?: number | null
          influencer_adoptions?: number
          retail_availability?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          platform: string
          post_id: string
          user_id: string | null
          username: string | null
          follower_count: number | null
          content: string | null
          image_urls: string[] | null
          hashtags: string[] | null
          mentions: number
          likes: number
          shares: number
          comments: number
          engagement_rate: number | null
          posted_at: string | null
          analyzed_at: string
          detected_items: string[] | null
        }
        Insert: {
          id?: string
          platform: string
          post_id: string
          user_id?: string | null
          username?: string | null
          follower_count?: number | null
          content?: string | null
          image_urls?: string[] | null
          hashtags?: string[] | null
          mentions?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number | null
          posted_at?: string | null
          analyzed_at?: string
          detected_items?: string[] | null
        }
        Update: {
          id?: string
          platform?: string
          post_id?: string
          user_id?: string | null
          username?: string | null
          follower_count?: number | null
          content?: string | null
          image_urls?: string[] | null
          hashtags?: string[] | null
          mentions?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number | null
          posted_at?: string | null
          analyzed_at?: string
          detected_items?: string[] | null
        }
      }
      user_interactions: {
        Row: {
          id: string
          user_id: string | null
          item_id: string | null
          interaction_type: 'view' | 'like' | 'save' | 'share' | 'click_buy' | 'purchase' | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          item_id?: string | null
          interaction_type?: 'view' | 'like' | 'save' | 'share' | 'click_buy' | 'purchase' | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          item_id?: string | null
          interaction_type?: 'view' | 'like' | 'save' | 'share' | 'click_buy' | 'purchase' | null
          session_id?: string | null
          created_at?: string
        }
      }
      trend_predictions: {
        Row: {
          id: string
          item_id: string | null
          prediction_date: string
          predicted_trend_start: string | null
          predicted_peak: string | null
          predicted_decline: string | null
          confidence_score: number | null
          geographic_markets: string[] | null
          target_audience: Json | null
          prediction_factors: Json | null
          actual_outcome: string | null
          created_by: string
        }
        Insert: {
          id?: string
          item_id?: string | null
          prediction_date?: string
          predicted_trend_start?: string | null
          predicted_peak?: string | null
          predicted_decline?: string | null
          confidence_score?: number | null
          geographic_markets?: string[] | null
          target_audience?: Json | null
          prediction_factors?: Json | null
          actual_outcome?: string | null
          created_by?: string
        }
        Update: {
          id?: string
          item_id?: string | null
          prediction_date?: string
          predicted_trend_start?: string | null
          predicted_peak?: string | null
          predicted_decline?: string | null
          confidence_score?: number | null
          geographic_markets?: string[] | null
          target_audience?: Json | null
          prediction_factors?: Json | null
          actual_outcome?: string | null
          created_by?: string
        }
      }
      b2b_clients: {
        Row: {
          id: string
          company_name: string
          contact_email: string
          subscription_tier: 'basic' | 'premium' | 'enterprise' | null
          api_key: string | null
          monthly_request_limit: number | null
          current_usage: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_email: string
          subscription_tier?: 'basic' | 'premium' | 'enterprise' | null
          api_key?: string | null
          monthly_request_limit?: number | null
          current_usage?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_email?: string
          subscription_tier?: 'basic' | 'premium' | 'enterprise' | null
          api_key?: string | null
          monthly_request_limit?: number | null
          current_usage?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string | null
          search_query: string | null
          search_type: 'text' | 'image' | 'visual' | null
          results_found: number | null
          clicked_items: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          search_query?: string | null
          search_type?: 'text' | 'image' | 'visual' | null
          results_found?: number | null
          clicked_items?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          search_query?: string | null
          search_type?: 'text' | 'image' | 'visual' | null
          results_found?: number | null
          clicked_items?: string[] | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}