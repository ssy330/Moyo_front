import AuthInput from "@/components/authComponents/AuthInput";

interface Props {
  password: string;
  passwordConfirm: string;
  onChangePassword: (v: string) => void;
  onChangePasswordConfirm: (v: string) => void;
  setIsPwValid: (v: boolean | null) => void;
  setIsPwMatch: (v: boolean | null) => void;
}

export default function RegisterStep4Password({
  password,
  passwordConfirm,
  onChangePassword,
  onChangePasswordConfirm,
  setIsPwValid,
  setIsPwMatch,
}: Props) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
        비밀번호 설정
      </h3>
      <div className="max-w-xl space-y-5">
        <div className="origin-top transform sm:scale-[1.03]">
          <AuthInput
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            onValidChange={setIsPwValid}
          />
        </div>
        <div className="origin-top transform sm:scale-[1.03]">
          <AuthInput
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            passwordValue={password}
            onChange={(e) => onChangePasswordConfirm(e.target.value)}
            onValidChange={setIsPwMatch}
          />
        </div>
      </div>
    </div>
  );
}
