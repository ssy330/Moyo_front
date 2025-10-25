import { useState } from "react";

export const useValidation = (type: "nickname" | "id" | "password") => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validate = (value: string) => {
    const rules = {
      nickname: /^[a-zA-Z가-힣]{2,}$/,
      id: /^[a-zA-Z0-9]{8,}$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };

    // ✅ 나머지는 정규식 검사
    const result = rules[type].test(value);
    setIsValid(result);
  };

  const messages = {
    nickname: [
      "닉네임은 2글자 이상, 한글/영문만 가능",
      "사용 가능한 닉네임입니다",
    ],
    id: [
      "아이디는 8자 이상 영문/숫자 조합이어야 합니다",
      "사용 가능한 아이디입니다",
    ],
    password: [
      "8자 이상, 문자+숫자+기호 포함해야 합니다",
      "안전한 비밀번호입니다",
    ],
    passwordConfirm: ["비밀번호가 일치하지 않습니다", "비밀번호가 일치합니다"],
  };

  return { isValid, validate, messages };
};
