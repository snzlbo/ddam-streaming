'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Flag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Media } from '@/types/video'

export function VideoDetails({ videoData }: { videoData: Media }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likes, setLikes] = useState(12543)
  const [dislikes, setDislikes] = useState(234)
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    null
  )

  useEffect(() => {
    console.log('Video data updated:', videoData)
  }, [videoData])

  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes(likes - 1)
      setUserReaction(null)
    } else {
      if (userReaction === 'dislike') {
        setDislikes(dislikes - 1)
      }
      setLikes(likes + 1)
      setUserReaction('like')
    }
  }

  const handleDislike = () => {
    if (userReaction === 'dislike') {
      setDislikes(dislikes - 1)
      setUserReaction(null)
    } else {
      if (userReaction === 'like') {
        setLikes(likes - 1)
      }
      setDislikes(dislikes + 1)
      setUserReaction('dislike')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoData.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-2xl font-bold">{videoData.title}</h1>

      {/* Video Stats and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{videoData.views} views</span>
          <span>•</span>
          <span>{videoData.uploadedAt}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-full ${
                userReaction === 'like'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {likes.toLocaleString()}
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-r-full ${
                userReaction === 'dislike'
                  ? 'bg-primary text-primary-foreground'
                  : ''
              }`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              {dislikes.toLocaleString()}
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt="You" />
            <AvatarFallback>{videoData.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{videoData.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {Math.floor(Math.random() * 1000000).toLocaleString()} subscribers
            </p>
          </div>
        </div>
        <Button
          variant={isSubscribed ? 'outline' : 'default'}
          onClick={() => setIsSubscribed(!isSubscribed)}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>

      {/* Description */}
      {/* <div className="bg-muted rounded-lg p-4">
        <div
          className={`${
            isDescriptionExpanded ? '' : 'line-clamp-3'
          } whitespace-pre-wrap`}
        >
          {videoData.description}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto"
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        >
          {isDescriptionExpanded ? (
            <>
              Show less <ChevronUp className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Show more <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div> */}

      {/* Tags */}
      {videoData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {videoData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
