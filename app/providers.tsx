"use client"

import { AuthProvider } from "@/context/auth-context"
import { SocketProvider } from "@/context/socket-context"
import { ReactNode } from "react"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        {children}
      </SocketProvider>
    </AuthProvider>
  )
}
