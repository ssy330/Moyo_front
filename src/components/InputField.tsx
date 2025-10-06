import { useState } from "react";

//InputFieldProps Interface
interface InputFieldProps {
  placeholder: string;
  type?: "text" | "password" | "email";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
  autoComplete?: string;
  showToggle?: boolean;
}

const InputField = ({
  placeholder,
  type = "text",
  onChange,
  name,
  className,
  autoComplete,
  showToggle,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" && showToggle
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="relative w-full">
      <input
        className={`h-12 px-3 pr-10 w-full rounded-md border border-gray-300 
          focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 
          placeholder-gray-400 bg-white shadow-sm ${className}`}
        placeholder={placeholder}
        type={inputType}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
      />

      {type === "password" && showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 text-sm"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "숨김" : "보기"}
        </button>
      )}
    </div>
  );
};

export default InputField;
