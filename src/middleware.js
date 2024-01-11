import { NextResponse } from "next/server";
const protectedRoutes = ["/client"];

export const middleware = (req) => {
  const isLogedIn = !!req.cookies.get("MapExplorer");

  if (
    isLogedIn &&
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")
  ) {
    const clientUrl = `${req.nextUrl.origin}/client`;
    return NextResponse.redirect(clientUrl);
  } else if (!isLogedIn && req.nextUrl.pathname === "/client") {
    const loginUrl = `${req.nextUrl.origin}/login`;
    return NextResponse.redirect(loginUrl);
  }
};
