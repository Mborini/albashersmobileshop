// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // فقط عندما يدخل المستخدم على المسار /
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  return NextResponse.next();
}

// شغّل الميدل وير على المسار الجذر فقط
export const config = {
  matcher: ['/'],
};
