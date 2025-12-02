'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, Plus, Star, ExternalLink,
  Instagram, Youtube, Twitter, ChevronDown, Loader2,
  SlidersHorizontal, X, Check
} from 'lucide-react'

// Simulated service data
const mockServices = [
  { id: 1, provider: 'SMMKing', providerId: 'SK', service: 'Instagram Followers [Real] [Refill 30D]', price: 0.45, min: 100, max: 100000, avgTime: '2h', category: 'instagram' },
  { id: 2, provider: 'BoostPanel', providerId: 'BP', service: 'Instagram Followers [HQ] [No Drop]', price: 0.52, min: 50, max: 50000, avgTime: '4h', category: 'instagram' },
  { id: 3, provider: 'SocialPro', providerId: 'SP', service: 'Instagram Followers [Premium] [Lifetime]', price: 0.38, min: 100, max: 200000, avgTime: '1h', category: 'instagram' },
  { id: 4, provider: 'MediaBoost', providerId: 'MB', service: 'Instagram Followers [Fast] [Instant Start]', price: 0.61, min: 100, max: 75000, avgTime: '30m', category: 'instagram' },
  { id: 5, provider: 'SMMKing', providerId: 'SK', service: 'YouTube Views [Real] [Retention 70%]', price: 0.89, min: 500, max: 1000000, avgTime: '6h', category: 'youtube' },
  { id: 6, provider: 'ViewsHub', providerId: 'VH', service: 'YouTube Views [Premium] [High Retention]', price: 1.20, min: 1000, max: 500000, avgTime: '12h', category: 'youtube' },
  { id: 7, provider: 'TikTokPro', providerId: 'TP', service: 'TikTok Likes [Real] [Fast]', price: 0.25, min: 50, max: 50000, avgTime: '15m', category: 'tiktok' },
  { id: 8, provider: 'SocialPro', providerId: 'SP', service: 'TikTok Followers [HQ] [No Drop]', price: 0.75, min: 100, max: 100000, avgTime: '2h', category: 'tiktok' },
]

const categories = [
  { id: 'all', label: 'All Services', icon: Search },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'twitter', label: 'Twitter', icon: Twitter },
  { id: 'tiktok', label: 'TikTok', icon: Search },
]

const priceRanges = [
  { id: 'all', label: 'All Prices' },
  { id: '0-0.5', label: '$0 - $0.50' },
  { id: '0.5-1', label: '$0.50 - $1.00' },
  { id: '1-5', label: '$1.00 - $5.00' },
  { id: '5+', label: '$5.00+' },
]

export default function SearchServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'provider'>('price')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [results, setResults] = useState(mockServices)
  const [searchTime, setSearchTime] = useState(0)

  // Simulate search with debounce
  const performSearch = useCallback(() => {
    setIsLoading(true)
    const startTime = performance.now()

    // Simulate API call
    setTimeout(() => {
      let filtered = mockServices

      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(s => s.category === selectedCategory)
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(s =>
          s.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.provider.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Filter by price range
      if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-').map(Number)
        if (max) {
          filtered = filtered.filter(s => s.price >= min && s.price < max)
        } else {
          filtered = filtered.filter(s => s.price >= min)
        }
      }

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price
        if (sortBy === 'name') return a.service.localeCompare(b.service)
        return a.provider.localeCompare(b.provider)
      })

      setResults(filtered)
      setSearchTime(Math.round(performance.now() - startTime))
      setIsLoading(false)
    }, 100)
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  useEffect(() => {
    const debounce = setTimeout(performSearch, 200)
    return () => clearTimeout(debounce)
  }, [performSearch])

  const toggleServiceSelection = (id: number) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Search Services</h1>
          <p className="text-gray-600 mt-1">Search across 3 million+ services from 2,500+ providers</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedServices.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add to List ({selectedServices.length})
            </motion.button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        {/* Main Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services... (e.g., Instagram followers, YouTube views)"
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all text-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border font-medium flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-200 grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'provider')}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="name">Service Name</option>
                    <option value="provider">Provider</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <select className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                    <option>All Providers</option>
                    <option>SMMKing</option>
                    <option>BoostPanel</option>
                    <option>SocialPro</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Results Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {results.length.toLocaleString()} services found
            </span>
            <span className="text-sm text-gray-500">
              in {searchTime}ms
            </span>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}
          </div>
          <button
            onClick={() => setSelectedServices(
              selectedServices.length === results.length ? [] : results.map(r => r.id)
            )}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {selectedServices.length === results.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedServices.length === results.length && results.length > 0}
                    onChange={() => setSelectedServices(
                      selectedServices.length === results.length ? [] : results.map(r => r.id)
                    )}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Min/Max</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((service, i) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedServices.includes(service.id) ? 'bg-purple-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleServiceSelection(service.id)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {service.providerId}
                      </div>
                      <span className="font-medium text-gray-900">{service.provider}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <div className="font-medium text-gray-900 truncate">{service.service}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">${service.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">/1K</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {service.min.toLocaleString()} - {service.max.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {service.avgTime}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Star className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing 1-{results.length} of {results.length} results
          </span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



