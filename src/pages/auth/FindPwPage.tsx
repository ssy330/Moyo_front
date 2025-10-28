import { useState } from "react";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthInputProps from "@/components/authComponents/AuthInputProps";
import { Button } from "@/components/ui/button";

const FindPwPage = () => {
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const handleSendCode = () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (isEmailValid === false || isEmailValid === null) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsCodeSent(true);
    alert("인증번호가 발송되었습니다.");
  };

  const handleVerifyCode = () => {
    if (!authCode.trim()) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    alert("인증이 완료되었습니다. 다음 단계로 이동합니다.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        <h2 className="mb-6 max-w-xs text-center text-lg leading-snug font-bold break-keep text-gray-700 sm:max-w-sm sm:text-xl">
          비밀번호 찾기 (이메일 입력)
        </h2>

        <div className="flex w-full flex-col space-y-4">
          {/* ✅ 이메일 입력 + 버튼 */}
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <AuthInputProps
                name="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onValidChange={setIsEmailValid}
                disabled={isCodeSent}
              />
            </div>
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isCodeSent || isEmailValid === false}
              className="h-12 w-20 shrink-0"
            >
              {isCodeSent ? "완료" : "발송"}
            </Button>
          </div>

          {/* ✅ 인증번호 입력 + 버튼 (동일 레이아웃) */}
          {isCodeSent && (
            <div className="animate-fadeIn flex items-start space-x-2">
              <div className="flex-1">
                <AuthInputProps
                  name="authCode"
                  placeholder="인증번호를 입력하세요."
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={handleVerifyCode}
                className="h-12 w-20 shrink-0"
              >
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
