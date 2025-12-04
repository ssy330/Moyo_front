// src/components/authComponents/AuthInput.tsx
import { useState, useEffect } from "react";
import { useValidation } from "@/hooks/useValidation";
import { Input } from "@/components/ui/input";
import AuthCountdown from "@/components/authComponents/AuthCountdown";

interface AuthInputProps {
  name:
    | "name"
    | "nickname"
    | "email"
    | "password"
    | "passwordConfirm"
    | "authCode";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  passwordValue?: string;
  disabled?: boolean;
  onValidChange?: (valid: boolean | null) => void;
  autoComplete?: string;
  validateOnChange?: boolean;
  resendKey?: number;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
}

export default function AuthInput({
  name,
  value,
  onChange,
  placeholder,
  passwordValue,
  disabled = false,
  onValidChange,
  autoComplete,
  resendKey,
  validateOnChange = true,
  inputClassName,
  size = "md", // ✅ 기본값
}: AuthInputProps) {
  const { isValid, validate, messages } = useValidation(name, passwordValue);

  const [showPw, setShowPw] = useState(false);
  const isPassword = name.includes("password");
  const isAuthCode = name.includes("authCode");
  const inputType = isPassword ? (showPw ? "text" : "password") : "text";

  useEffect(() => {
    onValidChange?.(isValid);
  }, [isValid, onValidChange]);

  useEffect(() => {
    if (name === "passwordConfirm" && value.trim().length > 0) {
      validate(value);
    }
  }, [passwordValue, name, value, validate]);

  const getAutoCompleteValue = () => {
    if (autoComplete) return autoComplete;
    switch (name) {
      case "email":
        return "email";
      case "password":
      case "passwordConfirm":
        return "new-password";
      case "nickname":
        return "nickname";
      case "authCode":
        return "one-time-code";
      default:
        return "off";
    }
  };
  // size로 관리
  const sizeClasses =
    size === "lg"
      ? "h-[60px] text-[16px] md:text-[16px] placeholder:text-[15px] md:placeholder:text-[15px]"
      : size === "sm"
        ? "h-9 text-xs placeholder:text-xs"
        : "h-11 text-sm placeholder:text-sm";

  return (
    <div className="flex flex-col space-y-1">
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e);
            if (validateOnChange) validate(e.target.value);
          }}
          disabled={disabled}
          maxLength={name === "authCode" ? 6 : undefined}
          autoComplete={getAutoCompleteValue()}
          className={`pr-12 ${sizeClasses} ${isAuthCode ? "pr-20 md:pr-24" : ""} ${isValid === false ? "border-red-400" : ""} ${inputClassName ?? ""} `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
          >
            {showPw ? "숨김" : "보기"}
          </button>
        )}

        {isAuthCode && !disabled && (
          <div className="absolute top-1/2 right-3 flex h-6 w-16 -translate-y-1/2 items-center justify-center text-xs">
            <AuthCountdown key={resendKey} initialTime={300} />
          </div>
        )}
      </div>

      {isValid !== null && (
        <p
          className={`mt-1 text-xs leading-4 ${
            isValid ? "text-green-500" : "text-red-500"
          }`}
        >
          {isValid ? messages[name][1] : messages[name][0]}
        </p>
      )}
    </div>
  );
}
