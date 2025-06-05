'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThumbsUp, ThumbsDown, Reply, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Comment {
  id: number
  author: {
    name: string
    avatar: string
  }
  content: string
  timestamp: string
  likes: number
  dislikes: number
  replies: Comment[]
}

interface CommentsSectionProps {
  videoId: number
}

export function CommentsSection({ videoId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/videos/${videoId}/comments`)
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
        // Fallback to mock comments
        setComments(mockComments)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [videoId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: '/placeholder-user.jpg',
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      dislikes: 0,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment('')

    // In a real app, you'd send this to your API
    try {
      await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      })
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes
    }
    return 0 // Keep original order for newest
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('newest')}
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'popular' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('popular')}
          >
            Popular
          </Button>
        </div>
      </div>

      {/* Add Comment */}
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" alt="You" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setNewComment('')}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const [showReplies, setShowReplies] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [likes, setLikes] = useState(comment.likes)
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
    null
  )

  const handleLike = () => {
    if (userReaction === 'like') {
      setLikes(likes - 1)
      setUserReaction(null)
    } else {
      setLikes(likes + 1)
      setUserReaction('like')
    }
  }

  const handleReply = () => {
    if (!replyText.trim()) return
    // In a real app, you'd add the reply to the comment
    setReplyText('')
    setIsReplying(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author.avatar || '/placeholder.svg'}
            alt={comment.author.name}
          />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${
                  userReaction === 'like' ? 'bg-primary/10' : ''
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                {likes > 0 && <span className="text-xs">{likes}</span>}
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Block user</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="flex space-x-3 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="You" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder={`Reply to ${comment.author.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-blue-600"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
              </Button>
              {showReplies && (
                <div className="space-y-3 ml-6 border-l-2 border-muted pl-4">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'This is an amazing video! Really well explained and easy to follow. Thanks for sharing!',
    timestamp: '2 hours ago',
    likes: 24,
    dislikes: 1,
    replies: [
      {
        id: 2,
        author: {
          name: 'Jane Smith',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        content: 'I totally agree! The quality is outstanding.',
        timestamp: '1 hour ago',
        likes: 5,
        dislikes: 0,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    author: {
      name: 'Mike Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'Could you make a follow-up video about advanced techniques? This was really helpful!',
    timestamp: '4 hours ago',
    likes: 12,
    dislikes: 0,
    replies: [],
  },
  {
    id: 4,
    author: {
      name: 'Sarah Wilson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    content:
      'Great content as always! Keep up the excellent work. Looking forward to more videos like this.',
    timestamp: '6 hours ago',
    likes: 8,
    dislikes: 0,
    replies: [],
  },
]
