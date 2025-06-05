'use client'
import { CategorySection } from '@/components/category-section'
import { ContinueWatchingSection } from '@/components/continue-watching-section'
import { Header } from '@/components/header'
import { HeroCarousel } from '@/components/hero-carousel'
import { TracingBeam } from '@/components/ui/tracing-beam'
import { VideoSection } from '@/components/video-section'
import { Media, Video } from '@/types/video'
import {
  Aperture,
  Book,
  Film,
  Ghost,
  Heart,
  Smile,
  TheaterIcon,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const categories = [
  {
    name: 'Action',
    count: '1.5K movies',
    src: '/categories/action.png',
    icon: <Zap />,
  },
  {
    name: 'Comedy',
    count: '2.3K movies',
    src: '/categories/comedy.png',
    icon: <Smile />,
  },
  {
    name: 'Drama',
    count: '1.8K movies',
    src: '/categories/drama.png',
    icon: <TheaterIcon />,
  },
  {
    name: 'Horror',
    count: '1.1K movies',
    src: '/categories/horror.png',
    icon: <Ghost />,
  },
  {
    name: 'Sci-Fi',
    count: '900 movies',
    src: '/categories/scifi.png',
    icon: <Aperture />,
  },
  {
    name: 'Romance',
    count: '2.5K movies',
    src: '/categories/romance.png',
    icon: <Heart />,
  },
  {
    name: 'Documentary',
    count: '700 movies',
    src: '/categories/documentary.png',
    icon: <Book />,
  },
  {
    name: 'Anime',
    count: '1.2K animes',
    src: '/categories/anime.png',
    icon: <Film />,
  },
]
const dummies = [
  {
    title: 'The Future of AI',
    description:
      'Explore the advancements and impact of artificial intelligence in modern society.',
    views: '2.1M',
  },
  {
    title: 'Amazing Nature Documentary',
    description:
      'A breathtaking journey through the wonders of the natural world.',
    uploadedAt: '1 week ago',
  },
  {
    title: 'Cooking Masterclass',
    description: 'Learn gourmet recipes and cooking techniques from top chefs.',
    uploadedAt: '3 days ago',
  },
  {
    title: 'Space Exploration 2024',
    description:
      'Discover the latest missions and discoveries in space exploration.',
    uploadedAt: '5 days ago',
  },
  {
    title: 'Music Production Tips',
    description: 'Essential tips and tricks for aspiring music producers.',
    uploadedAt: '1 day ago',
  },
  {
    title: 'Ultimate Fitness Guide',
    description:
      'Your complete guide to achieving fitness goals and healthy living.',
    uploadedAt: '2 days ago',
  },
  {
    title: 'Travel Vlog: Japan Adventure',
    description:
      'Experience the culture, food, and sights of Japan in this travel vlog.',
    views: '980K',
  },
  {
    title: 'Beginner Yoga Routine',
    description: 'A gentle yoga routine perfect for beginners.',
    uploadedAt: '4 days ago',
  },
  {
    title: 'Top 10 Coding Tricks',
    description: 'Boost your productivity with these top coding tricks.',
    views: '1.3M',
  },
  {
    title: 'Wildlife Photography Secrets',
    description: 'Professional tips for capturing stunning wildlife photos.',
    uploadedAt: '6 days ago',
  },
]

export default function HomePage() {
  const [trendingVideos, setTrendingVideos] = useState<Array<Media | null>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPexelsMedia = async () => {
      try {
        setLoading(true)
        const query = 'anime' // or any dynamic value you want
        const per_page = 5 // or any dynamic value you want
        const videosResponse = await fetch(
          `/api/pexels/videos/search?query=${encodeURIComponent(
            query
          )}&per_page=${per_page}`
        )
        const videosData = await videosResponse.json()
        const combinedMedia: Media[] = [
          ...videosData.videos.map((video: Video, index: number) => ({
            id: video.id,
            title: dummies[index]?.title ?? '',
            description: dummies[index]?.description ?? '',
            duration: formatDuration(video.duration),
            image: video.image,
            url: video.url,
            views: `${(Math.random() * 9 + 1).toFixed(1)}k`,
            author: video.user.name,
          })),
        ]
        console.log('🚀 ~ fetchPexelsMedia ~ combinedMedia:', combinedMedia)
        setTrendingVideos(combinedMedia)
      } catch (error) {
        console.error('Error fetching from Pexels:', error)
        setTrendingVideos([null])
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <TracingBeam className="px-6">
          <ContinueWatchingSection />
          <VideoSection
            title="Trending Now"
            videos={trendingVideos.filter((v): v is Media => v !== null)}
          />
          <CategorySection categories={categories} />
          <VideoSection
            title="Trending Now"
            videos={trendingVideos.filter((v): v is Media => v !== null)}
          />
        </TracingBeam>
      </main>
    </div>
  )
}
