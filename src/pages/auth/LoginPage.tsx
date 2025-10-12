import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import InputField from "@/components/authComponents/InputField";
import AuthLinks from "@/components/authComponents/AuthLinks";
import LoginButton from "@/components/authComponents/LoginButton";
import MoyoLogo from "@/components/authComponents/MoyoLogo";

// src/pages/LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15 cursor-pointer">
        <MoyoLogo type="main" />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 아이디/비번 폼 */}
          <form
            className="space-y-3 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* 아이디 */}
            <InputField
              placeholder="아이디 입력"
              name="username"
              autoComplete="username"
            />

            {/* 비번 */}
            <InputField
              placeholder="비밀번호 입력"
              type="password"
              name="password"
              autoComplete="current-password"
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
  );
}
