export default function GroupError({ error }: { error: Error }) {
  return (
    <div className="mb-7 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error.message}
    </div>
  );
}
