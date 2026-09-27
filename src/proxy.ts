import { NextRequest, NextResponse } from "next/server";
import { getSession, refreshSession } from "@/libs/session";

const roleDashboards: Record<string, string> = {
  Mahasiswa: "/mahasiswa",
  "Dosen Capstone Project": "/dosen-capstone-project",
  "Dosen Pembimbing": "/dosen-pembimbing",
  Kaprodi: "/kaprodi",
};

const authPaths = ["/reset-akun", "/lupa-password", "/reset-password"];
const protectedPaths = ["/mahasiswa", "/dosen-capstone-project", "/dosen-pembimbing", "/kaprodi"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSession();

  const isAccessingResetAkun = pathname.startsWith("/reset-akun");
  const isAccessingProtectedPage = protectedPaths.some((path) => pathname.startsWith(path));

  // Kondisi 1 : Jika belum login
  if (!session) {
    const mustRedirectToLogin = isAccessingResetAkun || isAccessingProtectedPage;

    if (mustRedirectToLogin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Kondisi 2 : Sudah login tapi belum reset akun
  if (!session.isAccountReset) {
    if (!isAccessingResetAkun) {
      return NextResponse.redirect(new URL("/reset-akun", request.url));
    }

    return NextResponse.next();
  }

  // Kondisi 3 : Sudah login
  const userDashboard = roleDashboards[session.role];

  const isAccessingRoot = pathname === "/";
  const isAccessingAuthPage = authPaths.some((path) => pathname.startsWith(path));
  const isAccessingWrongDashboard = isAccessingProtectedPage && !pathname.startsWith(userDashboard);
  const shouldRedirectToDashboard = isAccessingRoot || isAccessingAuthPage || isAccessingWrongDashboard;

  if (shouldRedirectToDashboard) {
    return NextResponse.redirect(new URL(userDashboard, request.url));
  }

  await refreshSession();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
