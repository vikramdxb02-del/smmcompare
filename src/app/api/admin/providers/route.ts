import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Fetch all providers
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const providers = await prisma.provider.findMany({
      include: {
        _count: {
          select: { services: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ providers })
  } catch (error: any) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

// POST - Create a new provider
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, website, apiUrl, apiKey, description } = body

    if (!name || !website || !apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Name, website, API URL, and API key are required' },
        { status: 400 }
      )
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const provider = await prisma.provider.create({
      data: {
        name,
        slug,
        website,
        apiUrl,
        description,
      }
    })

    // Store API key in a secure way (you might want to encrypt this)
    // For now, we'll store it in UserProvider table for the admin user
    await prisma.userProvider.create({
      data: {
        userId: session.user.id!,
        providerId: provider.id,
        apiKey,
      }
    })

    return NextResponse.json({ provider }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
