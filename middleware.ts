import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // إذا المستخدم دخل على / مباشرة
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  return NextResponse.next();
}

// تشغيل الميدل وير فقط على الصفحات
export const config = {
  matcher: ['/'],
};
