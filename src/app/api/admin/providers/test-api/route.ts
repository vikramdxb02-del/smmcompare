import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET - Test API call to see actual response
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const apiUrl = searchParams.get('apiUrl')
    const apiKey = searchParams.get('apiKey')

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'apiUrl and apiKey are required' },
        { status: 400 }
      )
    }

    // Clean the API URL
    const cleanBase = apiUrl.replace(/\/api\/?$/, '')
    const testUrl = `${cleanBase}/api?key=${encodeURIComponent(apiKey)}&action=services`

    console.log(`Testing API: ${testUrl}`)

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const text = await response.text()
    const contentType = response.headers.get('content-type') || ''

    // Try to parse as JSON
    let jsonData = null
    let parseError = null
    try {
      jsonData = JSON.parse(text)
    } catch (error: any) {
      parseError = error.message
    }

    return NextResponse.json({
      url: testUrl,
      status: response.status,
      statusText: response.statusText,
      contentType,
      responseLength: text.length,
      firstChars: text.substring(0, 500),
      isHTML: text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html'),
      looksLikeJSON: text.trim().startsWith('[') || text.trim().startsWith('{'),
      jsonParseSuccess: jsonData !== null,
      jsonParseError: parseError,
      parsedData: jsonData ? (Array.isArray(jsonData) ? `Array with ${jsonData.length} items` : 'Object') : null,
      sampleData: jsonData && Array.isArray(jsonData) ? jsonData.slice(0, 2) : jsonData,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

