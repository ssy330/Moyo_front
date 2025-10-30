// src/pages/auth/RegisterPage.tsx
import AuthLinks from "@/components/authComponents/AuthLinks";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { Button } from "@/components/ui/button";
import { setNickname, setEmail, setPassword } from "@/features/authSlice";
import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import AuthInput from "@/components/authComponents/AuthInput";
import { useResendTimer } from "@/hook/useResendTimer";
import { MSGS } from "@/utils/messages";
// import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

const RegisterPage = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // ✅ 로컬 상태
  const [nickname, setNicknameLocal] = useState("");
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 이메일 인증 관련
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  // ✅ 유효성 상태
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ✅ 로딩 상태
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  // ✅ 재전송 타이머
  const { isRunning, start, formatTime } = useResendTimer(60);
  const [resendKey, setResendKey] = useState(0);

  // ✅ 전체 폼 유효
  const isFormValid = useMemo(
    () =>
      isNickValid === true &&
      isEmailValid === true &&
      isPwValid === true &&
      isPwMatch === true &&
      isCodeValid === true,
    [isNickValid, isEmailValid, isPwValid, isPwMatch, isCodeValid]
  );

  // ✅ 인증번호 발송
  const handleSendCode = async () => {
    if (!email.trim() || isEmailValid === false) {
      alert(MSGS.INVALID_EMAIL);
      return;
    }
    if (loadingSend || isRunning || isCodeValid === true) return;

    setLoadingSend(true);
    try {
      const res = await fetch(`${API_BASE}/auth/email/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsCodeSent(true);
        start();
        setResendKey((prev) => prev + 1);
        alert(MSGS.CODE_SENT);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || MSGS.TOO_MANY_REQUESTS);
      }
    } catch {
      alert(MSGS.SERVER_ERROR);
    } finally {
      setLoadingSend(false);
    }
  };

  // ✅ 인증번호 확인
  const handleVerifyCode = async () => {
    if (!inputCode.trim()) {
      alert(MSGS.INVALID_OR_EXPIRED_CODE);
      return;
    }
    if (loadingVerify || isCodeValid === true) return;

    setLoadingVerify(true);
    try {
      const res = await fetch(`${API_BASE}/auth/email/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: inputCode }),
      });

      if (res.ok) {
        setIsCodeValid(true);
        alert(MSGS.CODE_VERIFIED);
      } else {
        setIsCodeValid(false);
        const err = await res.json().catch(() => ({}));
        alert(err.detail || MSGS.INVALID_OR_EXPIRED_CODE);
      }
    } catch {
      setIsCodeValid(false);
      alert(MSGS.SERVER_ERROR);
    } finally {
      setLoadingVerify(false);
    }
  };

  // ✅ 회원가입 제출 (UserCreate: { email, name, password })
  const handleSubmit = async () => {
    if (!isFormValid || loadingSignup) return;

    setLoadingSignup(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: nickname,
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        dispatch(setNickname(nickname));
        dispatch(setEmail(email));
        dispatch(setPassword(password));
        console.log("회원가입 성공:", data);
        alert(MSGS.SIGNUP_SUCCESS);
        // navigate("/login");
      } else {
        const err = await res.json().catch(() => ({}));
        if (res.status === 409) {
          alert(MSGS.EMAIL_ALREADY_REGISTERED);
        } else if (
          res.status === 400 &&
          String(err.detail || "").startsWith("Email not verified")
        ) {
          alert(MSGS.EMAIL_NOT_VERIFIED);
        } else {
          alert(err.detail || MSGS.SERVER_ERROR);
        }
      }
    } catch {
      alert(MSGS.SERVER_ERROR);
    } finally {
      setLoadingSignup(false);
    }
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
          {/* 닉네임 */}
          <AuthInput
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            onValidChange={setIsNickValid}
          />

          {/* 이메일 + 인증버튼 */}
          <div className="flex items-center gap-2">
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
              className={`h-12 w-15 px-4 text-sm font-medium transition-colors ${
                isCodeValid === true
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : isRunning || loadingSend
                  ? "cursor-not-allowed"
                  : ""
              }`}
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
            <div className="flex items-center gap-2">
              <AuthInput
                name="authCode"
                placeholder="인증번호를 입력하세요."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                disabled={isCodeValid === true || loadingVerify}
                resendKey={resendKey}
              />
              <Button
                type="button"
                onClick={handleVerifyCode}
                disabled={
                  inputCode.trim().length === 0 ||
                  isCodeValid === true ||
                  loadingVerify
                }
                className="h-12 px-4 text-sm font-medium"
              >
                {isCodeValid === true ? "완료" : loadingVerify ? "확인중..." : "확인"}
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
          <Button disabled={!isFormValid || loadingSignup} onClick={handleSubmit}>
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
};

export default RegisterPage;
