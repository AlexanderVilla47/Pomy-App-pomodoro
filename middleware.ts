import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = ["/login", "/api/auth", "/_next", "/favicon.ico"];

/**
 * El deploy de Vercel sigue vivo con el mismo codigo aunque la app ya vive en
 * su dominio propio. Quien entra por el link viejo ve el aviso de mudanza en
 * vez de la app. La API queda afuera: una PWA instalada desde ese link puede
 * tener sesiones en la cola offline, que reintenta para siempre todo lo que
 * no sea 201 o 409.
 */
function isLegacyVercelHost(host: string | null) {
  return host?.endsWith(".vercel.app") ?? false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    isLegacyVercelHost(request.headers.get("host")) &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.rewrite(new URL("/mudanza", request.url));
  }

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
