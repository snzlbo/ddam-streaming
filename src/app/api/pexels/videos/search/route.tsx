import { NextResponse } from 'next/server'

export async function GET(searchParams: { query: string; per_page?: string }) {
  const { query, per_page = '10' } = searchParams
  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${query}&per_page=${per_page}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || '',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`Pexels API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching videos from Pexels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
