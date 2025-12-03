import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// POST - Fetch services from provider API
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const providerId = params.id

    // Get provider and API key
    const provider = await prisma.provider.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Get API key from UserProvider (admin's connection)
    const userProvider = await prisma.userProvider.findFirst({
      where: {
        providerId,
        userId: session.user.id!
      }
    })

    if (!userProvider || !userProvider.apiKey) {
      return NextResponse.json(
        { error: 'API key not found for this provider' },
        { status: 400 }
      )
    }

    // Try multiple common SMM panel API endpoint patterns
    if (!provider.apiUrl) {
      return NextResponse.json(
        { error: 'Provider API URL is not set' },
        { status: 400 }
      )
    }

    const apiBase = provider.apiUrl.endsWith('/') 
      ? provider.apiUrl.slice(0, -1)
      : provider.apiUrl

    // Remove /api from base if it exists to avoid doubling
    const cleanBase = apiBase.replace(/\/api\/?$/, '')

    const endpoints = [
      // Yoyomedia format: /api with key and action parameters
      { url: `${cleanBase}/api?key=${userProvider.apiKey}&action=services`, method: 'GET' },
      { url: `${cleanBase}/api`, method: 'POST', body: { key: userProvider.apiKey, action: 'services' } },
      
      // Standard REST API formats
      { url: `${cleanBase}/api/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` } },
      { url: `${cleanBase}/api/v2/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey } },
      { url: `${cleanBase}/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey } },
      { url: `${cleanBase}/api/v1/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` } },
      { url: `${cleanBase}/api/service/list`, method: 'GET', headers: { 'API-Key': userProvider.apiKey } },
      
      // With query parameters
      { url: `${cleanBase}/api/services?key=${userProvider.apiKey}`, method: 'GET' },
      { url: `${cleanBase}/api/services?api_key=${userProvider.apiKey}`, method: 'GET' },
    ]

    let lastError: any = null

    for (const endpointConfig of endpoints) {
      try {
        const baseHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
        
        const customHeaders = endpointConfig.headers || {}
        const headers: Record<string, string> = {
          ...baseHeaders,
          ...Object.fromEntries(
            Object.entries(customHeaders).filter(([_, v]) => v !== undefined) as [string, string][]
          ),
        }

        const fetchOptions: RequestInit = {
          method: endpointConfig.method || 'GET',
          headers,
        }

        // Add body for POST requests
        if (endpointConfig.method === 'POST' && endpointConfig.body) {
          fetchOptions.body = JSON.stringify(endpointConfig.body)
        }

        const response = await fetch(endpointConfig.url, fetchOptions)

        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
          continue
        }

        // Check if response is JSON
        const contentType = response.headers.get('content-type')
        const text = await response.text()
        
        if (!contentType || !contentType.includes('application/json')) {
          if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            lastError = new Error(`API returned HTML instead of JSON. Tried: ${endpointConfig.url}`)
            continue
          }
        }

        // Try to parse as JSON
        let services
        try {
          services = JSON.parse(text)
        } catch {
          lastError = new Error(`Invalid JSON response from: ${endpointConfig.url}`)
          continue
        }
        
        // Handle different response formats
        // Some APIs return { data: [...] } or { services: [...] }
        if (services.data && Array.isArray(services.data)) {
          services = services.data
        } else if (services.services && Array.isArray(services.services)) {
          services = services.services
        } else if (services.result && Array.isArray(services.result)) {
          services = services.result
        }
        
        // Validate services array
        if (!Array.isArray(services)) {
          lastError = new Error(`Expected array of services, got: ${typeof services}. Response: ${text.substring(0, 200)}`)
          continue
        }

        return await saveServices(providerId, services)
      } catch (error: any) {
        lastError = error
        continue
      }
    }

    // If all endpoints failed
    return NextResponse.json(
      { 
        error: `Failed to fetch services from provider API. ${lastError?.message || 'All endpoints failed. Please check your API URL and key.'}`,
        details: `Tried endpoints: ${endpoints.join(', ')}`
      },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services from provider API' },
      { status: 500 }
    )
  }
}

async function saveServices(providerId: string, services: any[]) {
  let saved = 0
  let updated = 0
  let errors = 0

  for (const service of services) {
    try {
      // Map common SMM panel API formats to our schema
      // Support Yoyomedia format: Category, name, services/service, rate, min, max, type
      const serviceData = {
        providerId,
        serviceId: String(service.id || service.service || service.service_id || service.services || ''),
        name: service.name || service.service || service.title || 'Unknown Service',
        category: service.Category || service.category || service.type || 'other',
        type: service.type || service.Type || null,
        rate: parseFloat(service.rate || service.price || service.cost || 0),
        minQuantity: parseInt(service.min || service.min_quantity || service.min_amount || 0),
        maxQuantity: parseInt(service.max || service.max_quantity || service.max_amount || 999999999),
        description: service.description || service.Description || null,
        refill: Boolean(service.refill || service.refill_guarantee || service.Refill || false),
        cancel: Boolean(service.cancel || service.cancel_guarantee || service.Cancel || false),
        dripfeed: Boolean(service.dripfeed || service.drip_feed || service.Dripfeed || false),
        avgTime: service.avg_time || service.average_time || service.time || service.Time || null,
        isActive: Boolean(service.status === 'active' || service.active !== false || service.status !== 'inactive'),
      }

      await prisma.service.upsert({
        where: {
          providerId_serviceId: {
            providerId,
            serviceId: serviceData.serviceId,
          }
        },
        update: serviceData,
        create: serviceData,
      })

      if (serviceData.isActive) {
        saved++
      } else {
        updated++
      }
    } catch (error) {
      console.error('Error saving service:', error)
      errors++
    }
  }

  return NextResponse.json({
    success: true,
    message: `Fetched ${services.length} services`,
    stats: {
      saved,
      updated,
      errors,
      total: services.length,
    }
  })
}

