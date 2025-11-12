import { useNavigate } from "react-router-dom";

export default function GroupError({ error }: { error: Error }) {
  const nav = useNavigate();

  return (
    <div
      className="mb-7 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      onClick={() => nav(`/groups/2`)}
    >
      {error.message}
    </div>
  );
}
