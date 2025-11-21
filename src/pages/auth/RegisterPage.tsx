// src/pages/auth/RegisterPage.tsx
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import AuthLinks from "@/components/authComponents/AuthLinks";
import AuthInput from "@/components/authComponents/AuthInput";
import { Button } from "@/components/ui/button";
import { setNickname, setEmail, setName } from "@/features/authSlice";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResendTimer } from "@/hook/useResendTimer";
import { MSGS } from "@/utils/messages";
import {
  useSendCode,
  useSignup,
  useVerifyCode,
} from "@/hook/mutation/auth/use-signup-mutation";
import { toast } from "sonner";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ 로컬 상태
  const [name, setNameLocal] = useState("");
  const [nickname, setNicknameLocal] = useState("");
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 이메일 인증 관련
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  // ✅ 유효성 상태
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ✅ 재전송 타이머
  const { isRunning, start, formatTime } = useResendTimer(60);
  const [resendKey, setResendKey] = useState(0);

  // ✅ 전체 폼 유효
  const isFormValid = useMemo(
    () =>
      isNameValid === true &&
      isNickValid === true &&
      isEmailValid === true &&
      isPwValid === true &&
      isPwMatch === true &&
      isCodeValid === true,
    [isNameValid, isNickValid, isEmailValid, isPwValid, isPwMatch, isCodeValid],
  );

  const { mutate: sendCode, isPending: loadingSend } = useSendCode();
  const { mutate: verifyCode, isPending: loadingVerify } = useVerifyCode();
  const { mutate: signup, isPending: loadingSignup } = useSignup();

  const handleSendCode = () => {
    if (!email.trim() || isEmailValid === false)
      return alert(MSGS.INVALID_EMAIL);
    if (isRunning || isCodeValid === true) return;

    sendCode(email, {
      onSuccess: () => {
        setIsCodeSent(true);
        start();
        setResendKey((prev) => prev + 1);
        alert(MSGS.CODE_SENT);
      },
      onError: (err) => alert(err.message),
    });
  };

  const handleVerifyCode = () => {
    if (!inputCode.trim()) return alert(MSGS.INVALID_OR_EXPIRED_CODE);
    if (isCodeValid === true) return;

    verifyCode(
      { email, code: inputCode },
      {
        onSuccess: () => {
          setIsCodeValid(true);
          alert(MSGS.CODE_VERIFIED);
        },
        onError: (err) => {
          setIsCodeValid(false);
          alert(err.message);
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    signup(
      { email, nickname, name, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("access_token", data.access_token);
          dispatch(setName(data.user.name));
          dispatch(setEmail(data.user.email));
          dispatch(setNickname(data.user.nickname));
          toast("가입 완료! 이제 모요를 이용할 수 있어요 🙌");
          navigate("/", { replace: true });
        },
        onError: (err) => toast(err.message),
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      <MoyoLogo />

      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        <h2 className="mb-6 text-center text-lg font-bold text-gray-700 sm:text-xl">
          회원가입
        </h2>

        <form
          className="flex w-full flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 이름 */}
          <AuthInput
            name="name"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setNameLocal(e.target.value)}
            onValidChange={setIsNameValid}
          />

          {/* 닉네임 */}
          <AuthInput
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            onValidChange={setIsNickValid}
          />

          {/* 이메일 + 인증버튼 */}
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <AuthInput
                name="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmailLocal(e.target.value)}
                onValidChange={setIsEmailValid}
                disabled={(isCodeSent && isRunning) || isCodeValid === true}
              />
            </div>

            <Button
              type="button"
              onClick={handleSendCode}
              disabled={
                !isEmailValid ||
                isRunning ||
                isCodeValid === true ||
                loadingSend
              }
              className={`flex h-12 w-15 shrink-0 items-center justify-center px-3 text-xs font-medium transition-colors ${
                isCodeValid === true
                  ? "cursor-not-allowed"
                  : isRunning || loadingSend
                    ? "cursor-not-allowed"
                    : ""
              } `}
            >
              {isCodeValid === true
                ? "완료"
                : loadingSend
                  ? "전송중..."
                  : isRunning
                    ? formatTime()
                    : isCodeSent
                      ? "재전송"
                      : "인증"}
            </Button>
          </div>

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <AuthInput
                  name="authCode"
                  placeholder="인증번호를 입력하세요."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  disabled={isCodeValid === true || loadingVerify}
                  resendKey={resendKey}
                />
              </div>
              <Button
                type="button"
                onClick={handleVerifyCode}
                disabled={
                  inputCode.trim().length === 0 ||
                  isCodeValid === true ||
                  loadingVerify
                }
                className="flex h-12 w-15 shrink-0 items-center justify-center px-3 text-xs font-medium"
              >
                {isCodeValid === true
                  ? "완료"
                  : loadingVerify
                    ? "확인중..."
                    : "확인"}
              </Button>
            </div>
          )}

          {/* 비밀번호 */}
          <AuthInput
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPasswordLocal(e.target.value)}
            onValidChange={setIsPwValid}
          />

          {/* 비밀번호 확인 */}
          <AuthInput
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            passwordValue={password}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onValidChange={setIsPwMatch}
          />

          {/* 다음(회원가입) 버튼 */}
          <Button
            disabled={!isFormValid || loadingSignup}
            onClick={handleSubmit}
          >
            {loadingSignup ? "등록 중..." : "다음"}
          </Button>
        </form>

        <hr className="my-6 w-full border-gray-300" />
      </div>

      <div className="flex flex-col items-center pb-10 text-sm text-green-600 sm:flex-row sm:space-x-4">
        <p className="text-gray-500">계정이 있으신가요?</p>
        <AuthLinks text="로그인" />
      </div>
    </div>
  );
}
