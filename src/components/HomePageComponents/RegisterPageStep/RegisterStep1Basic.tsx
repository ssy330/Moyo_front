import AuthInput from "@/components/authComponents/AuthInput";

interface Props {
  name: string;
  nickname: string;
  onChangeName: (value: string) => void;
  onChangeNickname: (value: string) => void;
  setIsNameValid: (valid: boolean | null) => void;
  setIsNickValid: (valid: boolean | null) => void;
}

export default function RegisterStep1Basic({
  name,
  nickname,
  onChangeName,
  onChangeNickname,
  setIsNameValid,
  setIsNickValid,
}: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
        기본 정보
      </h3>
      <div className="max-w-xl space-y-5">
        <div className="origin-top transform sm:scale-[1.03]">
          <AuthInput
            name="name"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            onValidChange={setIsNameValid}
          />
        </div>
        <div className="origin-top transform sm:scale-[1.03]">
          <AuthInput
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => onChangeNickname(e.target.value)}
            onValidChange={setIsNickValid}
          />
        </div>
      </div>
    </div>
  );
}
