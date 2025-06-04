// hooks/useWebSocket.ts
import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { username } from "@/lib/utils";

// hooks/useWebSocket.ts
const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const {
    setConnected,
    setMessages,
    setStreamingMessage,
    appendStreamingContent,
    finalizeStreamingMessage,
    setIsLoading,
    setErrorMessage,
  } = useChatStore();

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      console.log("response", res);
      if (res?.error) {
        console.error("Error received:", res.error);
        setErrorMessage(res.error);
        setIsLoading(false);
        return;
      }
      if (res?.llm_response) {
        // Simulate streaming
        setIsLoading(false); // Stop loader when response starts streaming
        const fullText = res.llm_response;
        setStreamingMessage({
          role: "bot",
          content: "",
          timestamp: new Date(),
        });

        let i = 0;
        const interval = setInterval(() => {
          if (i < fullText.length) {
            appendStreamingContent(fullText[i]);
            i++;
          } else {
            clearInterval(interval);
            finalizeStreamingMessage();
          }
        }, 1); // speed of typing
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      // setErrorMessage("WebSocket connection error. Please try again.");
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [
    url,
    appendStreamingContent,
    setConnected,
    finalizeStreamingMessage,
    setErrorMessage,
    setIsLoading,
    setStreamingMessage,
  ]);

  const sendMessage = (msg: string, sessionId?: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        action: "sendmessage",
        query: msg,
        userId: username,
        sessionId: sessionId ?? ""
      });
      console.log("payload", payload);
      socketRef.current.send(payload);
      setMessages({ role: "user", content: msg, timestamp: new Date() });
      setIsLoading(true);
    }
  };

  return { sendMessage };
};

export default useWebSocket;
