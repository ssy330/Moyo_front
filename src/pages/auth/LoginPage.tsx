import logoImg from "@/assets/Moyo_logo.png";
import KakaoTalkIcon from "@/assets/KakaoTalkIcon.tsx";
import InputField from "@/components/InputField.tsx";

// 하단 링크들 스타일 정의
const linkButtonClass = "hover:underline focus:outline-none cursor-pointer";

// src/pages/LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15">
        <img className="w-auto h-50  rounded" src={logoImg} />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 아이디/비번 입력 */}
          <div className="space-y-3 mb-4">
            <InputField placeholder="아이디 입력" />
            <InputField placeholder="비밀번호 입력" type="password" />
          </div>

          {/* 로그인 버튼 */}
          <button className="h-12 bg-[#FEE500] rounded mb-3 flex items-center justify-center w-full cursor-pointer gap-2 hover:bg-[#F4DC00]">
            <KakaoTalkIcon />
            카카오계정으로 시작하기
          </button>

          {/* 소셜 로그인 버튼 */}
          <button className="h-12 bg-gray-300 rounded mb-3 flex items-center justify-center w-full cursor-pointer">
            로그인 버튼
          </button>

          {/* 하단 링크들 */}
          <div className="text-center text-sm text-gray-500 mb-6 space-x-2">
            <button className={linkButtonClass}>회원가입</button>
            <span>|</span>
            <button className={linkButtonClass}>아이디 찾기</button>
            <span>|</span>
            <button className={linkButtonClass}>비밀번호 찾기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
