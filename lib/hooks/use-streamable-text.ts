// import { StreamableValue, readStreamableValue } from 'ai/rsc'
import { useEffect, useState } from 'react'

export const useStreamableText = (content: any) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : ''
  )
  useEffect(() => {
    ;(async () => {
      let value = ''
      for await (const msg of content) {
        if (typeof msg.message === 'string') {
          setRawContent((value = value + msg.message))
        }
      }
    })()
  }, [content])

  return rawContent
}
