'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Download, Plus, Star, ExternalLink,
  Instagram, Youtube, Twitter, ChevronDown, Loader2,
  SlidersHorizontal, X, Check
} from 'lucide-react'


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
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [searchTime, setSearchTime] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  // Fetch services from API
  const performSearch = useCallback(async () => {
    setIsLoading(true)
    const startTime = performance.now()

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: selectedCategory,
        priceRange: selectedPriceRange,
        sortBy: sortBy,
        page: '1',
        limit: '1000', // Get all results for now
      })

      const response = await fetch(`/api/services/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data.services || [])
        setTotalResults(data.total || 0)
        setSearchTime(Math.round(performance.now() - startTime))
      } else {
        console.error('Error fetching services:', data.error)
        setResults([])
        setTotalResults(0)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setResults([])
      setTotalResults(0)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  // Load services on mount and when filters change
  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch()
    }, 200)
    return () => clearTimeout(debounce)
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  const toggleServiceSelection = (id: string) => {
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
              {totalResults.toLocaleString()} services found
            </span>
            <span className="text-sm text-gray-500">
              in {searchTime}ms
            </span>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}
          </div>
          {results.length > 0 && (
            <button
              onClick={() => setSelectedServices(
                selectedServices.length === results.length ? [] : results.map(r => r.id)
              )}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {selectedServices.length === results.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                    <p className="text-gray-500 mt-2">Loading services...</p>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500">No services found. Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                results.map((service, i) => (
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
                        {service.description && (
                          <div className="text-sm text-gray-500 truncate mt-1">{service.description}</div>
                        )}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {results.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing 1-{results.length} of {totalResults.toLocaleString()} results
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
        )}
      </div>
    </div>
  )
}




