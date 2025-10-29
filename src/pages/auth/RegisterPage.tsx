import AuthLinks from "@/components/authComponents/AuthLinks";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { Button } from "@/components/ui/button";
import { setNickname, setEmail, setPassword } from "@/features/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import AuthInput from "@/components/authComponents/AuthInput";
import { useResendTimer } from "@/hook/useResendTimer"; // ✅ 추가

const RegisterPage = () => {
  const dispatch = useDispatch();

  // ✅ 로컬 상태
  const [nickname, setNicknameLocal] = useState("");
  const [email, setEmailLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 이메일 인증 관련
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeValid, setIsCodeValid] = useState<boolean | null>(null);

  // ✅ 유효성 상태
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ✅ 재전송 타이머 훅
  const { isRunning, start, formatTime } = useResendTimer(60);

  // ✅ 모든 조건 충족 시 다음 버튼 활성화
  const isFormValid =
    isNickValid === true &&
    isEmailValid === true &&
    isPwValid === true &&
    isPwMatch === true &&
    isCodeValid === true;

  // ✅ 인증번호 발송
  const handleSendCode = () => {
    if (!isEmailValid) return alert("올바른 이메일을 입력하세요.");

    // ❌ 이미 타이머 작동 중이면 무시
    if (isRunning) return;

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAuthCode(code);
    setIsCodeSent(true);
    start(); // ✅ 타이머 시작
    alert(`인증번호가 발송되었습니다! (테스트용: ${code})`);
  };

  // ✅ 인증번호 확인
  const handleVerifyCode = () => {
    if (inputCode === authCode) {
      setIsCodeValid(true);
      alert("인증이 완료되었습니다!");
    } else {
      setIsCodeValid(false);
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      dispatch(setNickname(nickname));
      dispatch(setEmail(email));
      dispatch(setPassword(password));
      alert("회원가입 완료!");
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
                disabled={isCodeSent && isRunning}
              />
            </div>

            <Button
              type="button"
              onClick={handleSendCode}
              disabled={
                !isEmailValid || // 이메일 유효하지 않음
                isRunning || // 타이머 동작 중
                isCodeValid === true // 인증 완료 상태
              }
              className={`h-12 px-4 text-sm font-medium transition-colors ${
                isCodeValid === true
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : isRunning
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-green-500 text-white hover:bg-green-600"
              }`}
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

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div className="flex items-center gap-2">
              <AuthInput
                name="authCode"
                placeholder="인증번호를 입력하세요."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                disabled={isCodeValid === true}
              />
              <Button
                type="button"
                onClick={handleVerifyCode}
                disabled={inputCode.trim().length === 0 || isCodeValid === true}
                className={`h-12 px-4 text-sm font-medium ${
                  isCodeValid === true
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {isCodeValid === true ? "완료" : "확인"}
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

          {/* 다음 버튼 */}
          <Button disabled={!isFormValid} onClick={handleSubmit}>
            다음
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
