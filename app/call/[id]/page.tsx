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
export default function CallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Trong thực tế, bạn sẽ fetch thông tin user từ API dựa vào params.id
    setUser({
      id: params.id as string,
      name: "User Name",
      avatar: "/placeholder.svg",
      status: "online",
    });
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
