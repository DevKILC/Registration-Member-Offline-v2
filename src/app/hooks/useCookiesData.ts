'use server'

import { cookies } from "next/headers";

export const getCookies = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie;
};