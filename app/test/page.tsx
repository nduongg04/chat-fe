"use client";

import { auth } from "@/auth";
import { useSession } from "next-auth/react";

const Test =  () => {
  const { data: session } = useSession()

	// const session = await auth();
	console.log(session);
	return <div>Test</div>;
};

export default Test;
