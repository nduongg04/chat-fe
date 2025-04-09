"use server"

import { auth } from "@/auth"

export const fetchSomeThing = async () => {
  const session = await auth()
  const accessToken = session?.user.accessToken
  const userId = session?.user.id
  console.log("accessToken", accessToken)
  console.log("userId", userId)
}