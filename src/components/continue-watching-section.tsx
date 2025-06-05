'use client'

import { useState, useEffect } from 'react'
import { VideoCard } from '@/components/video-card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { Media } from '@/types/video'

export function ContinueWatchingSection() {
  const [continueWatchingVideos, setContinueWatchingVideos] = useState<Media[]>(
    []
  )

  useEffect(() => {
    const loadContinueWatching = () => {
      const continueWatching = JSON.parse(
        localStorage.getItem('continueWatching') || '{}'
      )
      const videos = Object.values(continueWatching) as Media[]
      setContinueWatchingVideos(videos)
    }

    loadContinueWatching()

    // Listen for storage changes to update the list
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'continueWatching') {
        loadContinueWatching()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events from the same tab
    const handleCustomUpdate = () => loadContinueWatching()
    window.addEventListener('continueWatchingUpdated', handleCustomUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('continueWatchingUpdated', handleCustomUpdate)
    }
  }, [])

  const clearContinueWatching = () => {
    localStorage.removeItem('continueWatching')
    setContinueWatchingVideos([])
  }

  const removeVideo = (videoId: number) => {
    const continueWatching = JSON.parse(
      localStorage.getItem('continueWatching') || '{}'
    )
    delete continueWatching[videoId]
    localStorage.setItem('continueWatching', JSON.stringify(continueWatching))

    setContinueWatchingVideos((prev) =>
      prev.filter((video) => video.id !== videoId)
    )
  }

  if (continueWatchingVideos.length === 0) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Continue Watching</h2>
        <Button variant="outline" size="sm" onClick={clearContinueWatching}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {continueWatchingVideos.map((video) => (
            <div key={video.id} className="relative">
              <VideoCard video={video} showProgress={true} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                  removeVideo(video.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
