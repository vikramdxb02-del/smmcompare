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

    // Build endpoints - Yoyomedia format FIRST
    const endpoints = [
      // Yoyomedia format: /api with key and action parameters (MUST BE FIRST)
      { url: `${cleanBase}/api?key=${encodeURIComponent(userProvider.apiKey)}&action=services`, method: 'GET' },
      { url: `${cleanBase}/api`, method: 'POST', body: { key: userProvider.apiKey, action: 'services' }, formData: true },
      { url: `${cleanBase}/api`, method: 'POST', body: { key: userProvider.apiKey, action: 'services' }, formData: false },
      
      // Alternative Yoyomedia formats
      { url: `${cleanBase}/api?api_key=${encodeURIComponent(userProvider.apiKey)}&action=services`, method: 'GET' },
      { url: `${cleanBase}/api`, method: 'POST', body: { api_key: userProvider.apiKey, action: 'services' }, formData: true },
      
      // Standard REST API formats (fallback only)
      { url: `${cleanBase}/api/services?key=${encodeURIComponent(userProvider.apiKey)}`, method: 'GET' },
      { url: `${cleanBase}/api/services?api_key=${encodeURIComponent(userProvider.apiKey)}`, method: 'GET' },
      { url: `${cleanBase}/api/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` } },
      { url: `${cleanBase}/api/v2/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey } },
      { url: `${cleanBase}/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey } },
      { url: `${cleanBase}/api/v1/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` } },
    ]

    let lastError: any = null
    const triedEndpoints: string[] = []

    for (const endpointConfig of endpoints) {
      triedEndpoints.push(endpointConfig.url)
      
      try {
        // Determine content type based on formData flag
        const isFormData = (endpointConfig as any).formData === true
        
        const baseHeaders: Record<string, string> = {
          'Accept': 'application/json',
        }
        
        // Set Content-Type based on whether it's form data or JSON
        if (endpointConfig.method === 'POST') {
          if (isFormData) {
            baseHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
          } else {
            baseHeaders['Content-Type'] = 'application/json'
          }
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
          if (isFormData) {
            // Convert to URL-encoded form data
            const formData = new URLSearchParams()
            Object.entries(endpointConfig.body).forEach(([key, value]) => {
              formData.append(key, String(value))
            })
            fetchOptions.body = formData.toString()
          } else {
            fetchOptions.body = JSON.stringify(endpointConfig.body)
          }
        }

        console.log(`Trying endpoint: ${endpointConfig.method || 'GET'} ${endpointConfig.url}`)
        const response = await fetch(endpointConfig.url, fetchOptions)

        // Get response text first
        const text = await response.text()
        const contentType = response.headers.get('content-type') || ''

        // Check if response is clearly HTML (error page) - be more lenient
        const isHTML = text.trim().startsWith('<!DOCTYPE') || 
                      text.trim().startsWith('<html') || 
                      text.trim().startsWith('<HTML') ||
                      (contentType.includes('text/html') && !text.trim().startsWith('[') && !text.trim().startsWith('{'))

        if (isHTML) {
          if (endpointConfig.url.includes('action=services')) {
            // This is the Yoyomedia format - log more details
            console.log(`Yoyomedia format returned HTML. Status: ${response.status}, Content-Type: ${contentType}, First 200 chars: ${text.substring(0, 200)}`)
            lastError = new Error(`Yoyomedia API returned HTML. Check your API key and URL. Status: ${response.status}`)
          } else {
            lastError = new Error(`API returned HTML instead of JSON. Status: ${response.status}`)
          }
          continue
        }

        if (!response.ok) {
          // Even if not OK, try to parse as JSON (some APIs return error as JSON)
          try {
            const errorJson = JSON.parse(text)
            lastError = new Error(`API Error: ${errorJson.error || errorJson.message || JSON.stringify(errorJson)}`)
          } catch {
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${text.substring(0, 200)}`)
          }
          continue
        }

        // Try to parse as JSON - be more lenient, try even if content-type doesn't say JSON
        let services
        try {
          services = JSON.parse(text)
        } catch (parseError) {
          // If it starts with [ or {, it might be JSON but with syntax error
          if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
            console.error(`JSON parse error for ${endpointConfig.url}:`, parseError)
            console.error(`Response text (first 500 chars):`, text.substring(0, 500))
            lastError = new Error(`Invalid JSON format. First 200 chars: ${text.substring(0, 200)}`)
          } else {
            lastError = new Error(`Response is not JSON. First 200 chars: ${text.substring(0, 200)}`)
          }
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
        details: `Tried ${triedEndpoints.length} endpoints. First tried: ${triedEndpoints[0]}`,
        allEndpoints: triedEndpoints.slice(0, 5) // Show first 5 for debugging
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

