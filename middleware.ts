// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  return NextResponse.next();
}

// شغّل الميدل وير على المسار الجذر فقط
export const config = {
  matcher: ["/"],
};
