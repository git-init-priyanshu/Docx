"use server";

import { jwtVerify, importJWK } from "jose";
import { cookies } from "next/headers";

export async function GetUserDetails() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const { payload } = await jwtVerify(token, jwk);
    return payload as { id?: string; name?: string; email?: string; picture?: string };
  } catch {
    return null;
  }
}
