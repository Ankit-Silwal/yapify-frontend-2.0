"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpFormProps extends React.ComponentProps<"div"> {
  title?: string;
  description?: string;
  verifyEndpoint: string;
  resendEndpoint: string;
  redirectPath: string;
  onSuccess?: (email: string, otp: string) => void; 
}

function OtpFormContent({
  className,
  title = "Enter Verification Code",
  description = "Check your email for the verification code.",
  verifyEndpoint,
  resendEndpoint,
  redirectPath,
  onSuccess,
  ...props
}: OtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (code: string) => {
    if (!email) {
      setError("Email is missing. Please restart the process.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post(verifyEndpoint, { email, otp: code });
      
      if (response.data.success || response.status === 200) {
        setSuccessMsg("Verification successful! Redirecting...");
        if (onSuccess) {
            onSuccess(email, code);
        } else {
            router.push(redirectPath);
        }
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      let message = "Verification failed. Please try again.";
      if (isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email is missing.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post(resendEndpoint, { email });
      if (response.data.success || response.status === 200) {
        setSucce) {
      let message = "Failed to resend OTP";
      if (isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      }
      setError(message
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
            {email && <div className="mt-1 text-xs">Sent to: {email}</div>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {successMsg && <div className="text-green-500 text-sm text-center">{successMsg}</div>}

            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={(value) => setOtp(value)}
              onComplete={handleVerify}
              disabled={loading}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-10 h-10 border rounded-md" />
                <InputOTPSlot index={1} className="w-10 h-10 border rounded-md" />
                <InputOTPSlot index={2} className="w-10 h-10 border rounded-md" />
                <InputOTPSlot index={3} className="w-10 h-10 border rounded-md" />
                <InputOTPSlot index={4} className="w-10 h-10 border rounded-md" />
                <InputOTPSlot index={5} className="w-10 h-10 border rounded-md" />
              </InputOTPGroup>
            </InputOTP>

            <Button 
                variant="link" 
                size="sm" 
                onClick={handleResend} 
                disabled={loading}
                className="text-muted-foreground"
            >
                Resend OTP
            </Button>
            
            <p className="text-muted-foreground text-xs text-center">
                Enter the 6-digit code sent to your email.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function OtpForm(props: OtpFormProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpFormContent {...props} />
        </Suspense>
    )
}
