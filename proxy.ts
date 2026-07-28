import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define quais rotas não precisam de senha (Convites, Acompanhamento e Login)
  const isPublicRoute = path.startsWith('/convite') || path.startsWith('/acompanhar') || path === '/login';

  // Verifica se o carimbo (cookie) de organizador existe
  const isAuth = request.cookies.get('organizador_auth')?.value === 'logado';

  // Se a rota for privada e o usuário não estiver logado, chuta pro login
  if (!isAuth && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se ele já estiver logado e tentar acessar a tela de login, joga pro painel
  if (isAuth && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};