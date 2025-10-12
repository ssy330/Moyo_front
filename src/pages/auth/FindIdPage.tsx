import LoginButton from "@/components/authComponents/LoginButton";
import AuthLinks from "@/components/authComponents/AuthLinks";
import KakaoTalkIcon from "@/assets/KakaoTalkIcon";
import MoyoLogo from "@/components/authComponents/MoyoLogo";

const FindIdPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 - 인증 버튼들 */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-6">아이디 찾기</h2>
        {/* Pass 인증 */}
        <LoginButton
          title="PASS 인증하기"
          styles="bg-red-100 text-red-600 hover:bg-red-200"
        />
        {/* 카카오 인증 */}
        <LoginButton
          icon={<KakaoTalkIcon />}
          title="카카오 인증하기"
          styles="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        />
        {/* 토스 인증 */}
        <LoginButton
          title="토스 인증하기"
          styles="bg-blue-100 text-blue-600 hover:bg-blue-200"
        />
        <hr className="my-6 border-gray-300 w-full" />
      </div>

      {/* 하단 링크 */}
      <div className="pb-10 text-sm text-green-600 flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-center">
        <p className="text-gray-500">계정이 없으신가요?</p>
        <AuthLinks text="회원가입" />
      </div>
    </div>
  );
};

export default FindIdPage;
