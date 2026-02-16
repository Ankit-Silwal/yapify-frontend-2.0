export default function MessageBubble({
  message,
  isOwn,
}: {
  message: string
  isOwn: boolean
}) {
  return (
    <div
      className={`flex ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
      >
        {message}
      </div>
    </div>
  )
}
