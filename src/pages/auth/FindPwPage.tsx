import AuthLinks from "@/components/AuthLinks";
import LoginButton from "@/components/LoginButton";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/Moyo_logo.png";
import InputField from "@/components/InputField";

const FindPwPage = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <div className="flex items-center justify-center mt-10">
        <img
          className="w-28 sm:w-32 h-auto rounded cursor-pointer"
          src={logoImg}
          alt="Moyo Logo"
          onClick={() => nav("/login")}
        />
      </div>

      {/* 본문 */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm p-6">
        {/* 반응형 텍스트 */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-6 text-center leading-snug break-keep max-w-xs sm:max-w-sm">
          비밀번호 찾기 (아이디 입력)
        </h2>

        {/* 입력창 + 버튼 */}
        <div className="w-full flex flex-col space-y-4">
          <InputField
            placeholder="비밀번호를 찾을 아이디를 입력하세요"
            name="id"
            className="w-full "
          />
          <LoginButton title="다음" styles="bg-green-200 hover:bg-green-300" />
        </div>

        <hr className="my-6 border-gray-300 w-full" />
      </div>

      {/* 하단 링크 */}
      <div className="pb-10 text-sm text-gray-600 flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-center">
        <p className="text-gray-500">아이디를 잊으셨나요?</p>
        <AuthLinks text="아이디 찾기" onClick={() => nav("/login/idInquiry")} />
      </div>
    </div>
  );
};

export default FindPwPage;
