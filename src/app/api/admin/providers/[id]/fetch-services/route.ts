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

    // Fetch services from provider API
    // Most SMM panels use similar API endpoints
    const apiUrl = provider.apiUrl?.endsWith('/') 
      ? `${provider.apiUrl}api/services` 
      : `${provider.apiUrl}/api/services`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userProvider.apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Try alternative API formats
      const altUrl = provider.apiUrl?.endsWith('/')
        ? `${provider.apiUrl}api/v2/services`
        : `${provider.apiUrl}/api/v2/services`
      
      const altResponse = await fetch(altUrl, {
        method: 'GET',
        headers: {
          'API-Key': userProvider.apiKey,
          'Content-Type': 'application/json',
        },
      })

      if (!altResponse.ok) {
        return NextResponse.json(
          { error: `Failed to fetch services: ${altResponse.statusText}` },
          { status: altResponse.status }
        )
      }

      const services = await altResponse.json()
      return await saveServices(providerId, services)
    }

    const services = await response.json()
    return await saveServices(providerId, services)
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
      const serviceData = {
        providerId,
        serviceId: String(service.id || service.service || service.service_id),
        name: service.name || service.service || service.title || 'Unknown Service',
        category: service.category || service.type || 'other',
        type: service.type || null,
        rate: parseFloat(service.rate || service.price || service.cost || 0),
        minQuantity: parseInt(service.min || service.min_quantity || service.min_amount || 0),
        maxQuantity: parseInt(service.max || service.max_quantity || service.max_amount || 999999999),
        description: service.description || null,
        refill: Boolean(service.refill || service.refill_guarantee || false),
        cancel: Boolean(service.cancel || service.cancel_guarantee || false),
        dripfeed: Boolean(service.dripfeed || service.drip_feed || false),
        avgTime: service.avg_time || service.average_time || service.time || null,
        isActive: Boolean(service.status === 'active' || service.active !== false),
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

