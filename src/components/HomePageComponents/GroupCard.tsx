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
      className="cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm
                 hover:shadow-md transition duration-200"
    >
      {/* 상단 이미지 */}
      <div className="w-full h-32 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">멤버 {memberNum}</p>
      </div>
    </div>
  );
};

export default GroupCard;
