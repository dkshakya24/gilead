'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

interface Source {
  url: string
  title: string
  description: string
}

interface SourcesPanelProps {
  sources?: Source[]
  isVisible?: boolean
}

export function SourcesPanel({
  sources = [],
  isVisible = true
}: SourcesPanelProps) {
  const [showAll, setShowAll] = useState(false)

  if (!isVisible || sources.length === 0) {
    return null
  }

  const displayedSources = showAll ? sources : sources.slice(0, 4)
  const hasMoreSources = sources.length > 4

  return (
    <div className="space-y-2 border-l-2 border-primary/20 pl-4 h-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ExternalLinkIcon className="h-4 w-4" />
        <span>Source References</span>
      </div>
      <div
        className={`space-y-2 ${!showAll && hasMoreSources ? 'max-h-[400px]' : ''}`}
      >
        {displayedSources.map((source, index) => (
          <Card
            key={index}
            className="p-2 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-sm line-clamp-1">
                  {source.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {source.description}
                </p>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>
      {hasMoreSources && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUpIcon className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-3 w-3 mr-1" />
              Show All ({sources.length - 4} more)
            </>
          )}
        </Button>
      )}
    </div>
  )
}
