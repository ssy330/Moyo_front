type GroupActionButtonProps = {
  label: "만들기" | "참여하기";
  onClick?: () => void;
};

const GroupActionButton = ({ label, onClick }: GroupActionButtonProps) => {
  return (
    <button
      type="button"
      className="w-full h-48 rounded-xl bg-white border border-gray-200 shadow-sm
                         flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
        +
      </div>
      <span className="text-gray-700 font-medium">{label}</span>
    </button>
  );
};

export default GroupActionButton;
