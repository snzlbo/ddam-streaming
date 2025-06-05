'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Eye, Plus, Check, Play } from 'lucide-react'
import Image from 'next/image'
import { Media } from '@/types/video'

interface VideoCardProps {
  video: Media
  showProgress?: boolean
}

export function VideoCard({ video, showProgress = false }: VideoCardProps) {
  const [isWatchLater, setIsWatchLater] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if video is in watch later list
    const watchLaterList = JSON.parse(
      localStorage.getItem('watchLater') || '[]'
    )
    setIsWatchLater(watchLaterList.includes(video.id))

    // Get video progress if showing progress
    if (showProgress) {
      const continueWatching = JSON.parse(
        localStorage.getItem('continueWatching') || '{}'
      )
      const videoProgress = continueWatching[video.id]
      if (videoProgress) {
        setProgress(videoProgress.progress)
      }
    }
  }, [video.id, showProgress])

  const toggleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation()
    const watchLaterList = JSON.parse(
      localStorage.getItem('watchLater') || '[]'
    )

    if (isWatchLater) {
      // Remove from watch later
      const updatedList = watchLaterList.filter((id: number) => id !== video.id)
      localStorage.setItem('watchLater', JSON.stringify(updatedList))
      setIsWatchLater(false)
    } else {
      // Add to watch later
      const updatedList = [...watchLaterList, video.id]
      localStorage.setItem('watchLater', JSON.stringify(updatedList))
      setIsWatchLater(true)
    }
  }

  const handleVideoClick = () => {
    // Simulate video watching - in real app this would be actual video progress
    const randomProgress = Math.floor(Math.random() * 80) + 10 // 10-90% progress
    const continueWatching = JSON.parse(
      localStorage.getItem('continueWatching') || '{}'
    )

    continueWatching[video.id] = {
      ...video,
      progress: randomProgress,
      lastWatched: new Date().toISOString(),
    }

    localStorage.setItem('continueWatching', JSON.stringify(continueWatching))

    // In a real app, this would navigate to the video player
    console.log(`Playing video: ${video.title}`)
  }

  return (
    <Card className="w-80 flex-shrink-0 group cursor-pointer hover:scale-105 transition-transform duration-200 py-0">
      <CardContent className="p-0">
        <div className="relative" onClick={handleVideoClick}>
          <Image
            src={video.image || '/placeholder.svg'}
            alt={video.title}
            width={320}
            height={180}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          {/* Progress bar for continue watching */}
          {showProgress && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <div
                className="h-full bg-red-600 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Red line indicator at the end */}
                <div className="absolute right-0 top-0 w-0.5 h-full bg-red-500 shadow-lg" />
              </div>
            </div>
          )}

          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {video.duration}
          </Badge>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-t-lg">
            <Button
              size="icon"
              className="bg-white/90 text-black hover:bg-white rounded-full h-12 w-12"
            >
              <Play className="h-6 w-6 ml-0.5" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {video.title}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-8 w-8 flex-shrink-0"
              onClick={toggleWatchLater}
            >
              {isWatchLater ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-1">{video.author}</p>
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {video.views}
            </div>
            <span>•</span>
            <span>{video.uploadedAt}</span>
          </div>

          {/* Progress text for continue watching */}
          {showProgress && progress > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {progress}% watched
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
