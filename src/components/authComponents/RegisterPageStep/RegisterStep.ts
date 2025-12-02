export type RegisterStep = 1 | 2 | 3 | 4;

export const REGISTER_STEP_META: {
  id: RegisterStep;
  label: string;
  desc: string;
}[] = [
  { id: 1, label: "기본 정보", desc: "이름과 닉네임을 설정해요." },
  { id: 2, label: "프로필", desc: "나를 표현할 프로필 이미지를 선택해요." },
  { id: 3, label: "이메일 인증", desc: "안전한 모요 이용을 위해 인증해요." },
  { id: 4, label: "비밀번호", desc: "마지막으로 비밀번호를 정해요." },
];
