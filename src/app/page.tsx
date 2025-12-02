'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Zap, Shield, TrendingUp, Database, Bell, BarChart3,
  Check, X, ChevronDown, ChevronRight, Menu, Sparkles, Globe,
  Instagram, Youtube, Twitter, ArrowRight, Star, Users, Clock,
  CreditCard, MessageCircle, Mail, Phone
} from 'lucide-react'
import Link from 'next/link'

// Sample search results for demo
const sampleResults = [
  { id: 1, provider: 'SMMKing', service: 'Instagram Followers [Real]', price: 0.45, min: 100, max: 100000 },
  { id: 2, provider: 'BoostPanel', service: 'Instagram Followers [HQ]', price: 0.52, min: 50, max: 50000 },
  { id: 3, provider: 'SocialPro', service: 'Instagram Followers [Premium]', price: 0.38, min: 100, max: 200000 },
  { id: 4, provider: 'MediaBoost', service: 'Instagram Followers [Fast]', price: 0.61, min: 100, max: 75000 },
]

const stats = [
  { label: 'SMM Panels', value: '2,500+', icon: Database },
  { label: 'Services', value: '3M+', icon: Zap },
  { label: 'Happy Users', value: '50K+', icon: Users },
  { label: 'Search Speed', value: '<50ms', icon: Clock },
]

const features = [
  {
    icon: Search,
    title: 'Lightning Search',
    description: 'Search across 3 million services in milliseconds. Our Meilisearch-powered engine delivers instant results.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Database,
    title: 'Massive Database',
    description: 'Access 2,500+ verified SMM panels. We continuously update and verify all providers.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Price Comparison',
    description: 'Compare prices across all panels instantly. Find the best deals for any service.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Bell,
    title: 'Balance Alerts',
    description: 'Get notified when your balance is low on any panel. Never miss an order again.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Track your orders, spending, and performance with beautiful visual reports.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Verified Panels',
    description: 'All panels are verified for reliability. Trust scores help you choose wisely.',
    gradient: 'from-indigo-500 to-violet-500',
  },
]

const pricing = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out',
    features: [
      { text: 'Search all services', included: true },
      { text: 'View 20 panels', included: true },
      { text: 'Basic filters', included: true },
      { text: 'Create service lists', included: false },
      { text: 'Order across panels', included: false },
      { text: 'Balance alerts', included: false },
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 14.99,
    description: 'For power users',
    features: [
      { text: 'Search all services', included: true },
      { text: 'Access all 2,500+ panels', included: true },
      { text: 'Advanced filters', included: true },
      { text: 'Unlimited service lists', included: true },
      { text: 'Order across panels', included: true },
      { text: 'Balance alerts', included: true },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49.99,
    description: 'For agencies & teams',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'API access', included: true },
      { text: 'Team members (5)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'White-label options', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'What is SMMCompare?',
    answer: 'SMMCompare is the largest SMM panel database. We aggregate services from 2,500+ SMM panels, letting you search and compare prices across all of them instantly.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Our free plan lets you search all services and view 20 panels. Pro users get a 7-day free trial with full access to all features.',
  },
  {
    question: 'How fast is the search?',
    answer: 'Our search is powered by Meilisearch, delivering results in under 50 milliseconds. You\'ll see results as you type!',
  },
  {
    question: 'Do you sell SMM services directly?',
    answer: 'No, we\'re a search and comparison platform. We help you find the best services across multiple panels, but orders are placed directly with the providers.',
  },
  {
    question: 'How are panels verified?',
    answer: 'We verify each panel\'s API, test service delivery, and monitor user feedback. Panels receive trust scores based on reliability, speed, and support quality.',
  },
  {
    question: 'Can I track orders from multiple panels?',
    answer: 'Yes! Pro users can connect their panel accounts via API and track all orders from a single dashboard.',
  },
]

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Agency Owner',
    content: 'SMMCompare saved me hours of comparing prices. Found services 30% cheaper than what I was paying!',
    avatar: 'AC',
    rating: 5,
  },
  {
    name: 'Sarah Kim',
    role: 'Social Media Manager',
    content: 'The search speed is incredible. I can find exactly what I need in seconds.',
    avatar: 'SK',
    rating: 5,
  },
  {
    name: 'Mike Johnson',
    role: 'Reseller',
    content: 'Managing orders across 10+ panels was a nightmare. SMMCompare made it effortless.',
    avatar: 'MJ',
    rating: 5,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    if (searchQuery.length > 2) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-gray-900">SMMCompare</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors animated-underline">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors animated-underline">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors animated-underline">FAQ</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Log in
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Start Free
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/50 bg-white"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
                <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#faq" className="block text-gray-600 hover:text-gray-900">FAQ</a>
                <hr className="border-gray-200" />
                <Link href="/login" className="block text-gray-600 hover:text-gray-900">Log in</Link>
                <Link 
                  href="/register" 
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-lg"
                >
                  Start Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="absolute inset-0 bg-grid" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">The #1 SMM Panel Database</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight"
            >
              Search <span className="text-gradient">3 Million+</span>
              <br />
              SMM Services Instantly
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Compare prices across 2,500+ panels. Find the cheapest services for Instagram, YouTube, TikTok, and more in milliseconds.
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 max-w-2xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-25" />
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-200 p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 px-4">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search services... (e.g., Instagram followers)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 py-4 text-lg outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Search
                    </button>
                  </div>

                  {/* Live Results Preview */}
                  <AnimatePresence>
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 border-t border-gray-100 pt-4 pb-2"
                      >
                        <div className="text-xs text-gray-500 px-4 mb-2">Found 120,571 results in 23ms</div>
                        {sampleResults.map((result, i) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <Instagram className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{result.service}</div>
                                <div className="text-sm text-gray-500">{result.provider}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">${result.price}/1K</div>
                              <div className="text-xs text-gray-500">{result.min} - {result.max.toLocaleString()}</div>
                            </div>
                          </motion.div>
                        ))}
                        <div className="text-center pt-2">
                          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            View all results →
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Trending searches */}
              <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Trending:</span>
                {['Instagram followers', 'YouTube views', 'TikTok likes', 'Twitter followers'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-3">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Features</span>
            <h2 className="mt-2 text-4xl font-display font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools to find, compare, and manage SMM services across thousands of panels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-card hover-lift cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-2 text-4xl font-display font-bold text-gray-900">Loved by thousands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Pricing</span>
            <h2 className="mt-2 text-4xl font-display font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-xl text-gray-600">Start free, upgrade when you need more.</p>

            {/* Billing Toggle */}
            <div className="mt-8 inline-flex items-center gap-4 p-1 bg-gray-200 rounded-full">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingPeriod === 'monthly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  billingPeriod === 'yearly' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
                }`}
              >
                Yearly <span className="text-emerald-600 text-sm">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular ? 'ring-2 ring-purple-600 shadow-xl' : 'shadow-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 mt-1">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      ${billingPeriod === 'yearly' ? (plan.price * 0.8).toFixed(2) : plan.price}
                    </span>
                    {plan.price > 0 && <span className="text-gray-500">/month</span>}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">FAQ</span>
            <h2 className="mt-2 text-4xl font-display font-bold text-gray-900">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            Ready to find the best SMM services?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join 50,000+ users who are already saving time and money with SMMCompare.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
          <p className="mt-6 text-purple-200 text-sm">
            No credit card required • Free plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold text-white">SMMCompare</span>
              </div>
              <p className="text-sm">The ultimate SMM panel database. Search, compare, and manage services across 2,500+ panels.</p>
              <p className="text-xs mt-2 text-gray-500">smmcompare.com</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 SMMCompare. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


