import AuthLinks from "@/components/authComponents/AuthLinks";
import InputField from "@/components/authComponents/InputField";
import LoginButton from "@/components/authComponents/LoginButton";
import MoyoLogo from "@/components/authComponents/MoyoLogo";
import { setId, setNickname, setPassword } from "@/features/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const dispatch = useDispatch();

  // ✅ 로컬 상태
  const [nicknameLocal, setNicknameLocal] = useState("");
  const [idLocal, setIdLocal] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ✅ 유효성 상태
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null);
  const [isPwValid, setIsPwValid] = useState<boolean | null>(null);
  const [isPwMatch, setIsPwMatch] = useState<boolean | null>(null);

  // ✅ 닉네임 검사
  const onNickChange = (value: string) => {
    setNicknameLocal(value);
    dispatch(setNickname(value));

    const nicknameRegex = /^[a-zA-Z가-힣]+$/;

    if (value.trim().length === 0) setIsNickValid(null);
    else if (!nicknameRegex.test(value)) setIsNickValid(false);
    else if (value.trim().length < 2) setIsNickValid(false);
    else setIsNickValid(true);
  };

  // ✅ 아이디 검사 (8자 이상, 영어/숫자 조합)
  const onIdChange = (value: string) => {
    setIdLocal(value);
    dispatch(setId(value));

    const idRegex = /^[a-zA-Z0-9]{8,}$/; // 영문 + 숫자 8자 이상
    if (value.trim().length === 0) setIsIdValid(null);
    else if (!idRegex.test(value)) setIsIdValid(false);
    else setIsIdValid(true);
  };

  // ✅ 비밀번호 검사 (8자 이상, 숫자/문자/기호 포함)
  const onPWChange = (value: string) => {
    setPasswordLocal(value);
    dispatch(setPassword(value));

    // 최소 8자, 영어/숫자/특수문자 조합
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (value.trim().length === 0) setIsPwValid(null);
    else if (!pwRegex.test(value)) setIsPwValid(false);
    else setIsPwValid(true);
  };

  // ✅ 비밀번호 확인
  const onPWConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    setIsPwMatch(value === password && value.length > 0);
  };

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
          {/* 닉네임 */}
          <div className="flex flex-col">
            <InputField
              placeholder="닉네임을 입력하세요"
              name="nickname"
              value={nicknameLocal}
              onChange={(e) => onNickChange(e.target.value)}
            />
            {isNickValid === false && (
              <p className="text-xs text-red-500 mt-1 pl-2">
                닉네임은 2글자 이상, 한글/영문만 가능합니다.
              </p>
            )}
            {isNickValid === true && (
              <p className="text-xs text-green-500 mt-1 pl-2">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* 아이디 */}
          <div className="flex flex-col">
            <InputField
              placeholder="아이디를 입력하세요 (영문/숫자 8자 이상)"
              name="id"
              value={idLocal}
              autoComplete="username"
              onChange={(e) => onIdChange(e.target.value)}
            />
            {isIdValid === false && (
              <p className="text-xs text-red-500 mt-1 pl-2">
                아이디는 영문/숫자 조합 8자 이상이어야 합니다.
              </p>
            )}
            {isIdValid === true && (
              <p className="text-xs text-green-500 mt-1 pl-2">
                사용 가능한 아이디입니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col">
            <InputField
              placeholder="비밀번호 (8자 이상, 문자+숫자+기호 포함)"
              name="password"
              type="password"
              showToggle
              value={password}
              onChange={(e) => onPWChange(e.target.value)}
            />
            {isPwValid === false && (
              <p className="text-xs text-red-500 mt-1 pl-2">
                비밀번호는 8자 이상이며, 문자/숫자/기호를 포함해야 합니다.
              </p>
            )}
            {isPwValid === true && (
              <p className="text-xs text-green-500 mt-1 pl-2">
                사용 가능한 비밀번호입니다.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col">
            <InputField
              placeholder="비밀번호를 다시 입력하세요"
              name="passwordConfirm"
              type="password"
              showToggle
              value={passwordConfirm}
              onChange={(e) => onPWConfirmChange(e.target.value)}
            />
            {isPwMatch === false && (
              <p className="text-xs text-red-500 mt-1 pl-2">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
            {isPwMatch === true && (
              <p className="text-xs text-green-500 mt-1 pl-2">
                비밀번호가 일치합니다.
              </p>
            )}
          </div>

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
}
