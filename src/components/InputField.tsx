//InputFieldProps Interface
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
      className={`h-12 px-3 w-full rounded-md border border-gray-300 
        focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 
        placeholder-gray-400 bg-white shadow-sm ${className}`}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      name={name}
    />
  );
};

export default InputField;
