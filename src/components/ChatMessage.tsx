import { FiAlertCircle } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

interface ChatMessageProps {
  message: {
    id: string
    type: 'user' | 'agent'
    content: string
    timestamp: Date
  }
  isEscalation?: boolean
}

export default function ChatMessage({
  message,
  isEscalation = false,
}: ChatMessageProps) {
  const isUser = message.type === 'user'

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none'
        } px-4 py-3 shadow-sm`}
      >
        {/* Escalation Warning */}
        {!isUser && isEscalation && (
          <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
            <FiAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">
              This issue may require human assistance
            </p>
          </div>
        )}

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Timestamp */}
        <p
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}
