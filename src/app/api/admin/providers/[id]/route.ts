import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// PUT - Update provider
export async function PUT(
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
    const body = await request.json()
    const { name, website, apiUrl, apiKey, description } = body

    if (!name || !website || !apiUrl) {
      return NextResponse.json(
        { error: 'Name, website, and API URL are required' },
        { status: 400 }
      )
    }

    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const provider = await prisma.provider.update({
      where: { id: providerId },
      data: {
        name,
        slug,
        website,
        apiUrl,
        description,
      }
    })

    // Update API key if provided
    if (apiKey) {
      const userProvider = await prisma.userProvider.findFirst({
        where: {
          providerId,
          userId: session.user.id!
        }
      })

      if (userProvider) {
        await prisma.userProvider.update({
          where: { id: userProvider.id },
          data: { apiKey }
        })
      } else {
        await prisma.userProvider.create({
          data: {
            userId: session.user.id!,
            providerId: provider.id,
            apiKey,
          }
        })
      }
    }

    return NextResponse.json({ provider })
  } catch (error: any) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

// DELETE - Delete provider
export async function DELETE(
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

    await prisma.provider.delete({
      where: { id: providerId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting provider:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

