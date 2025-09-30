import logoImg from "@/assets/Moyo_logo.png";
//import KakaoTalkIcon from "@/assets/KakaoTalkIcon.tsx";

// 하단 링크들 스타일 정의
const linkButtonClass = "hover:underline focus:outline-none cursor-pointer";

// src/pages/LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 영역 - 로고 */}
      <div className="flex flex-1 items-center justify-center p-8 -mt-4 md:-mt-15">
        <img className="w-80 h-50 bg-gray-300 rounded" />
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
          <button className="h-12 bg-[#FEE500] rounded mb-3 flex items-center justify-center w-full cursor-pointer gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="black"
              className="w-5 h-5"
            >
              <path d="M12 2C6.48 2 2 5.94 2 10.5c0 2.38 1.33 4.5 3.44 5.94-.15.95-.54 2.6-1.38 3.99-.12.21.08.46.31.39 1.8-.53 3.33-1.49 4.23-2.19 1.07.3 2.2.47 3.4.47 5.52 0 10-3.94 10-8.5S17.52 2 12 2z" />
            </svg>
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

          {/* <hr className="mb-4" /> */}

          {/* 소셜 로그인 */}
          {/* <div className="flex justify-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
