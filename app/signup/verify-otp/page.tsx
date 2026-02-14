"use client"
import { OtpForm } from "@/components/otp-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OtpForm 
          title="Verify your account" 
          description="Enter the verification code sent to your email to activate your account."
          verifyEndpoint="/auth/verify"
          resendEndpoint="/auth/resend-otp"
          redirectPath="/login"
        />
      </div>
    </div>
  )
}

