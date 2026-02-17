import { useState } from "react"
export default function ChatInput({
  onSend,
  onTyping,
}: {
  onSend: (content: string) => void
  onTyping: () => void
}) {
  const [input, setInput] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    onTyping()
  }

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput("")
  }

  return (
    <div className="border-t border-slate-700 p-4 flex gap-2">
      <input
        value={input}
        onChange={handleChange}
        className="flex-1 rounded bg-slate-800 p-2 outline-none"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 rounded"
      >
        Send
      </button>
    </div>
  )
}
