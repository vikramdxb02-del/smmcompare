'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Database, BarChart3, Settings, Shield, LogOut,
  TrendingUp, Activity, AlertCircle, CheckCircle, XCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalServices: 0,
    totalOrders: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/admin')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Link
            href="/dashboard"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go to Dashboard →
          </Link>
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
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your SMMCompare platform</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.email}
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Providers', value: stats.totalProviders, icon: Database, color: 'purple' },
            { label: 'Services', value: stats.totalServices, icon: BarChart3, color: 'green' },
            { label: 'Orders', value: stats.totalOrders, icon: Activity, color: 'orange' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Manage Users', icon: Users, href: '/admin/users', color: 'blue' },
            { title: 'Manage Providers', icon: Database, href: '/admin/providers', color: 'purple' },
            { title: 'View Analytics', icon: BarChart3, href: '/admin/analytics', color: 'green' },
            { title: 'System Settings', icon: Settings, href: '/admin/settings', color: 'gray' },
            { title: 'Security', icon: Shield, href: '/admin/security', color: 'red' },
            { title: 'Reports', icon: TrendingUp, href: '/admin/reports', color: 'orange' },
          ].map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={action.href}
                className="block bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 flex items-center justify-center mb-4`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500">Click to manage</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

