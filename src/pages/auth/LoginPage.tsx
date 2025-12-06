// LoginPage.tsx

import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import MoyoLogo from "@/components/authComponents/MoyoLogo2";
import AuthLinks from "@/components/authComponents/AuthLinks";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignInWithEmail } from "@/hooks/mutation/auth/use-login-mutation";
import { toast } from "sonner";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { mutateAsync: signInWithEmail, isPending: isSignInWithEmailPending } =
    useSignInWithEmail();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await signInWithEmail({
        email: form.email,
        password: form.password,
      });

      const me = data.me;
      toast.success(`${me?.name ?? "회원"}님 환영합니다!`);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("로그인 실패:", err);
      toast.error("이메일 또는 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center px-6 pt-10 md:px-10 md:pt-0">
        <div className="w-full max-w-xs">
          <MoyoLogo type="main" />
        </div>
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 md:px-10 md:pb-0">
        {/* ✅ 너비 좁히고, 살짝 아래로 내리기 */}
        <div className="w-full max-w-[320px] translate-y-4 md:max-w-[340px] md:translate-y-6">
          <form onSubmit={handleSignInWithEmail}>
            <div className="mb-4 flex flex-col gap-3">
              <AuthInput
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={form.email}
                onChange={handleChange}
                validateOnChange={false}
                inputClassName="h-12"
              />

              <AuthInput
                name="password"
                autoComplete="current-password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
                validateOnChange={false}
                inputClassName="h-12"
              />

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={isSignInWithEmailPending}
              >
                로그인
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="h-12 w-full bg-[#FEE500] text-black hover:bg-[#F4DC00]"
                onClick={() => alert("카카오 로그인 준비 중")}
              >
                <span className="mr-2">
                  <KakaoTalkIcon />
                </span>
                카카오계정으로 시작하기
              </Button>
            </div>

            <hr className="my-6" />

            <div className="space-x-2 text-center text-sm text-gray-500">
              <AuthLinks text="회원가입" />
              <span>|</span>
              <AuthLinks text="비밀번호 찾기" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
