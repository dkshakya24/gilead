import { useEffect, useRef, useState } from 'react'

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
  ragStreaming?: boolean
}

const useWebSocket = (url: string): WebSocketHook => {
  const [messages, setMessages] = useState<any>([])
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [chat_id, setChat_id] = useState('')
  const [sourceData, setSourceData] = useState<any>([])
  const [ragStreaming, setRagStreaming] = useState(true)
  const [citationsData, setCitationsData] = useState<any>([])
  console.log(citationsData, 'deep111')

  const [animation, setAnimation] = useState(false)
  const emptyMessages = () => {
    setMessages([])
    setChat_id('')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isStreaming', JSON.stringify(isStreaming))
    }
  }, [isStreaming])

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
    isStreaming,
    chat_id,
    sourceData,
    citationsData,
    animation,
    ragStreaming
  }
}

export default useWebSocket
