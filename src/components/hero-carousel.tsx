'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Play, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Autoplay from 'embla-carousel-autoplay'
import { Media, Video } from '@/types/video'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import { cn } from '@/lib/utils'

export function HeroCarousel() {
  const [featuredMedia, setFeaturedMedia] = useState<Array<Media | null>>([])
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  useEffect(() => {
    const fetchPexelsMedia = async () => {
      try {
        setLoading(true)
        // const query = 'nature' // or any dynamic value you want
        const per_page = 5 // or any dynamic value you want
        // const videosResponse = await fetch(
        //   `/api/pexels/videos/search?query=${encodeURIComponent(
        //     query
        //   )}&per_page=${per_page}`
        // )
        const videosResponse = await fetch(
          `/api/pexels/videos/popular?per_page=${per_page}`
        )
        const videosData = await videosResponse.json()
        const combinedMedia: Media[] = [
          ...videosData.videos.map((video: Video) => ({
            id: video.id,
            title: 'Featured Video',
            description:
              'Discover amazing content from talented creators around the world. Watch exclusive videos and explore trending topics.',
            duration: formatDuration(video.duration),
            image: video.image,
            url: video.url,
            author: video.user.name,
          })),
        ]

        setFeaturedMedia(combinedMedia)
      } catch (error) {
        console.error('Error fetching from Pexels:', error)
        // Fallback data in case API fails
        setFeaturedMedia([null])
      } finally {
        setLoading(false)
      }
    }

    fetchPexelsMedia()
  }, [])

  const formatDuration = (seconds: number) => {
    if (!seconds) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-muted">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-muted-foreground/20 rounded mb-4"></div>
          <div className="h-4 w-64 bg-muted-foreground/20 rounded"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <Carousel
        className="h-full"
        opts={{
          loop: true,
          align: 'start',
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          {featuredMedia
            .filter((item): item is Media => item !== null)
            .map((item, index) => (
              <CarouselItem key={item.id} className="h-full">
                <div className="relative h-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl">
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        {item.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-gray-200"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Watch Now
                        </Button>
                        <Button size="lg" variant="outline">
                          <Plus className="mr-2 h-5 w-5" />
                          Add to Watchlist
                        </Button>
                      </div>
                      <div className="mt-6 flex items-center space-x-4 text-sm text-gray-300">
                        {item.duration && (
                          <>
                            <span>{item.duration}</span>
                            <span>•</span>
                          </>
                        )}
                        {item.author && <span>By {item.author}</span>}
                        <span>•</span>
                        <span>HD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 border-none h-12 w-12" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white hover:bg-black/50 border-none h-12 w-12" />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {featuredMedia.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === current ? 'bg-white w-6' : 'bg-white/50'
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
