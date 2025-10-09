import AuthLinks from "@/components/AuthLinks";
import InputField from "@/components/InputField";
import LoginButton from "@/components/LoginButton";
import MoyoLogo from "@/components/MoyoLogo";
import { useState } from "react";

export default function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [id, setId] = useState("");
  const [isNickValid, setIsNickValid] = useState<boolean | null>(null);

  // 닉네임 저장하고 닉네임이 제대로 됐는지 체크 반환
  const onNickChange = (value: string) => {
    setNickname(value);
    if (value.trim().length === 0) {
      setIsNickValid(null); // 아무 메시지도 안 보임
    } else if (value.trim().length < 2) {
      setIsNickValid(false); // 빨간 에러
    } else {
      setIsNickValid(true); // 초록 성공
    }
  };

  const onIdChange = (value: string) => {
    setId(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4">
      {/* 상단 로고 */}
      <MoyoLogo />

      {/* 본문 */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-6 text-center leading-snug break-keep max-w-xs sm:max-w-sm">
          회원가입
        </h2>

        {/* 입력창 + 버튼 */}
        <form
          className="w-full flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()} //기본 새로고침 방지
        >
          <div className="flex flex-col">
            {/* 닉네임 */}
            <InputField
              placeholder="닉네임을 입력하세요"
              name="nickname"
              onChange={(e) => onNickChange(e.target.value)}
            />
            {isNickValid === false && (
              <p className="text-xs text-red-500 mt-1 pl-2">
                닉네임은 2글자 이상이어야 합니다
              </p>
            )}
            {isNickValid === true && (
              <p className="text-xs text-green-500 mt-1 pl-2">
                사용 가능한 닉네임입니다
              </p>
            )}
          </div>

          {/* 아이디 */}
          <InputField
            placeholder="아아디를 입력하세요."
            name="id"
            autoComplete="username"
          />
          {/* 비밀번호 */}
          <InputField
            placeholder="비밀번호를 입력하세요."
            name="password"
            type="password"
            autoComplete="new-password"
            showToggle
          />
          {/* 비밀번호 확인 */}
          <InputField
            placeholder="비밀번호를 다시 입력하세요."
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            showToggle
          />
          <LoginButton title="다음" styles="bg-green-200 hover:bg-green-300" />
        </form>

        <hr className="my-6 border-gray-300 w-full" />
      </div>

      {/* 하단 링크 */}
      <div className="pb-10 text-sm text-green-600 flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-center">
        <p className="text-gray-500">계정이 있으신가요?</p>
        <AuthLinks text="로그인" />
      </div>
    </div>
  );
}
