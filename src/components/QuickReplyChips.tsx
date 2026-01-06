interface QuickReplyChipsProps {
  topics: string[]
  onSelect: (topic: string) => void
}

export default function QuickReplyChips({
  topics,
  onSelect,
}: QuickReplyChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className="px-3 py-2 border border-blue-300 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors duration-200 whitespace-nowrap"
        >
          {topic}
        </button>
      ))}
    </div>
  )
}
