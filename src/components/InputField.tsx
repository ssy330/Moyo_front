//InputFieldProps
interface InputFieldProps {
  placeholder: string;
  type?: "text" | "password" | "email";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  className?: string;
}

const InputField = ({
  placeholder,
  type = "text",
  onChange,
  name,
  className,
}: InputFieldProps) => {
  return (
    <input
      className={`h-12 bg-gray-200 rounded flex items-center px-3 w-full ${className}`}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      name={name}
    />
  );
};

export default InputField;
