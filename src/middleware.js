import { NextResponse } from "next/server";

const protectedRoutes = ["/client"];
const locales = ["lt", "en"];

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

  const defaultLocale = locales[0];
  const pathname = req.nextUrl.pathname;
  const locale = req.nextUrl.locale;

  if (!locales.includes(locale)) {
    const acceptLanguage = req.headers.get("accept-language");
    let detectedLocale = defaultLocale;

    if (acceptLanguage) {
      const requestedLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.trim().split(";")[0].split("-")[0]);
      detectedLocale =
        locales.find((locale) => requestedLocales.includes(locale)) ||
        defaultLocale;
    }

    if (detectedLocale !== defaultLocale) {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/${detectedLocale}${pathname}`
      );
    }
  }

  if (isLogedIn && locales.includes(locale)) {
    return NextResponse.next();
  }

  return NextResponse.next();
};
