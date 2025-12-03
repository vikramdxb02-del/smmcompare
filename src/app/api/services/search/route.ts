import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Search services
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || 'all'
    const priceRange = searchParams.get('priceRange') || 'all'
    const sortBy = searchParams.get('sortBy') || 'price'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    // Filter by category
    if (category !== 'all') {
      where.category = category
    }

    // Filter by search query
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { provider: { name: { contains: query, mode: 'insensitive' } } },
      ]
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      if (max !== undefined && !isNaN(max)) {
        where.rate = { gte: min, lte: max }
      } else {
        where.rate = { gte: min }
      }
    }

    // Build orderBy
    let orderBy: any = {}
    if (sortBy === 'price') {
      orderBy = { rate: 'asc' }
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' }
    } else if (sortBy === 'provider') {
      orderBy = { provider: { name: 'asc' } }
    }

    // Get services with provider info
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ])

    // Transform services to match UI format
    const formattedServices = services.map((service) => ({
      id: service.id,
      serviceId: service.serviceId,
      provider: service.provider.name,
      providerId: service.provider.slug.toUpperCase().substring(0, 2),
      providerSlug: service.provider.slug,
      service: service.name,
      price: service.rate,
      min: service.minQuantity,
      max: service.maxQuantity,
      avgTime: service.avgTime || 'N/A',
      category: service.category,
      description: service.description,
      refill: service.refill,
      cancel: service.cancel,
      dripfeed: service.dripfeed,
    }))

    return NextResponse.json({
      services: formattedServices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error('Error searching services:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search services' },
      { status: 500 }
    )
  }
}

