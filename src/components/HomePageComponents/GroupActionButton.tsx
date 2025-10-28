/**
 * GroupPanel의 만들기, 참여하기 버튼 컴포넌트
 */
type GroupActionButtonProps = {
  label: "만들기" | "참여하기";
  onClick?: () => void;
};

const GroupActionButton = ({ label, onClick }: GroupActionButtonProps) => {
  return (
    <button
      type="button"
      className="flex h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
        +
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default GroupActionButton;
