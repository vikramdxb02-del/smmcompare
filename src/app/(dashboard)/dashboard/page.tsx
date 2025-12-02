'use client'

import { motion } from 'framer-motion'
import { 
  Database, List, LinkIcon, ShoppingCart, TrendingUp, Bell,
  ArrowUpRight, ArrowDownRight, Plus, Eye, ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    label: 'Providers',
    value: '2,408',
    change: '+12',
    changeType: 'increase',
    icon: Database,
    href: '/dashboard/providers',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    label: 'Lists',
    value: '7',
    change: '+2',
    changeType: 'increase',
    icon: List,
    href: '/dashboard/lists',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Orders',
    value: '156',
    change: '+23',
    changeType: 'increase',
    icon: ShoppingCart,
    href: '/dashboard/orders',
    gradient: 'from-emerald-500 to-teal-500',
  },
]

const recentLists = [
  { name: 'Instagram Followers [HQ]', services: 12, orders: 45, updated: '2 hours ago' },
  { name: 'YouTube Views [Fast]', services: 8, orders: 23, updated: '5 hours ago' },
  { name: 'TikTok Likes [Real]', services: 15, orders: 67, updated: '1 day ago' },
  { name: 'Twitter Followers', services: 6, orders: 12, updated: '2 days ago' },
]

const balanceAlerts = [
  { provider: 'SMMKing', balance: '$12.50', status: 'low', logo: 'SK' },
  { provider: 'BoostPanel', balance: '$145.00', status: 'ok', logo: 'BP' },
  { provider: 'SocialPro', balance: '$0.00', status: 'empty', logo: 'SP' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your SMM services today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={stat.href}
              className="block bg-white rounded-2xl p-6 shadow-card hover-lift group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 mt-1 flex items-center gap-2">
                  {stat.label}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Lists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Lists</h2>
            <Link href="/dashboard/lists" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLists.map((list, i) => (
              <div key={list.name} className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <List className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{list.name}</div>
                    <div className="text-sm text-gray-500">
                      {list.services} services • {list.orders} orders
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{list.updated}</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50">
            <Link
              href="/dashboard/lists/new"
              className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New List
            </Link>
          </div>
        </motion.div>

        {/* Balance Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Balance Alerts</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {balanceAlerts.map((alert) => (
              <div key={alert.provider} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {alert.logo}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{alert.provider}</div>
                    <div className={`text-sm ${
                      alert.status === 'empty' ? 'text-red-500' :
                      alert.status === 'low' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {alert.balance}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.status === 'empty' ? 'bg-red-100 text-red-700' :
                  alert.status === 'low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {alert.status === 'empty' ? 'Empty' :
                   alert.status === 'low' ? 'Low' : 'OK'}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50">
            <Link
              href="/dashboard/providers"
              className="flex items-center justify-center gap-2 py-3 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Provider
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Search Services', icon: Database, href: '/dashboard/search', gradient: 'from-violet-500 to-purple-500' },
          { label: 'Create List', icon: List, href: '/dashboard/lists/new', gradient: 'from-blue-500 to-cyan-500' },
          { label: 'View Orders', icon: ShoppingCart, href: '/dashboard/orders', gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Analytics', icon: TrendingUp, href: '/dashboard/analytics', gradient: 'from-pink-500 to-rose-500' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-card hover-lift"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900">{action.label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}




