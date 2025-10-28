import AuthLinks from "@/components/authComponents/AuthLinks";
import AuthInputGroup from "@/components/authComponents/AuthInputGroup";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { Button } from "@/components/ui/button";
import { setNickname, setEmail, setPassword } from "@/features/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

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

  // ✅ 모든 조건 충족 시 다음 버튼 활성화
  const isFormValid =
    isNickValid === true &&
    isEmailValid === true &&
    isPwValid === true &&
    isPwMatch === true &&
    isCodeValid === true;

  // ✅ 인증번호 발송 (가짜 API 예시)
  const handleSendCode = () => {
    if (!isEmailValid) return alert("올바른 이메일을 입력하세요.");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setAuthCode(code);
    setIsCodeSent(true);
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

  // Redux로 상태 전송
  const handleSubmit = () => {
    if (isFormValid) {
      dispatch(setNickname(nickname));
      dispatch(setEmail(email));
      dispatch(setPassword(password));
      alert("회원가입 완료! Redux에 상태 전송됨");
      // 예: navigate("/profile");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center p-6">
        <h2 className="mb-6 text-center text-lg leading-snug font-bold text-gray-700 sm:text-xl">
          회원가입
        </h2>

        <form
          className="flex w-full flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 닉네임 */}
          <AuthInputGroup
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNicknameLocal(e.target.value)}
            onValidChange={setIsNickValid}
          />

          {/* 이메일 + 인증버튼 */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AuthInputGroup
                name="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmailLocal(e.target.value)}
                onValidChange={setIsEmailValid}
                disabled={isCodeSent}
              />
            </div>
            <Button
              type="button"
              disabled={!isEmailValid || isCodeSent}
              onClick={handleSendCode}
              className={`h-12 px-4 text-sm font-medium ${
                isCodeSent
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isCodeSent ? "발송됨" : "인증"}
            </Button>
          </div>

          {/* ✅ 이메일 인증이 시작되면 입력창 비활성화 */}
          {isCodeSent && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                disabled={isCodeValid === true}
                className={`h-12 w-full rounded-md border border-gray-300 px-3 shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none ${
                  isCodeValid === true ? "bg-gray-100 text-gray-500" : ""
                }`}
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

          {/* ✅ 이메일 입력 비활성화 */}
          {isCodeSent && (
            <style>{`
              input[name="email"] {
                background-color: #f3f4f6;
                color: #6b7280;
                cursor: not-allowed;
              }
            `}</style>
          )}

          {/* 비밀번호 */}
          <AuthInputGroup
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPasswordLocal(e.target.value)}
            onValidChange={setIsPwValid}
          />

          {/* 비밀번호 확인 */}
          <AuthInputGroup
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

      {/* 하단 링크 */}
      <div className="flex flex-col items-center pb-10 text-sm text-green-600 sm:flex-row sm:space-x-4">
        <p className="text-gray-500">계정이 있으신가요?</p>
        <AuthLinks text="로그인" />
      </div>
    </div>
  );
};

export default RegisterPage;
