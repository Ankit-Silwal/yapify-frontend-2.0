export default function ChatHeader({
  username,
}: {
  username?: string
}) {
  return (
    <div className="border-b border-slate-700 p-4">
      <div className="font-semibold">
        {username || "Loading..."}
      </div>
      <div className="text-sm text-slate-400">
        Online
      </div>
    </div>
  )
}
