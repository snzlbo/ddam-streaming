interface VideoFile {
  id: number
  quality: string
  file_type: string
  width: number
  height: number
  fps: number
  link: string
}

interface VideoPicture {
  id: number
  picture: string
  nr: number
}

export interface Video {
  id: number
  width: number
  height: number
  url: string
  image: string
  tags: []
  duration: number
  user: {
    id: number
    name: string
    url: string
  }
  video_files: VideoFile[]
  video_pictures: VideoPicture[]
}

export interface Media extends Video {
  author?: string
  title: string
  description: string
  uploadedAt?: string
  views?: string
}
