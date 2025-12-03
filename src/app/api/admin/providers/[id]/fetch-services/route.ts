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
        { error: 'API key not found for this provider. Please edit the provider and add your API key.' },
        { status: 400 }
      )
    }

    console.log(`Fetching services for provider: ${provider.name}, API URL: ${provider.apiUrl}, Has API Key: ${!!userProvider.apiKey}`)

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

    // Remove /api, /api/v2, /api/v1 from base if it exists to avoid doubling
    const cleanBase = apiBase.replace(/\/api(\/v\d+)?\/?$/, '')

    // Build endpoints - Based on Yoyomedia PHP code: POST to /api/v2 with form-encoded data
    // The PHP code shows: api_url = 'https://yoyomedia.in/api/v2'
    // Method: POST with form-encoded body: key=API_KEY&action=services
    const endpoints = [
      // Yoyomedia official format: POST to /api/v2 with form-encoded data (CORRECT FORMAT)
      { url: `${cleanBase}/api/v2`, method: 'POST', body: { key: userProvider.apiKey, action: 'services' }, formData: true, priority: 1 },
      
      // Fallback: Try /api/v2 with different parameter names
      { url: `${cleanBase}/api/v2`, method: 'POST', body: { api_key: userProvider.apiKey, action: 'services' }, formData: true, priority: 2 },
      
      // Fallback: Try /api (without v2)
      { url: `${cleanBase}/api`, method: 'POST', body: { key: userProvider.apiKey, action: 'services' }, formData: true, priority: 3 },
      { url: `${cleanBase}/api`, method: 'POST', body: { api_key: userProvider.apiKey, action: 'services' }, formData: true, priority: 4 },
      
      // GET with query parameters (less common but some APIs support this)
      { url: `${cleanBase}/api/v2?key=${encodeURIComponent(userProvider.apiKey)}&action=services`, method: 'GET', priority: 5 },
      { url: `${cleanBase}/api?key=${encodeURIComponent(userProvider.apiKey)}&action=services`, method: 'GET', priority: 6 },
      
      // Standard REST API formats (fallback only)
      { url: `${cleanBase}/api/services?key=${encodeURIComponent(userProvider.apiKey)}`, method: 'GET', priority: 7 },
      { url: `${cleanBase}/api/services?api_key=${encodeURIComponent(userProvider.apiKey)}`, method: 'GET', priority: 8 },
      { url: `${cleanBase}/api/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` }, priority: 9 },
      { url: `${cleanBase}/api/v2/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey }, priority: 10 },
      { url: `${cleanBase}/services`, method: 'GET', headers: { 'API-Key': userProvider.apiKey }, priority: 11 },
      { url: `${cleanBase}/api/v1/services`, method: 'GET', headers: { 'Authorization': `Bearer ${userProvider.apiKey}` }, priority: 12 },
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
        const trimmedText = text.trim()
        const contentType = response.headers.get('content-type') || ''

        // Check if response is clearly HTML
        const isHTML = trimmedText.startsWith('<!DOCTYPE') || 
                      trimmedText.startsWith('<html') || 
                      trimmedText.startsWith('<HTML') ||
                      trimmedText.startsWith('<?xml')

        // Always try to parse as JSON first (even if status is not OK, some APIs return error as JSON)
        let services
        let jsonParseError = null
        
        // Log the response for debugging
        console.log(`Response from ${endpointConfig.url}: Status=${response.status}, Content-Type=${contentType}, Length=${text.length}, First 100 chars: ${trimmedText.substring(0, 100)}`)
        
        try {
          services = JSON.parse(text)
          // Successfully parsed as JSON!
          console.log(`✅ Successfully parsed JSON! Got ${Array.isArray(services) ? services.length : 'object'} items`)
        } catch (parseError: any) {
          jsonParseError = parseError
          
          // If it's clearly HTML, try to extract error message
          if (isHTML) {
            // Try to extract error message from HTML
            let errorMessage = 'API returned HTML instead of JSON'
            const titleMatch = trimmedText.match(/<title>(.*?)<\/title>/i)
            const errorMatch = trimmedText.match(/error[^>]*>([^<]+)/i) || trimmedText.match(/Error:?\s*([^<\n]+)/i)
            
            if (titleMatch) {
              errorMessage = `API Error: ${titleMatch[1]}`
            } else if (errorMatch) {
              errorMessage = `API Error: ${errorMatch[1].trim()}`
            }
            
            // Check if it's an authentication error
            if (trimmedText.toLowerCase().includes('invalid') || trimmedText.toLowerCase().includes('unauthorized') || trimmedText.toLowerCase().includes('api key')) {
              errorMessage = 'Invalid API key or authentication failed. Please check your API key.'
            }
            
            if (endpointConfig.url.includes('action=services')) {
              console.log(`❌ Yoyomedia format returned HTML. Status: ${response.status}, Error: ${errorMessage}`)
              lastError = new Error(`${errorMessage}. Status: ${response.status}. This usually means the API key is wrong or the endpoint format is incorrect.`)
            } else {
              lastError = new Error(`${errorMessage}. Status: ${response.status}`)
            }
            continue
          }
          
          // Not HTML but also not valid JSON - show the actual error
          console.error(`❌ JSON parse error for ${endpointConfig.url}:`, parseError.message)
          console.error(`Response text (first 1000 chars):`, trimmedText.substring(0, 1000))
          lastError = new Error(`Invalid JSON response. Status: ${response.status}, Parse Error: ${parseError.message}, Response preview: ${trimmedText.substring(0, 300)}`)
          continue
        }

        // If response is not OK but we got JSON, it might be an error response
        if (!response.ok) {
          if (services && typeof services === 'object') {
            lastError = new Error(`API Error (${response.status}): ${services.error || services.message || JSON.stringify(services)}`)
          } else {
            lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          continue
        }

        // Successfully parsed JSON and response is OK!
        
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

    // If all endpoints failed, return detailed error
    return NextResponse.json(
      { 
        error: `Failed to fetch services from provider API. ${lastError?.message || 'All endpoints failed. Please check your API URL and key.'}`,
        details: `Tried ${triedEndpoints.length} endpoints. First tried: ${triedEndpoints[0]}`,
        allEndpoints: triedEndpoints.slice(0, 5), // Show first 5 for debugging
        suggestion: 'Check Vercel function logs for detailed response information. Make sure your API URL is exactly: https://yoyomedia.in (no /api at the end)'
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

