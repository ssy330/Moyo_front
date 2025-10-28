import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import AuthLinks from "@/components/authComponents/AuthLinks";

const FindPwPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        {/* 반응형 텍스트 */}
        <h2 className="mb-6 max-w-xs text-center text-lg leading-snug font-bold break-keep text-gray-700 sm:max-w-sm sm:text-xl">
          비밀번호 찾기 (아이디 입력)
        </h2>

        {/* 입력창 + 버튼 */}
        <div className="flex w-full flex-col space-y-4">
          <AuthInput
            placeholder="찾을 비밀번호의 이메일을 입력하세요."
            name="id"
            className="w-full"
          />

          {/* 다음 버튼 */}
          <Button>다음</Button>
        </div>

        <hr className="my-6 w-full border-gray-300" />
      </div>

      {/* 하단 링크 */}
      <div className="flex flex-col items-center space-y-2 pb-10 text-center text-sm text-green-600 sm:flex-row sm:space-y-0 sm:space-x-4">
        <p className="text-gray-500">아이디를 잊으셨나요?</p>
        <AuthLinks text="아이디 찾기" />
      </div>
    </div>
  );
};

export default FindPwPage;
