"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./auth-context"

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
        if (socket) {
            socket.disconnect()
            setSocket(null)
            setIsConnected(false)
        }
        return
    }

    const socketInstance = io("http://localhost:8000", {
      withCredentials: true,
      autoConnect: true,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })
    
    socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
    });

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
