import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  id: number;
  name: string;
  image_url?: string | null;
  member_count?: number;
}

export default function GroupCard({
  id,
  name,
  image_url,
  member_count,
}: GroupCardProps) {
  const nav = useNavigate();
  return (
    <div
      key={id}
      onClick={() => nav(`/groups/${id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image_url || "/images/placeholder-group.jpg"}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-800">{name}</h3>
        {typeof member_count === "number" && (
          <p className="mt-1 text-sm text-neutral-500">멤버 {member_count}명</p>
        )}
      </div>
    </div>
  );
}
