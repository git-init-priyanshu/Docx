"use server"

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function GetUserDetails() {
  const token = cookies().get('token')?.value;

  if (!token) return;
  const decoded = jwtDecode(token!);
  return decoded;
}
