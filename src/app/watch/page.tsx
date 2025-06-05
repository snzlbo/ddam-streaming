'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { VideoPlayer } from '@/components/video-player'
import { VideoDetails } from '@/components/video-details'
import { CommentsSection } from '@/components/comments-section'
import { RelatedVideos } from '@/components/related-videos'
import { Header } from '@/components/header'
import { Skeleton } from '@/components/ui/skeleton'
import { Media } from '@/types/video'

function WatchPageContent() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('id')
  const [videoData, setVideoData] = useState<Media | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided')
      setLoading(false)
      return
    }

    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/pexels/videos/get?query=${encodeURIComponent(videoId)}`
        )
        // const response = await fetch(`/api/pexels/videos/get/${videoId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch video')
        }

        const data = await response.json()
        setVideoData(data)

        // Update continue watching
        const continueWatching = JSON.parse(
          localStorage.getItem('continueWatching') || '{}'
        )
        continueWatching[videoId] = {
          id: Number.parseInt(videoId),
          title: data.title,
          image: data.image,
          duration: formatDuration(data.duration),
          views: data.views,
          uploadedAt: data.uploadedAt,
          author: data.author,
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [videoId])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
            <p className="text-muted-foreground">
              {error || "The video you're looking for doesn't exist."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer videoData={videoData} />
            <VideoDetails videoData={videoData} />
            <CommentsSection videoId={Number.parseInt(videoId!)} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RelatedVideos id={Number.parseInt(videoId!)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="w-full aspect-video rounded-lg" />
          </div>
        </div>
      }
    >
      <WatchPageContent />
    </Suspense>
  )
}
