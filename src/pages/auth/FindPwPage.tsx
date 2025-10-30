import { useState } from "react";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import { useResendTimer } from "@/hook/useResendTimer";
import { MSGS } from "@/utils/messages";

const FindPwPage = () => {
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  const [resendKey, setResendKey] = useState(0);

  // ✅ 1분 재전송 타이머 훅
  const { isRunning, start, formatTime } = useResendTimer(60);

  const handleSendCode = () => {
    if (!email.trim() || isEmailValid === false) {
      alert(MSGS.INVALID_EMAIL);
      return;
    }
    // if (isRunning) return; // 이미 타이머 작동 중이면 무시

    start(); // 타이머 시작
    setResendKey((prev) => prev + 1);

    // TODO: 실제 이메일 인증번호 발송 API 호출
    setIsCodeSent(true);
    alert(MSGS.CODE_SENT);
  };

  // 이메일 일치여부 확인!
  const handleVerifyCode = () => {
    if (!authCode.trim()) {
      // 필요 시 messages.ts에 별도 메시지(KEY: REQUIRED_AUTH_CODE 등) 추가 권장
      alert(MSGS.INVALID_OR_EXPIRED_CODE);
      return;
    }
    // TODO: 실제 인증번호 검증 API 호출
    setIsCodeValid(true);
    alert(MSGS.CODE_VERIFIED);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      <MoyoLogo />

      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        <h2 className="mb-6 text-center text-lg font-bold text-gray-700 sm:text-xl">
          비밀번호 찾기 (이메일 입력)
        </h2>

        <div className="flex w-full flex-col space-y-4">
          {/* ✅ 이메일 입력 + 버튼 */}
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <AuthInput
                name="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onValidChange={setIsEmailValid}
                disabled={isRunning} // 타이머 도는 동안 이메일 수정 금지
              />
            </div>
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isRunning || isEmailValid === false}
              className="h-12 w-15 shrink-0"
            >
              {isCodeValid === true
                ? "완료"
                : isRunning
                ? formatTime()
                : isCodeSent
                ? "재전송"
                : "인증"}
            </Button>
          </div>

          {/* ✅ 인증번호 입력 */}
          {isCodeSent && (
            <div className="animate-fadeIn flex items-start space-x-2">
              <div className="flex-1">
                <AuthInput
                  name="authCode"
                  placeholder="인증번호를 입력하세요."
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={isCodeValid === true}
                  resendKey={resendKey}
                />
              </div>
              <Button
                type="button"
                onClick={handleVerifyCode}
                className="h-12 shrink-0"
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
