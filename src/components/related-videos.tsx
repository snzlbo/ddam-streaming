'use client'

import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/video-card'
import { Media } from '@/types/video'

export function RelatedVideos({ id }: { id: number }) {
  const [relatedVideos, setRelatedVideos] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        setLoading(true)
        const query = 'anime'
        const per_page = 5
        const response = await fetch(
          `/api/pexels/videos/search?query=${encodeURIComponent(
            query
          )}&per_page=${per_page}`
        )
        if (response.ok) {
          const data = await response.json()
          setRelatedVideos(data.videos)
        }
      } catch (error) {
        console.error('Error fetching related videos:', error)
        // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedVideos()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Related Videos</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4 mb-1" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 flex flex-col max-h-[80dvh] overflow-y-auto">
      <h3 className="text-lg font-semibold">Related Videos</h3>
      <div className="space-y-4">
        {relatedVideos.map((video) => (
          <div
            key={video.id}
            className="cursor-pointer"
            onClick={() => (window.location.href = `/watch?id=${video.id}`)}
          >
            <VideoCard video={video} showDescription={false} />
          </div>
        ))}
      </div>
    </div>
  )
}
