// src/hooks/useValidation.ts

import { useState } from "react";

export const useValidation = (
  type:
    | "name"
    | "nickname"
    | "email"
    | "password"
    | "passwordConfirm"
    | "authCode",
  passwordValue?: string,
) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = (value: string) => {
    const trimmedValue = value.trim();

    const rules = {
      nickname: /^[a-zA-Z가-힣]{2,}$/, // 2글자 이상, 한글/영문
      email: /^[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*@[0-9a-zA-Z-]+(\.[a-zA-Z]{2,})+$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // 문자+숫자+기호 포함 8자 이상
      authCode: /^\d{6}$/, // 인증번호 6자리 숫자
    };

    // ✅ passwordConfirm만 따로 처리
    if (type === "passwordConfirm") {
      // trimmedValue를 사용하여 비밀번호 일치 및 길이 검사
      const result = trimmedValue === passwordValue && trimmedValue.length > 0;
      setIsValid(result);
      return;
    }

    if (type === "name") {
      // trimmedValue를 사용하여 길이 검사
      const result = trimmedValue.length >= 2; // 2글자 이상만 허용
      setIsValid(result);
      return;
    }

    // 값이 없으면 무효 처리 (필수 입력 필드에 해당)
    if (trimmedValue.length === 0) {
      setIsValid(false);
      return;
    }

    // ✅ 나머지 정규식 검사
    // 공백이 제거된 trimmedValue를 test 함수에 전달합니다.
    const result = rules[type].test(trimmedValue);
    setIsValid(result);
  };

  const messages = {
    name: ["이름은 한글 또는 영문 2글자 이상이어야 합니다", ""],
    nickname: [
      "닉네임은 2글자 이상, 한글/영문만 가능합니다",
      "사용 가능한 닉네임입니다",
    ],
    email: ["올바른 이메일 형식이 아닙니다 (예: example@email.com)", ""],
    password: [
      "8자 이상, 문자+숫자+기호를 포함해야 합니다",
      "안전한 비밀번호입니다",
    ],
    passwordConfirm: ["비밀번호가 일치하지 않습니다", "비밀번호가 일치합니다"],
    authCode: ["인증번호는 숫자 6자리여야 합니다", ""],
  };

  return { isValid, validate, messages };
};
