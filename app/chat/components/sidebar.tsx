"use client"
import { useState } from "react"
import { useRouter } from "next/router"
import api from "@/lib/api"
type user={
  id:string,
  username:string
}
export default function Sidebar() {
  const router=useRouter();
  const [search,setSearch]=useState("");
  const [users,setUsers]=useState<user[]>([])
  const [loading,setLoading]=useState(false)

  const handleSearch=async (value:string)=>{
    setSearch(value)
    if(!value.trim()){
      setUsers([])
      return;
    }
    try{
    setLoading(true)
    const res=await api.get(`/users/search?q=${value}`)
    setUsers(res.data)
    }catch(error){
      console.log("there was error in the action",error);
    }finally{
      setLoading(false);
    }
  }
  const startConversation=async (targetUserId:string)=>{
    try{
      const res=await api.post("/conversation/private",{
        targetUserId
      });
      const conversationId=res.data.conversationId;
      router.push('/chat/${conversationId}')
      setSearch("");
      setUsers([]);
    }catch(error){
      console.log("Some error occured",error);
    }
  }
  

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 text-xl font-bold">
        Yapify
      </div>
      <div className="p-3 border-b border-slate-700">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded bg-slate-800 p-2 outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 text-slate-400">
            Searching...
          </div>
        )}
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => startConversation(user.id)}
            className="p-4 hover:bg-slate-800 cursor-pointer"
          >
            {user.username}
          </div>
        ))}
        {!loading && users.length === 0 && search && (
          <div className="p-4 text-slate-400">
            No users found
          </div>
        )}
      </div>
    </div>
  )
}