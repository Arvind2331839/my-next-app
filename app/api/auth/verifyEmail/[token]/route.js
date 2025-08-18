import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/model/userModel";

const SECRET_KEY = process.env.SECRET_KEY || "";

const makeAbsolute = (request, path) => {
  const url = new URL(request.url);
  return new URL(path, `${url.protocol}//${url.host}`).toString();
};
// console.log("makeAbsolute", makeAbsolute);
export async function GET(request, { params }) {
  try {
    await connectDB();

    const url = request.nextUrl;
    const token = url.pathname.split("/").pop();

    if (!token) {
      return NextResponse.redirect(
        makeAbsolute(request, "/auth/verify_email/failure?reason=missing_token")
      );
    }

    // verify JWT
    let verifiedPayload;
    try {
      const secret = new TextEncoder().encode(SECRET_KEY);
      const { payload } = await jwtVerify(token, secret);
      verifiedPayload = payload;
      // console.log("verified payload:", verifiedPayload);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return NextResponse.redirect(
        makeAbsolute(
          request,
          "/auth/verify_email/failure?reason=invalid_or_expired"
        )
      );
    }

    const userId =
      verifiedPayload.userId ||
      verifiedPayload.userID ||
      verifiedPayload.user_id;
    // console.log("userId:", userId);
    if (!userId) {
      console.log("malformed_token");
      return NextResponse.redirect(
        makeAbsolute(
          request,
          "/auth/verify_email/failure?reason=malformed_token"
        )
      );
    }

    const user = await UserModel.findById(userId);
    // console.error("user:", user);
    if (!user) {
      console.log("user_not_found");
      return NextResponse.redirect(
        makeAbsolute(
          request,
          "/auth/verify_email/failure?reason=user_not_found"
        )
      );
    }

    if (user.isEmailVerified) {
      console.log("already_verified");
      return NextResponse.redirect(
        makeAbsolute(request, "/auth/verify_email/already_verified")
      );
    }

    user.isEmailVerified = true;
    await user.save();

    return NextResponse.redirect(
      makeAbsolute(request, "/auth/verify_email/success")
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      makeAbsolute(request, "/auth/verify_email/failure?reason=server_error")
    );
  }
}
