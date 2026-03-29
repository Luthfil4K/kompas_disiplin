import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // ✅ WAJIB: skip static & next assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ skip login
  if (path.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    
    if (path.startsWith("/monitoring")) {
      if (!["ADMIN", "KABKO_KATIM", "KABAG_TU", "SUPERADMIN"].includes(payload.role)) {
        return NextResponse.redirect(new URL("/monitoring", req.url));
      }
    }

    // if (path.startsWith("/evaluation")) {
    //   if (payload.role !== "ADMIN" || payload.role !== "KABAG_TU") {
    //     return NextResponse.redirect(new URL("/monitoring", req.url));
    //   }
    // }

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}