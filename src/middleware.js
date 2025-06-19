import { NextResponse } from "next/server";

export const config = {
  matcher: "/integrations/:path*",
};

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-createxyz-project-id", "e8fc01ea-8be5-40eb-8f67-4f164eb6b69a");
  requestHeaders.set("x-createxyz-project-group-id", "f083e809-bb69-41e4-a100-ec6d8d1f4fb8");


  request.nextUrl.href = `https://www.create.xyz/${request.nextUrl.pathname}`;

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}