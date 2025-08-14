import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImageAnalyzer from '@/components/fashion/ImageAnalyzer'
import TrendingDashboard from '@/components/trends/TrendingDashboard'
import { Camera, TrendingUp, Search, BarChart3 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg"></div>
              <h1 className="text-xl font-bold text-gray-900">Fashion Oracle</h1>
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="#analyze" className="text-gray-600 hover:text-gray-900">Analyze</a>
              <a href="#trends" className="text-gray-600 hover:text-gray-900">Trends</a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
              <form action="/auth/signout" method="post">
                <button className="text-gray-600 hover:text-gray-900">Sign Out</button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to Fashion Oracle</h2>
          <p className="text-purple-100 max-w-2xl">
            Discover trending fashion items, analyze styles with AI, and stay ahead of the fashion curve.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Active Trends</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Items Analyzed</p>
                  <p className="text-2xl font-bold">1.2K</p>
                </div>
                <Camera className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Predictions Made</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Accuracy Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <Search className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Analyzer Section */}
        <section id="analyze" className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analyze Fashion Items</h2>
            <p className="text-gray-600 mt-2">
              Upload an image to identify fashion items and get trend predictions
            </p>
          </div>
          <ImageAnalyzer />
        </section>

        {/* Trending Items Section */}
        <section id="trends" className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-600 mt-2">
              Discover what's trending in fashion right now
            </p>
          </div>
          <TrendingDashboard />
        </section>
      </main>
    </div>
  )
}