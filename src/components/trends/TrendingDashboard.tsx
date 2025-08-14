'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Clock, MapPin, Users, Star, ArrowUp, ArrowDown } from 'lucide-react'
import Image from 'next/image'

interface TrendItem {
  id: string
  fashion_items: {
    id: string
    name: string
    category: string
    brand: string | null
    image_urls: string[] | null
  } | null
  trend_score: number
  current_status: 'emerging' | 'rising' | 'trending' | 'declining' | 'faded'
  predicted_peak_date: string | null
  geographic_origin: string | null
  social_mentions: number
  engagement_rate: number | null
}

const statusColors = {
  emerging: 'bg-blue-100 text-blue-800',
  rising: 'bg-yellow-100 text-yellow-800',
  trending: 'bg-red-100 text-red-800',
  declining: 'bg-orange-100 text-orange-800',
  faded: 'bg-gray-100 text-gray-800'
}

const statusIcons = {
  emerging: '🌱',
  rising: '📈',
  trending: '🔥',
  declining: '📉',
  faded: '💤'
}

export default function TrendingDashboard() {
  const [trends, setTrends] = useState<TrendItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'rising' | 'trending'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchTrends()
  }, [filter])

  const fetchTrends = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('trends')
        .select(`
          *,
          fashion_items (
            id,
            name,
            category,
            brand,
            image_urls
          )
        `)
        .order('trend_score', { ascending: false })
        .limit(20)

      if (filter !== 'all') {
        query = query.eq('current_status', filter)
      } else {
        query = query.in('current_status', ['emerging', 'rising', 'trending'])
      }

      const { data, error } = await query

      if (error) throw error
      setTrends(data || [])
    } catch (error) {
      console.error('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendDirection = (score: number) => {
    if (score > 0.7) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (score < 0.3) return <ArrowDown className="h-4 w-4 text-red-500" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trends...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
            filter === 'all'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Trends
        </button>
        <button
          onClick={() => setFilter('rising')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
            filter === 'rising'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Rising
        </button>
        <button
          onClick={() => setFilter('trending')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm transition ${
            filter === 'trending'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Trending Now
        </button>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-100">
              {trend.fashion_items?.image_urls?.[0] ? (
                <Image
                  src={trend.fashion_items.image_urls[0]}
                  alt={trend.fashion_items.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-4xl">👗</div>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[trend.current_status]}`}>
                  <span>{statusIcons[trend.current_status]}</span>
                  {trend.current_status}
                </span>
              </div>

              {/* Trend Score */}
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white rounded-lg px-2 py-1">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {(trend.trend_score * 100).toFixed(0)}%
                  </span>
                  {getTrendDirection(trend.trend_score)}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate">
                {trend.fashion_items?.name || 'Fashion Item'}
              </h3>
              
              {trend.fashion_items?.brand && (
                <p className="text-sm text-gray-500">{trend.fashion_items.brand}</p>
              )}

              <p className="text-xs text-gray-500 mt-1 capitalize">
                {trend.fashion_items?.category || 'Uncategorized'}
              </p>

              {/* Metrics */}
              <div className="mt-3 space-y-2">
                {trend.social_mentions > 0 && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{trend.social_mentions.toLocaleString()} mentions</span>
                  </div>
                )}

                {trend.engagement_rate && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Star className="h-3 w-3 mr-1" />
                    <span>{(trend.engagement_rate * 100).toFixed(1)}% engagement</span>
                  </div>
                )}

                {trend.predicted_peak_date && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Peak: {new Date(trend.predicted_peak_date).toLocaleDateString()}</span>
                  </div>
                )}

                {trend.geographic_origin && (
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{trend.geographic_origin}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button className="mt-4 w-full py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {trends.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No trends found. Check back later!</p>
        </div>
      )}
    </div>
  )
}