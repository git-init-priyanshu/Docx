import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const nextAuthSession = request.cookies.get("next-auth.session-token")?.value;

  if (!token && !nextAuthSession) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/writer/:id*"],
};
