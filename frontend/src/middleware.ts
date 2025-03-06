import { NextRequest, NextResponse } from 'next/server';

// Шляхи, доступні без авторизації
// const publicPaths = ['/auth/login', '/auth/register', '/'];

// Шляхи, які потребують авторизації
const authPaths = ['/schedule', '/stations'];

export function middleware(request: NextRequest): NextResponse {
  const currentPath = request.nextUrl.pathname;
  const hasAuthToken = !!request.cookies.get('auth_access_token')?.value;

  // Виключення статичних файлів та API з перевірки
  if (
    currentPath.startsWith('/_next') || 
    currentPath.startsWith('/api') || 
    currentPath.includes('.')
  ) {
    return NextResponse.next();
  }

  // Перенаправлення неавторизованих користувачів з захищених сторінок на сторінку входу
  if (!hasAuthToken && authPaths.some(path => currentPath.startsWith(path))) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', currentPath);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Шляхи, які потребують авторизації
     */
    '/schedule/:path*',
    '/stations/:path*',
    /*
     * Шляхи аутентифікації 
     */
    '/auth/login',
    '/auth/register'
  ]
}; 