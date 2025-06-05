'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import Image from 'next/image'

export const CustomCard = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: {
      name: string
      count: string
      src: string
      icon: React.JSX.Element
    }
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
  }) => (
    <Card
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'rounded-lg relative overflow-hidden h-40 md:h-48 w-full transition-all duration-300 ease-out flex flex-col justify-between',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98]'
      )}
    >
      <Image
        src={card.src}
        alt={card.name}
        fill
        className="object-cover absolute inset-0 w-full h-full"
        priority
      />
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex flex-row space-x-4 items-center text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted">
            {card.icon}
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-srcs">
            {card.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {card.count}
          </Badge>
        </div>
      </div>
    </Card>
  )
)

CustomCard.displayName = 'CustomCard'

type Card = {
  name: string
  count: string
  src: string
  icon: React.JSX.Element
}

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {cards.map((card, index) => (
        <CustomCard
          key={index}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  )
}
