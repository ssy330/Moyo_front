import { useState } from "react";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import { useValidation } from "@/hook/useValidation";

const FindPwPage = () => {
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState("");

  // ✅ 이메일 유효성 검사 훅
  const { isValid, validate, messages } = useValidation("email");

  // ✅ 인증번호 발송
  const handleSendCode = () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!isValid) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // TODO: 실제 이메일 인증 API 연동
    setIsCodeSent(true);
    alert("인증번호가 발송되었습니다.");
  };

  // ✅ 인증번호 확인
  const handleVerifyCode = () => {
    if (!authCode.trim()) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    // TODO: 실제 인증번호 검증 로직
    alert("인증이 완료되었습니다. 다음 단계로 이동합니다.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        <h2 className="mb-6 max-w-xs text-center text-lg leading-snug font-bold break-keep text-gray-700 sm:max-w-sm sm:text-xl">
          비밀번호 찾기 (아이디 입력)
        </h2>

        {/* 입력창 + 버튼 */}
        <div className="flex w-full flex-col space-y-4">
          {/* 이메일 입력 */}
          <div className="flex flex-col space-y-1">
            <AuthInput
              placeholder="찾을 비밀번호의 이메일을 입력하세요."
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validate(e.target.value);
              }}
              disabled={isCodeSent}
            />
            {/* 유효성 메시지 표시 */}
            {isValid === false && (
              <p className="text-sm whitespace-nowrap text-red-500">
                {messages.email[0]}
              </p>
            )}
          </div>

          {/* 인증번호 발송 버튼 */}
          <Button
            type="button"
            onClick={handleSendCode}
            disabled={isCodeSent || isValid === false}
          >
            {isCodeSent ? "인증번호 발송 완료" : "인증번호 발송"}
          </Button>

          {/* 인증번호 입력창 + 다음 버튼 */}
          {isCodeSent && (
            <div className="animate-fadeIn flex flex-col space-y-3">
              <AuthInput
                placeholder="인증번호를 입력하세요."
                name="authCode"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />
              <Button type="button" onClick={handleVerifyCode}>
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPwPage;
