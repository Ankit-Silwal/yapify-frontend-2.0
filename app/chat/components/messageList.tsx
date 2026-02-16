import MessageBubble from "./messageBubble"


export default function MessageList({ messages = [], currentUserId }: { messages: any[], currentUserId: string }) {
  if (!messages) return null; // Safer check
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg)=>(
        <MessageBubble
        key={msg.id}
        message={msg.content}
        isOwn={String(msg.sender_id) === String(currentUserId)}
        />
      ))}
    </div>
  )
}
