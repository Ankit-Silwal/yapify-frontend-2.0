export default function ChatInput() {
  return (
    <div className="border-t border-slate-700 p-4 flex gap-2">
      <input
        placeholder="Type a message..."
        className="flex-1 rounded bg-slate-800 p-2 outline-none"
      />
      <button className="bg-blue-600 px-4 rounded">
        Send
      </button>
    </div>
  )
}
