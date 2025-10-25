import AuthLinks from "@/components/authComponents/AuthLinks";
import InputGroup from "@/components/authComponents/InputGroup";
import LoginButton from "@/components/authComponents/LoginButton";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { useState } from "react";

const RegisterPage = () => {
  // ✅ 로컬 상태
  const [nickname, setNicknameLocal] = useState("");
  const [id, setIdLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 유효성 상태
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ✅ 모든 조건 충족 시 다음 버튼 활성화
  const isFormValid =
    isNickValid === true &&
    isIdValid === true &&
    isPwValid === true &&
    isPwMatch === true;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-6 text-center leading-snug">
          회원가입
        </h2>

        {/* 입력창 + 버튼 */}
        <form
          className="w-full flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputGroup
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            onValidChange={setIsNickValid}
          />

          {/* 아이디 */}
          <InputGroup
            name="id"
            placeholder="아이디를 입력하세요"
            value={id}
            onChange={(e) => setIdLocal(e.target.value)}
            onValidChange={setIsIdValid}
          />

          {/* 비밀번호 */}
          <InputGroup
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPasswordLocal(e.target.value)}
            onValidChange={setIsPwValid}
          />

          {/* 비밀번호 확인 */}
          <InputGroup
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            passwordValue={password} // ✅ 원본 비밀번호 전달!
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onValidChange={setIsPwMatch}
          />

          {/* 다음 버튼 */}
          <LoginButton
            title="다음"
            styles={`${
              isFormValid
                ? "bg-green-400 hover:bg-green-500 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid) {
                alert("모든 조건이 충족되었습니다!");
                // 다음 단계로 이동 (ex. navigate("/profile"))
              }
            }}
          />
        </form>

        <hr className="my-6 border-gray-300 w-full" />
      </div>

      {/* 하단 링크 */}
      <div className="pb-10 text-sm text-green-600 flex flex-col sm:flex-row items-center sm:space-x-4">
        <p className="text-gray-500">계정이 있으신가요?</p>
        <AuthLinks text="로그인" />
      </div>
    </div>
  );
};

export default RegisterPage;
