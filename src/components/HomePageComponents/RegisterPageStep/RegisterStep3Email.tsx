// src/components/authComponents/registerSteps/RegisterStep3Email.tsx
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";

interface Props {
  email: string;
  inputCode: string;
  isCodeSent: boolean;
  isCodeValid: boolean | null;
  isEmailValid: boolean | null;
  loadingSend: boolean;
  loadingVerify: boolean;
  isRunning: boolean;
  resendKey: number;
  formatTime: () => string;
  onChangeEmail: (v: string) => void;
  onChangeCode: (v: string) => void;
  setIsEmailValid: (v: boolean | null) => void;
  onClickSendCode: () => void;
  onClickVerifyCode: () => void;
}

export default function RegisterStep3Email({
  email,
  inputCode,
  isCodeSent,
  isCodeValid,
  isEmailValid,
  loadingSend,
  loadingVerify,
  isRunning,
  resendKey,
  formatTime,
  onChangeEmail,
  onChangeCode,
  setIsEmailValid,
  onClickSendCode,
  onClickVerifyCode,
}: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
        이메일 인증
      </h3>
      <div className="max-w-xl space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1 origin-top transform sm:scale-[1.03]">
            <AuthInput
              name="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              onValidChange={setIsEmailValid}
              disabled={(isCodeSent && isRunning) || isCodeValid === true}
              inputClassName="h-15 text-base placeholder:text-base"
            />
          </div>

          <Button
            type="button"
            onClick={onClickSendCode}
            disabled={
              !isEmailValid || isRunning || isCodeValid === true || loadingSend
            }
            className="h-16 w-full text-xs sm:w-20"
          >
            {isCodeValid === true
              ? "완료"
              : loadingSend
                ? "전송중…"
                : isRunning
                  ? formatTime()
                  : isCodeSent
                    ? "재전송"
                    : "인증"}
          </Button>
        </div>

        {isCodeSent && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1 origin-top transform sm:scale-[1.03]">
              <AuthInput
                name="authCode"
                placeholder="인증번호를 입력하세요"
                value={inputCode}
                onChange={(e) => onChangeCode(e.target.value)}
                disabled={isCodeValid === true || loadingVerify}
                resendKey={resendKey}
                inputClassName="h-15 text-base placeholder:text-base"
              />
            </div>
            <Button
              type="button"
              onClick={onClickVerifyCode}
              disabled={
                inputCode.trim().length === 0 ||
                isCodeValid === true ||
                loadingVerify
              }
              className="h-16 w-full text-xs sm:w-20"
            >
              {isCodeValid === true
                ? "완료"
                : loadingVerify
                  ? "확인중…"
                  : "확인"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
