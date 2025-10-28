import { X } from "lucide-react";

type CloseButtonProps = {
  onClick: () => void;
  className?: string;
  size?: number;
};

const CloseButton = ({ onClick, className, size = 22 }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-3 right-3 text-neutral-400 transition hover:text-neutral-600 ${className}`}
    >
      <X size={size} />
    </button>
  );
};

export default CloseButton;
