// src/pages/profile/ProfilePage.tsx
import { useParams } from "react-router-dom";
export default function ProfilePage() {
  const { id } = useParams();
  return <h1>Profile: {id}</h1>;
}
