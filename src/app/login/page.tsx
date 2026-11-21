"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useAuth, getGoogleAuthErrorMessage } from "../../lib/authContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { GoogleIcon } from "../../components/icons/GoogleIcon";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/edit");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      setIsLoggingIn(true);
      const profile = await signInWithGoogle();
      if (profile) {
        router.replace("/edit");
      }
    } catch (error) {
      setErrorMessage(getGoogleAuthErrorMessage(error));
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B7684] hover:text-[#191F28] mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>

        <Card className="p-7 text-center flex flex-col items-center gap-4 shadow-sm">
          <Badge variant="brand" className="px-3 py-1 text-[12px] font-semibold gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>마이링크 시작하기</span>
          </Badge>

          <div>
            <h1 className="text-[24px] font-extrabold tracking-tight text-[#191F28]">
              마이링크 로그인
            </h1>
            <p className="mt-2 text-[14px] text-[#6B7684] leading-relaxed">
              Google 계정으로 간편하게 로그인하고
              <br />
              나만의 링크 페이지를 만들어 보세요.
            </p>
          </div>

          {errorMessage && (
            <div className="w-full rounded-xl bg-[#FFF0F2] text-[#F04452] text-[13px] font-medium px-3.5 py-2.5 text-left">
              {errorMessage}
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={loading || isLoggingIn}
            variant="outline"
            size="lg"
            className="w-full mt-2 gap-2.5 font-semibold"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#3182F6]" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>{isLoggingIn ? "로그인 중..." : "Google 계정으로 계속하기"}</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
