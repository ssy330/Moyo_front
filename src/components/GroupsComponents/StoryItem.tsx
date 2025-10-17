import { Plus } from "lucide-react";

type StoryItemProps = {
  isMine?: boolean;
  onClick: () => void;
};

const StoryItem = ({ isMine = false, onClick }: StoryItemProps) => {
  return (
    <div className="relative h-14 w-14 shrink-0 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 p-[2px]">
      <div className="h-full w-full rounded-full bg-white p-[2px] relative">
        <div className="h-full w-full rounded-full bg-neutral-300" />
        {/* + 버튼 */}
        {isMine && (
          <button
            className="absolute bottom-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
            onClick={onClick}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryItem;
