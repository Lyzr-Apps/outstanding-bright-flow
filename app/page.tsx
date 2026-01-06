/**
 * MAIN PAGE - Build your UI here!
 *
 * FILE STRUCTURE (DO NOT CHANGE):
 * - app/page.tsx       ← YOU ARE HERE - main page
 * - app/layout.tsx     ← root layout (pre-configured)
 * - app/error.tsx      ← error boundary (pre-configured)
 * - app/not-found.tsx  ← 404 page (pre-configured)
 * - app/loading.tsx    ← loading state (pre-configured)
 * - app/api/           ← API routes
 * - src/components/ui/ ← shadcn/ui components
 * - src/lib/utils.ts   ← cn() helper
 *
 * ⚠️ NEVER create src/app/ - files go in app/ directly!
 * ⚠️ NEVER create error.tsx, not-found.tsx - use the ones here!
 * ⚠️ NEVER import from 'next/document' - App Router doesn't use it!
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSend, FiChevronDown } from 'react-icons/fi'
import { MdChat, MdMinimize } from 'react-icons/md'
import ChatMessage from '@/components/ChatMessage'
import QuickReplyChips from '@/components/QuickReplyChips'
import WelcomeState from '@/components/WelcomeState'
import TypingIndicator from '@/components/TypingIndicator'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  escalationSuggested?: boolean
}

interface ChatResponse {
  success: boolean
  response: {
    agent_response?: string
    escalation_suggested?: boolean
    suggested_topics?: string[]
    [key: string]: any
  } | string
  error?: string
}

const AGENT_ID = '695cb642c2dad05ba69ae2b8'
const COMPANY_NAME = 'TechCorp'

const QUICK_REPLY_TOPICS = [
  'Pricing Plans',
  'Features Overview',
  'Account Help',
  'Billing Questions'
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isWidgetOpen, setIsWidgetOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [sessionId] = useState(`session-${Date.now()}`)
  const [userId] = useState(`user-${Date.now()}`)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()

    if (!textToSend) return

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          agent_id: AGENT_ID,
          user_id: userId,
          session_id: sessionId,
        }),
      })

      const data: ChatResponse = await response.json()

      if (data.success) {
        let responseText = ''
        let escalationSuggested = false

        // Handle different response formats
        if (typeof data.response === 'string') {
          responseText = data.response
        } else if (data.response && typeof data.response === 'object') {
          responseText =
            data.response.agent_response ||
            data.response.message ||
            data.response.response ||
            JSON.stringify(data.response)
          escalationSuggested = data.response.escalation_suggested || false
        }

        const agentMessage: Message = {
          id: `msg-${Date.now()}-agent`,
          type: 'agent',
          content: responseText,
          timestamp: new Date(),
          escalationSuggested,
        }

        setMessages((prev) => [...prev, agentMessage])
      } else {
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          type: 'agent',
          content: `Sorry, I encountered an error: ${data.error || 'Unable to process your request'}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: 'agent',
        content:
          'Sorry, I encountered an error connecting to the service. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickReply = (topic: string) => {
    handleSendMessage(topic)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Chat Widget Container */}
        <div
          className={`bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${
            isWidgetOpen ? 'h-[600px]' : 'h-auto'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MdChat className="text-blue-600 text-lg" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Support Chat</h2>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsWidgetOpen(!isWidgetOpen)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
              aria-label="Toggle chat"
            >
              {isWidgetOpen ? (
                <MdMinimize className="text-lg" />
              ) : (
                <FiChevronDown className="text-lg" />
              )}
            </button>
          </div>

          {isWidgetOpen && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <WelcomeState companyName={COMPANY_NAME} />
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isEscalation={message.escalationSuggested}
                      />
                    ))}
                  </>
                )}

                {isLoading && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies - Show only on empty chat */}
              {messages.length === 0 && !isLoading && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                  <QuickReplyChips
                    topics={QUICK_REPLY_TOPICS}
                    onSelect={handleQuickReply}
                  />
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                <div className="flex gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    disabled={isLoading}
                    maxLength={500}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed"
                  >
                    <FiSend className="text-lg" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Max 500 characters per message
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>AI-powered support for {COMPANY_NAME}</p>
        </div>
      </div>
    </div>
  )
}
