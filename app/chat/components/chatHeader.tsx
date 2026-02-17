export default function ChatHeader({
  username,
  isOnline,
  isTyping,
}: {
  username?: string
  isOnline?: boolean
  isTyping?: boolean
}) {
  return (
    <div className="border-b border-slate-700 p-4">
      <div className="font-semibold">
        {username || "Loading..."}
      </div>

      <div className="text-sm">
        {isTyping ? (
          <span className="text-blue-400">
            Typing...
          </span>
        ) : isOnline ? (
          <span className="text-green-500">
            Online
          </span>
        ) : (
          <span className="text-slate-400">
            Offline
          </span>
        )}
      </div>
    </div>
  )
}
