"use client";
import { useEffect,useState } from "react";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
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

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
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
  return (
    <div className="flex h-full flex-col">
      <ChatHeader username={conversationInfo?.other_user?.username}
/>

      <MessageList messages={messages} currentUserId={user?.id || ""} />
      <ChatInput onSend={handleSendMessage}/>
    </div>
  )
}
