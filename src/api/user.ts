import client from "@/api/client";

export interface User {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profileImage: string;
  createdAt: string;
}

export async function fetchMe(): Promise<User> {
  const res = await client.get<User>("/users/me");
  return res.data;
}
