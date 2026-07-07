import { useCallback, useMemo, useState } from "react"

import { sendChatMessage } from "../lib/api"

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Xin chào, mình là ShopAssist AI của Phong Vũ. Bạn đang tìm laptop, màn hình hay phụ kiện theo ngân sách nào?",
  products: [],
  comparison: null,
  cart_update: null,
  timestamp: new Date().toISOString()
}

function createUserMessage(content) {
  return {
    id: `user_${crypto.randomUUID()}`,
    role: "user",
    content,
    timestamp: new Date().toISOString()
  }
}

function createErrorMessage(message) {
  return {
    id: `assistant_${crypto.randomUUID()}`,
    role: "assistant",
    content: message,
    products: [],
    comparison: null,
    cart_update: null,
    timestamp: new Date().toISOString()
  }
}

export default function useChat() {
  const [messages, setMessages] = useState([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(() => `session_${crypto.randomUUID()}`)

  const sendMessage = useCallback(
    async (text) => {
      const trimmedText = text.trim()
      if (!trimmedText || isLoading) return

      const userMessage = createUserMessage(trimmedText)
      setMessages((currentMessages) => [...currentMessages, userMessage])
      setIsLoading(true)

      try {
        const response = await sendChatMessage(sessionId, trimmedText)
        const nextSessionId = response.data?.session_id || sessionId
        const assistantMessage = response.data?.message

        setSessionId(nextSessionId)
        setMessages((currentMessages) => [
          ...currentMessages,
          assistantMessage || createErrorMessage("Mình chưa nhận được phản hồi hợp lệ từ hệ thống.")
        ])
      } catch (error) {
        setMessages((currentMessages) => [
          ...currentMessages,
          createErrorMessage(error.message || "Mình chưa kết nối được backend. Vui lòng thử lại sau.")
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, sessionId]
  )

  const clearChat = useCallback(() => {
    setSessionId(`session_${crypto.randomUUID()}`)
    setMessages([welcomeMessage])
  }, [])

  return useMemo(
    () => ({ messages, isLoading, sessionId, sendMessage, clearChat }),
    [messages, isLoading, sessionId, sendMessage, clearChat]
  )
}
