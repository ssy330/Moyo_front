/**
 * 메인에 있는 그룹에 들어갈 수 있는 버튼(카드)
 */

type GroupCardProps = {
  id: number;
  title: string;
  memberNum: number;
  imageUrl?: string;
  onClick?: (id: number) => void;
};

const GroupCard = ({
  id,
  title,
  memberNum,
  imageUrl,
  onClick,
}: GroupCardProps) => {
  return (
    <div
      onClick={() => onClick?.(id)}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:shadow-md"
    >
      {/* 상단 이미지 */}
      <div className="h-32 w-full bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-gray-800">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">멤버 {memberNum}</p>
      </div>
    </div>
  );
};

export default GroupCard;
