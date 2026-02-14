"use client"
import { OtpForm } from "@/components/otp-form"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OtpForm 
           title="Verify OTP"
           description="Enter the code to reset your password."
           verifyEndpoint="/auth/verify-forgot-password"
           resendEndpoint="/auth/resend-forgot-password-otp"
           redirectPath="" // We handle manually below
           onSuccess={(email, otp) => {
               router.push(`/forgot-password/reset?otp=${otp}`);
           }}
        />
      </div>
    </div>
  )
}
