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
      nickname: /^[a-zA-Z가-힣]{2,}$/,
      email: /^[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*@[0-9a-zA-Z-]+(\.[a-zA-Z]{2,})+$/,
      // 문자 + 숫자 + 특수문자(종류 제한 X) + 8자 이상
      password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
      authCode: /^\d{6}$/,
    };

    // ✅ 비밀번호 확인만 별도 처리
    if (type === "passwordConfirm") {
      const pw = (passwordValue ?? "").trim();

      // 아직 아무 것도 안 쳤으면 -> "검사 전" 상태
      if (!trimmedValue.length || !pw.length) {
        setIsValid(null);
        return;
      }

      const result = trimmedValue === pw;
      setIsValid(result);
      return;
    }

    if (type === "name") {
      const result = trimmedValue.length >= 2;
      setIsValid(result);
      return;
    }

    if (trimmedValue.length === 0) {
      setIsValid(false);
      return;
    }

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
