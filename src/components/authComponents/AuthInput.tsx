import { useState } from "react";

//InputFieldProps Interface
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showToggle?: boolean;
}

const AuthInput = ({
  type = "text",
  showToggle,
  ...props
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
        {...props}
        className={`h-12 w-full rounded-md border border-gray-300 bg-white px-3 pr-10 placeholder-gray-400 shadow-sm focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none ${props.className}`}
        type={inputType}
        autoComplete={props.autoComplete}
      />

      {type === "password" && showToggle && (
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "숨김" : "보기"}
        </button>
      )}
    </div>
  );
};

export default AuthInput;
