"use client";
import { useEffect,useState } from "react";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useRef } from "react";
import ChatHeader from "../components/chatHeader"
import MessageList from "../components/messageList"
import ChatInput from "../components/chatInput"
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function ConversationPage() {
  const {conversationId}=useParams()
  const { user } = useAuth();
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(true);
  const [conversationInfo, setConversationInfo] = useState<any>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  
  useEffect(() => {
  const fetchConversation = async () => {
    try {
      const res = await api.get(`/conversation/${conversationId}/details`)
      setConversationInfo(res.data)
    } catch (error) {
      console.error("Conversation fetch error:", error)
    }
  }

  fetchConversation()
}, [conversationId])

  useEffect(()=>{
    const fetchMessage=async ()=>{
      try{
        const res=await api.get(`/conversation/${conversationId}`)
        console.log("Fetched message:",res.data);
        setMessages(Array.isArray(res.data) ? res.data : []); // Ensure array
      }catch(error){
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
    fetchMessage();
  },[conversationId]);

  useEffect(() => {
    const socket = getSocket();
    
    const handleNewMessage = (msg: any) => {
      if (String(msg.conversation_id) === String(conversationId)) {
        setMessages((prev: any) => [...prev, msg]);
      }
    };

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers(prev => [...prev, data.userId])
    }

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId))
    }
    
    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users)
    }
    socket.on("user-typing", (data) => {
  if (data.conversationId === conversationId) {
    setTypingUsers(prev =>
      prev.includes(data.userId)
        ? prev
        : [...prev, data.userId]
    )
  }
})

socket.on("user-stop-typing", (data) => {
  if (data.conversationId === conversationId) {
    setTypingUsers(prev =>
      prev.filter(id => id !== data.userId)
    )
  }
})


    socket.on("new-message", handleNewMessage);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);
    socket.on("online-users", handleOnlineUsers);
    
    socket.emit("get-online-users"); // Request initial list

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("online-users", handleOnlineUsers);
    };
  }, [conversationId]);
  
  const handleSendMessage = (content: string) => {
    const socket = getSocket()

    socket.emit("send-message", {
      conversationId,
      content
    })
  }
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    )
  }
  const handleTyping = () => {
  const socket = getSocket()

  socket.emit("typing", { conversationId })

  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current)
  }

  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("typing-stop", { conversationId })
  }, 1000)
}

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
  username={conversationInfo?.other_user?.username}
  isOnline={onlineUsers.includes(conversationInfo?.other_user?.id)}
  isTyping={typingUsers.length > 0}
/>


      <MessageList messages={messages} currentUserId={user?.id || ""} />
      <ChatInput onSend={handleSendMessage} onTyping={handleTyping}/>
    </div>
  )
}
