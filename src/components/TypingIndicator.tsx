export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100" />
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200" />
        </div>
      </div>
      <p className="text-xs text-gray-500">Support Agent is typing...</p>
    </div>
  )
}
