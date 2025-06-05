import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { VideoCard } from '@/components/video-card'
import { Media } from '@/types/video'

interface VideoSectionProps {
  title: string
  videos: Media[]
}

export function VideoSection({ title, videos }: VideoSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
