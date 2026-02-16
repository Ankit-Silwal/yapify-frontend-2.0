"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import api from "@/lib/api"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
  username: string
  is_verified: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  checkAuth: async () => {} 
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me")
      if (res.data.success) {
        setUser(res.data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname.startsWith("/chat")) {
       // If trying to access chat without user, redirect to login
       router.push("/login")
    }
  }, [user, loading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
