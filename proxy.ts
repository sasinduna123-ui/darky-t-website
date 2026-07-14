import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return new NextResponse(
      "Admin username or password is not configured.",
      { status: 500 }
    );
  }

  const authorizationHeader =
    request.headers.get("authorization");

  if (authorizationHeader) {
    const [type, credentials] =
      authorizationHeader.split(" ");

    if (type === "Basic" && credentials) {
      try {
        const decoded = atob(credentials);
        const separatorIndex = decoded.indexOf(":");

        const enteredUsername = decoded.slice(
          0,
          separatorIndex
        );

        const enteredPassword = decoded.slice(
          separatorIndex + 1
        );

        if (
          enteredUsername === adminUsername &&
          enteredPassword === adminPassword
        ) {
          return NextResponse.next();
        }
      } catch {
        // වැරදි login data
      }
    }
  }

  return new NextResponse(
    "Username and password are required.",
    {
      status: 401,
      headers: {
        "WWW-Authenticate":
          'Basic realm="DARKY T Admin", charset="UTF-8"',
      },
    }
  );
}

export const config = {
  matcher: ["/admin/:path*"],
};