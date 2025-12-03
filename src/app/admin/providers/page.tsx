'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Plus, Search, Edit, Trash2, ArrowLeft, X, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function ManageProvidersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState<any>(null)
  const [fetchingProviderId, setFetchingProviderId] = useState<string | null>(null)
  const [fetchStatus, setFetchStatus] = useState<{ [key: string]: { success: boolean; message: string } }>({})
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    apiUrl: '',
    apiKey: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/admin/providers')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchProviders()
    }
  }, [status, session])

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const url = editingProvider 
        ? `/api/admin/providers/${editingProvider.id}`
        : '/api/admin/providers'
      
      const response = await fetch(url, {
        method: editingProvider ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${editingProvider ? 'update' : 'add'} provider`)
      }

      setShowAddModal(false)
      setEditingProvider(null)
      setFormData({ name: '', website: '', apiUrl: '', apiKey: '', description: '' })
      fetchProviders()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProvider = (provider: any) => {
    setEditingProvider(provider)
    setFormData({
      name: provider.name,
      website: provider.website,
      apiUrl: provider.apiUrl || '',
      apiKey: '', // Don't show API key for security
      description: provider.description || '',
    })
    setShowAddModal(true)
  }

  const handleFetchServices = async (providerId: string) => {
    setFetchingProviderId(providerId)
    setFetchStatus(prev => ({ ...prev, [providerId]: { success: false, message: 'Fetching services...' } }))

    try {
      const response = await fetch(`/api/admin/providers/${providerId}/fetch-services`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.error || 'Failed to fetch services'
        const details = data.details ? `\n${data.details}` : ''
        const suggestion = data.suggestion ? `\n\n💡 ${data.suggestion}` : ''
        throw new Error(`${errorMsg}${details}${suggestion}`)
      }

      setFetchStatus(prev => ({
        ...prev,
        [providerId]: {
          success: true,
          message: `Successfully fetched ${data.stats?.total || 0} services (${data.stats?.saved || 0} new, ${data.stats?.updated || 0} updated)`
        }
      }))

      // Refresh providers to update service count
      fetchProviders()
    } catch (err: any) {
      setFetchStatus(prev => ({
        ...prev,
        [providerId]: {
          success: false,
          message: err.message || 'Failed to fetch services'
        }
      }))
    } finally {
      setFetchingProviderId(null)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Manage Providers</h1>
                <p className="text-sm text-gray-500 mt-1">Add and manage SMM panel providers</p>
              </div>
            </div>
            <button
              onClick={() => {
                console.log('Add Provider clicked')
                setShowAddModal(true)
              }}
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Provider
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Providers List */}
        {providers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first SMM panel provider.</p>
            <button
              onClick={() => {
                console.log('Add Your First Provider clicked')
                setShowAddModal(true)
              }}
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer"
            >
              Add Your First Provider
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {providers.map((provider, i) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.website}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {provider._count?.services || 0} services in database
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFetchServices(provider.id)}
                      disabled={fetchingProviderId === provider.id}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {fetchingProviderId === provider.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Fetch Services
                    </button>
                    <button
                      onClick={() => handleEditProvider(provider)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete ${provider.name}? This will also delete all associated services.`)) {
                          try {
                            const response = await fetch(`/api/admin/providers/${provider.id}`, {
                              method: 'DELETE',
                            })
                            if (response.ok) {
                              fetchProviders()
                            } else {
                              alert('Failed to delete provider')
                            }
                          } catch (error) {
                            alert('Error deleting provider')
                          }
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Fetch Status */}
                {fetchStatus[provider.id] && (
                  <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
                    fetchStatus[provider.id].success
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {fetchStatus[provider.id].success ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <p className="text-sm">{fetchStatus[provider.id].message}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false)
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProvider ? 'Edit Provider' : 'Add New Provider'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProvider(null)
                    setError('')
                    setFormData({ name: '', website: '', apiUrl: '', apiKey: '', description: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProvider} className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Panel Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., SMMKing, BoostPanel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API URL *
                  </label>
                  <input
                    type="url"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData({ ...formData, apiUrl: e.target.value })}
                    placeholder="https://api.example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Base URL of the provider's API</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key {editingProvider ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder={editingProvider ? "Leave blank to keep current API key" : "Your API key from the provider"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    required={!editingProvider}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this provider"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setError('')
                      setFormData({ name: '', website: '', apiUrl: '', apiKey: '', description: '' })
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {editingProvider ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {editingProvider ? 'Update Provider' : 'Add Provider'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
