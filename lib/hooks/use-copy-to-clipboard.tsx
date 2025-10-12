'use client'

import * as React from 'react'

export interface useCopyToClipboardProps {
  timeout?: number
}

// Function to convert markdown to HTML
function markdownToHtml(text: string): string {
  return (
    text
      // Convert headers
      .replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
      .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
      .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Convert code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Convert images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      // Convert strikethrough
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Convert blockquotes
      .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
      // Convert unordered lists
      .replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
      // Convert ordered lists
      .replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>')
      // Convert horizontal rules
      .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '<hr>')
      // Convert line breaks
      .replace(/\n/g, '<br>')
  )
}

// Function to strip markdown formatting
function stripMarkdown(text: string): string {
  return (
    text
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove images
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Remove strikethrough
      .replace(/~~(.*?)~~/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
  )
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }

    if (!value) {
      return
    }

    // Convert markdown to HTML and copy as rich text
    const htmlContent = markdownToHtml(value)

    // Create a temporary element to copy rich text
    const tempElement = document.createElement('div')
    tempElement.innerHTML = htmlContent

    // Try to copy as rich text first, fallback to plain text
    if (navigator.clipboard.write) {
      navigator.clipboard
        .write([
          new ClipboardItem({
            'text/html': new Blob([tempElement.innerHTML], {
              type: 'text/html'
            }),
            'text/plain': new Blob([stripMarkdown(value)], {
              type: 'text/plain'
            })
          })
        ])
        .then(() => {
          setIsCopied(true)
          setTimeout(() => {
            setIsCopied(false)
          }, timeout)
        })
        .catch(() => {
          // Fallback to plain text if rich text copying fails
          navigator.clipboard.writeText(stripMarkdown(value)).then(() => {
            setIsCopied(true)
            setTimeout(() => {
              setIsCopied(false)
            }, timeout)
          })
        })
    } else {
      // Fallback for older browsers
      navigator.clipboard.writeText(stripMarkdown(value)).then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      })
    }
  }

  return { isCopied, copyToClipboard }
}
