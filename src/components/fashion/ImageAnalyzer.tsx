'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, Camera, X, TrendingUp, Tag } from 'lucide-react'
import Image from 'next/image'

interface AnalysisResult {
  item: {
    id: string
    name: string
    category: string
    colors: string[]
    patterns: string[]
    confidence: number
  }
  analysis: {
    trendScore: number
    similarItems: any[]
    recommendations: string[]
  }
}

export default function ImageAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Create image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Analyze image
    await analyzeImage(file)
  }

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true)
    
    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fashion-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fashion-images')
        .getPublicUrl(fileName)

      // For now, create mock data since Edge Functions aren't set up yet
      // In production, this would call the Edge Function
      const mockResult: AnalysisResult = {
        item: {
          id: crypto.randomUUID(),
          name: 'Analyzed Fashion Item',
          category: 'dress',
          colors: ['black', 'white'],
          patterns: ['solid'],
          confidence: 0.85
        },
        analysis: {
          trendScore: 0.75,
          similarItems: [],
          recommendations: [
            'This style is trending in urban markets',
            'Popular among 18-35 age group',
            'Expected to peak in 2-3 months'
          ]
        }
      }

      setResult(mockResult)

      // Store in database
      const { data: itemData, error: itemError } = await supabase
        .from('fashion_items')
        .insert({
          name: mockResult.item.name,
          category: mockResult.item.category,
          colors: mockResult.item.colors,
          patterns: mockResult.item.patterns,
          image_urls: [publicUrl]
        })
        .select()
        .single()

      if (itemError) console.error('Error storing item:', itemError)

    } catch (error) {
      console.error('Error analyzing image:', error)
      alert('Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImagePreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!imagePreview ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
            dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Upload a fashion image
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Choose Image
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <Camera className="h-4 w-4" />
            <span>Supports JPG, PNG, WebP up to 10MB</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            <button
              onClick={resetAnalysis}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="relative h-96 w-full">
              <Image
                src={imagePreview}
                alt="Uploaded fashion image"
                fill
                className="object-contain"
              />
            </div>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <p className="mt-3 text-sm font-medium">Analyzing fashion item...</p>
                </div>
              </div>
            )}
          </div>

          {result && !isAnalyzing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-purple-600" />
                  Item Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p className="font-medium capitalize">{result.item.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Colors</span>
                    <div className="flex gap-2 mt-1">
                      {result.item.colors.map((color) => (
                        <span
                          key={color}
                          className="px-2 py-1 bg-gray-100 rounded-md text-sm capitalize"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Confidence</span>
                    <p className="font-medium">{(result.item.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trend Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Trend Score</span>
                    <div className="mt-1 flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${result.analysis.trendScore * 100}%` }}
                        />
                      </div>
                      <span className="ml-3 font-medium">
                        {(result.analysis.trendScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Insights</span>
                    <ul className="mt-1 space-y-1">
                      {result.analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}