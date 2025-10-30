// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import AuthLinks from "@/components/authComponents/AuthLinks";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import AuthInput from "@/components/authComponents/AuthInput";
import { MSGS } from "@/utils/messages"; // ✅ 메시지 상수 import

export default function LoginPage() {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 입력값 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 요청
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      alert(MSGS.INVALID_CREDENTIALS); // 빈 입력 시에도 일관된 메시지 사용
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      // 토큰 저장
      localStorage.setItem("access_token", res.data.access_token);

      alert(MSGS.LOGIN_SUCCESS);
      navigate("/"); // 로그인 후 홈으로 이동 (원하는 페이지로 수정 가능)
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>;
      const msg =
        error.response?.data?.detail ??
        MSGS.INVALID_CREDENTIALS; // 서버 메시지 없을 시 기본 메시지 사용
      alert(msg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="-mt-4 flex flex-1 cursor-pointer items-center justify-center p-8 md:-mt-15">
        <MoyoLogo type="main" />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 로그인 폼 */}
          <form onSubmit={handleLogin}>
            {/* 입력 + 버튼 묶음 */}
            <div className="mb-4 flex flex-col gap-3">
              <AuthInput
                name="email"
                autoComplete="username"
                placeholder="이메일을 입력하세요"
                value={form.email}
                onChange={handleChange}
                validateOnChange={false}
              />

              <AuthInput
                name="password"
                autoComplete="current-password"
                placeholder="비밀번호 입력"
                value={form.password}
                onChange={handleChange}
                validateOnChange={false}
              />

              {/* 로그인 버튼 */}
              <Button type="submit" className="h-12 w-full text-base">
                로그인
              </Button>

              {/* 카카오 로그인 버튼 */}
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

            {/* 하단 링크 */}
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
