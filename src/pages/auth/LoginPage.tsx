import logoImg from "@/assets/Moyo_logo.png";

// src/pages/LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15">
        <div className="w-80 h-50 bg-gray-300 rounded" />
      </div>

      {/* 오른쪽 영역 - 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6">
          {/* 아이디/비번 입력 */}
          <div className="space-y-3 mb-4">
            <input
              className="h-12 bg-gray-200 rounded flex items-center px-3 w-full"
              placeholder="아이디 입력"
            />
            <input
              className="h-12 bg-gray-200 rounded flex items-center px-3 w-full"
              placeholder="비밀번호 입력"
              type="password"
            />
          </div>

          {/* 로그인 버튼 */}
          <button className="h-12 bg-gray-300 rounded mb-3 flex items-center justify-center w-full cursor-pointer">
            로그인 버튼
          </button>

          {/* 하단 링크들 */}
          <div className="text-center text-sm text-gray-500 mb-6 space-x-2">
            <button className="hover:underline focus:outline-none">
              비밀번호 찾기
            </button>
            <span>|</span>
            <button className="hover:underline focus:outline-none">
              회원가입
            </button>
            <span>|</span>
            <button className="hover:underline focus:outline-none">
              아이디 찾기
            </button>
          </div>

          <hr className="mb-4" />

          {/* 소셜 로그인 */}
          <div className="flex justify-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
