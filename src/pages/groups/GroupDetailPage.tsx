// src/pages/groups/GroupDetailPage.tsx
import { useParams } from "react-router-dom";
export default function GroupDetailPage() {
  const { id } = useParams();
  return <h1>Group Detail: {id}</h1>;
}
