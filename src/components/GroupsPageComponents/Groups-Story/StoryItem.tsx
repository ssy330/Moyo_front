import { Plus } from "lucide-react";

type StoryItemProps = {
  isMine?: boolean;
  onStory: () => void;
  onStoryAdd?: () => void;
};

const StoryItem = ({ isMine = false, onStory, onStoryAdd }: StoryItemProps) => {
  return (
    <div className="relative h-14 w-14 shrink-0 cursor-pointer rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 p-[2px]">
      <div
        className="relative h-full w-full rounded-full bg-white p-[2px]"
        onClick={onStory}
      >
        <div className="h-full w-full rounded-full bg-neutral-300" />
        {/* + 버튼 */}
        {isMine && (
          <button
            className="absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600"
            onClick={(e) => {
              e.stopPropagation();
              onStoryAdd?.();
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryItem;
