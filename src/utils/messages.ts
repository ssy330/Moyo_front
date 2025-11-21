// src/utils/messages.ts
export const MSGS = {
  // ✅ 이메일 인증 관련
  CODE_SENT: "인증번호가 이메일로 발송되었습니다.",
  CODE_VERIFIED: "이메일 인증이 완료되었습니다.",
  INVALID_EMAIL: "올바른 이메일을 입력하세요.",
  INVALID_OR_EXPIRED_CODE: "인증 코드가 올바르지 않거나 만료되었습니다.",
  TOO_MANY_REQUESTS: "요청이 너무 잦아요. 잠시 후 다시 시도해 주세요.",

  // ✅ 회원가입 관련
  SIGNUP_SUCCESS: "회원가입이 완료되었습니다!",
  EMAIL_ALREADY_REGISTERED: "이미 가입된 이메일입니다.",
  EMAIL_NOT_VERIFIED: "이메일 인증을 먼저 완료해 주세요.",

  // ✅ 로그인 관련
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않습니다.",

  // ✅ 비밀번호 찾기 관련
  PASSWORD_RESET_LINK_SENT: "비밀번호 재설정 링크가 이메일로 발송되었습니다.",
  INVALID_RESET_LINK: "유효하지 않은 링크입니다. 다시 요청해주세요.",
  PASSWORD_RESET_SUCCESS: "비밀번호가 성공적으로 변경되었습니다.",

  // ✅ 공통
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
} as const;
