"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { isAxiosError } from "axios"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success || response.status === 200) {
        router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(response.data.message || "Request failed");
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
            
            <div className="text-center text-sm">
                <a href="/login" className="underline underline-offset-4 hover:text-primary">
                    Back to Login
                </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
