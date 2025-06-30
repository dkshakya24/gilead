import { useEffect, useRef, useState } from 'react'
import { useWebSocketStore } from '@/lib/store/websocket-store'

interface WebSocketHook {
  messages: { message: string }[]
  sendMessage: (message: any) => void
  isConnected: Boolean
  animation: boolean
  emptyMessages: any
  isStreaming: boolean
  chat_id: string
  sourceData: any
  citationsData: any
  responseTime: any
  ragStreaming?: boolean
  isSuggestions: boolean
  retried: boolean
  retriedAnswers?: Array<{ retry_reason: string; answer: string }> | string[]
}

const useWebSocket = (url: string): WebSocketHook => {
  const [messages, setMessages] = useState<any>([])
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [chat_id, setChat_id] = useState('')
  const [sourceData, setSourceData] = useState<any>([])
  const [citationsData, setCitationsData] = useState<any>([])
  const [animation, setAnimation] = useState(false)
  const [responseTime, setResponseTime] = useState<string>()
  const {
    setIsStreaming,
    setRagStreaming,
    setIsSuggestions,
    setRetried,
    setRetriedAnswers
  } = useWebSocketStore()

  const emptyMessages = () => {
    setMessages([])
    setChat_id('')
  }

  useEffect(() => {
    const connect = () => {
      const socket = new WebSocket(url)
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WebSocket connection opened')
        setIsConnected(true)
      }

      socket.onmessage = event => {
        const chunk = JSON.parse(event.data)
        console.log(chunk, 'chunkdata')

        handleChunkedResponse(chunk)
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
        setIsConnected(false)
        setTimeout(connect, 1000)
      }
    }
    connect()
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [url])

  const handleChunkedResponse = (data: any) => {
    if (data.type === 'streaming') {
      setIsStreaming(true)
      setAnimation(false)
      setMessages((prevMessages: any) => [...prevMessages, data])
    }
    if (data.type === 'end_of_rag_streaming') {
      setRagStreaming(false)
    }

    if (data.type === 'end_of_stream') {
      setRagStreaming(true)
      setIsStreaming(false)
      setChat_id(data.message_id)
      setSourceData(data.sources)
      setCitationsData(data.specific_citations)
      setResponseTime(data.responseTime)
      setIsSuggestions(data.suggestions ?? true)

      // Handle retry data
      if (!animation) {
        setRetried(data.retried)
        setRetriedAnswers(data.retried_answers)
      } else {
        setRetried(false)
        setRetriedAnswers([])
      }

      console.log(data, 'datadata')
    }
  }

  const sendMessage = (message: any) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message))
      setAnimation(true)
      setIsStreaming(true)
    }
  }

  return {
    messages,
    sendMessage,
    isConnected,
    emptyMessages,
    chat_id,
    sourceData,
    citationsData,
    responseTime,
    animation,
    ragStreaming: useWebSocketStore(state => state.ragStreaming),
    isStreaming: useWebSocketStore(state => state.isStreaming),
    isSuggestions: useWebSocketStore(state => state.isSuggestions),
    retried: useWebSocketStore(state => state.retried),
    retriedAnswers: useWebSocketStore(state => state.retriedAnswers)
  }
}

export default useWebSocket
