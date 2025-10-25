import { useEffect } from "react";
import InputField from "./InputField";
import { useValidation } from "@/hook/useValidation";

interface InputGroupProps {
  name: "nickname" | "id" | "password" | "passwordConfirm";
  placeholder?: string;
  value: string;
  passwordValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidChange?: (valid: boolean | null) => void;
}

const InputGroup = ({
  placeholder,
  name,
  value,
  passwordValue,
  onChange,
  onValidChange,
}: InputGroupProps) => {
  const { isValid, validate, messages } = useValidation(name, passwordValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(e);
    validate(val); // ✅ 입력될 때 자동 유효성 검사
  };

  useEffect(() => {
    if (onValidChange) onValidChange(isValid);
  }, [isValid]);

  return (
    <div className="flex flex-col">
      <InputField
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        type={name.includes("password") ? "password" : "text"}
        showToggle={name.includes("password")}
      />
      {isValid === false && (
        <p className="text-xs text-red-500 mt-1 pl-2">{messages[name][0]}</p>
      )}
      {isValid === true && (
        <p className="text-xs text-green-500 mt-1 pl-2">{messages[name][1]}</p>
      )}
    </div>
  );
};

export default InputGroup;
