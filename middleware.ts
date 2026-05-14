import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session =
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (request.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/document", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/document", "/writer/:id*"],
};
