"use client";
import { useEffect,useState } from "react";
import api from "@/lib/api";
import { getSocket } from "@/lib/socket";
import ChatHeader from "../components/chatHeader"
import MessageList from "../components/messageList"
import ChatInput from "../components/chatInput"
import { useParams } from "next/navigation";
export default function ConversationPage() {
  const {conversationId}=useParams()
  const [messages,setMessages]=useState([])
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchMessage=async ()=>{
      try{
        const res=await api.get(`/conversations/${conversationId}/messages?page=1&limit=20`)
        setMessages(res.data.content);
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
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  )
}
