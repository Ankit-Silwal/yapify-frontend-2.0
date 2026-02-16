import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      withCredentials: true,
      transports: ["websocket"]
    })
  }

  return socket
}