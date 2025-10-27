// src/pages/LoginPage.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import KakaoTalkIcon from "@/assets/KakaoTalkIcon"
import InputField from "@/components/authComponents/InputField"
import AuthLinks from "@/components/authComponents/AuthLinks"
import LoginButton from "@/components/authComponents/LoginButton"
import MoyoLogo from "@/components/authComponents/MoyoLogo"

export default function LoginPage() {
  const navigate = useNavigate()

  // 입력 상태 관리
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  // 입력값 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // 로그인 요청
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      })
      // 토큰 저장
      localStorage.setItem("access_token", res.data.access_token)
      alert("로그인 성공!")
      navigate("/") // 로그인 후 홈으로 이동 (원하는 페이지로 수정 가능)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.detail ?? "로그인 실패")
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15 cursor-pointer">
        <MoyoLogo type="main" />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 로그인 폼 */}
          <form className="space-y-3 mb-4" onSubmit={handleLogin}>
            {/* 이메일 */}
            <InputField
              placeholder="이메일 입력"
              name="email"
              autoComplete="username"
              value={form.email}
              onChange={handleChange}
            />

            {/* 비밀번호 */}
            <InputField
              placeholder="비밀번호 입력"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />

            {/* 로그인 버튼 */}
            <LoginButton
              title="로그인 버튼"
              styles="bg-green-300 hover:bg-green-400"
              type="submit"
            />
          </form>

          {/* 소셜 로그인 버튼 */}
          <LoginButton
            icon={<KakaoTalkIcon />}
            title={"카카오계정으로 시작하기"}
            styles="bg-[#FEE500] hover:bg-[#F4DC00]"
          />
          <hr />

          {/* 하단 링크들 */}
          <div className="text-center text-sm text-gray-500 mt-3 mb-6 space-x-2">
            <AuthLinks text="회원가입" />
            <span>|</span>
            <AuthLinks text="아이디 찾기" />
            <span>|</span>
            <AuthLinks text="비밀번호 찾기" />
          </div>
        </div>
      </div>
    </div>
  )
}
