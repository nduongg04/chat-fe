"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CallScreen } from "@/components/call-screen";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export default function CallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);


 useEffect(() => {
   const fetchUser = async () => {
     try {
       const response = await fetch(`${API_URL}/users/${params.id}`);
       if (!response.ok) {
         throw new Error("Network response was not ok");
       }
       const data = await response.json();
       setUser({
        id: data.data.user.id,
        name: data.data.user.username,
        avatar: data.data.user.avatar,
        status: data.data.user.status,
       });
       console.log(data);
     } catch (error) {
       console.error("Failed to fetch:", error);
     }
   };

   fetchUser();
 }, [params.id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen w-screen">
      <CallScreen
        user={user}
        callType={searchParams.get("type") as "audio" | "video"}
        open={true}
        onClose={() => window.close()}
      />
    </div>
  );
}
