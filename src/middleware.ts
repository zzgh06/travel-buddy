import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 모든 요청에 대해 JWT 토큰을 확인
// 토큰이 없으면 (로그인하지 않은 경우) 로그인 페이지로 리다이렉트
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // matcher 설정을 통해 /planner/create 경로에만 미들웨어를 적용
  matcher: ['/planner/create'],
};