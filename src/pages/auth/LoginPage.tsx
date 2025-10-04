import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/Moyo_logo.png";
import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import InputField from "@/components/InputField";
import AuthLinks from "@/components/AuthLinks";
import LoginButton from "@/components/LoginButton";

// src/pages/LoginPage.tsx
export default function LoginPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15 cursor-pointer">
        <img
          className="w-auto h-50  rounded"
          src={logoImg}
          onClick={() => nav("/login")}
        />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 아이디/비번 입력 */}
          <div className="space-y-3 mb-4">
            <InputField name="id" placeholder="아이디 입력" />
            <InputField
              name="password"
              placeholder="비밀번호 입력"
              type="password"
            />
          </div>

          {/* 소셜 로그인 버튼 */}
          <LoginButton
            title="로그인 버튼"
            styles="bg-green-300 hover:bg-green-400"
          />

          {/* 로그인 버튼 */}
          <LoginButton
            icon={<KakaoTalkIcon />}
            title={"카카오계정으로 시작하기"}
            styles="gap-2 bg-[#FEE500] hover:bg-[#F4DC00]"
          />
          <hr />
          {/* 하단 링크들 */}
          <div className="text-center text-sm text-gray-500 mt-3 mb-6 space-x-2">
            <AuthLinks text="회원가입" onClick={() => nav("/register")} />
            <span>|</span>
            <AuthLinks
              text="아이디 찾기"
              onClick={() => nav("/login/idInquiry")}
            />
            <span>|</span>
            <AuthLinks
              text="비밀번호 찾기"
              onClick={() => nav("/login/pwInquiry")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
