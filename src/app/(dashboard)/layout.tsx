'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, LayoutDashboard, Search, List, LinkIcon, Database,
  BarChart3, Bell, Settings, LogOut, Menu, X, ChevronDown,
  User, CreditCard, HelpCircle, Moon, Sun
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Search Services', href: '/dashboard/search', icon: Search },
  { name: 'Lists', href: '/dashboard/lists', icon: List },
  { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
  { name: 'Providers', href: '/dashboard/providers', icon: Database },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const bottomNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-gray-900">SMMCompare</span>
            </Link>
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-gray-100 space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Pro Badge */}
          <div className="px-4 pb-4">
            <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white">
              <div className="text-sm font-medium mb-1">Pro Plan</div>
              <div className="text-xs text-purple-200 mb-3">15 of 30 days left</div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div className="bg-white rounded-full h-1.5 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services... (⌘K)"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Currency */}
              <button className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                <span>$</span>
                <span>USD</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    JD
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-500">john@example.com</div>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link href="/dashboard/billing" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <CreditCard className="w-4 h-4" />
                          Billing
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}


