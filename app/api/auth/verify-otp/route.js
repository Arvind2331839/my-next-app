import OTPModel from "@/model/otpModel";
import { response } from "@/lib/helperFunctions"; // your response() helper
import { connectDB } from "@/lib/databaseConnection";
import { SignJWT } from "jose";
import UserModel from "@/model/userModel";

export async function POST(request) {
  const SECRET_KEY = process.env.SECRET_KEY || "";

  try {
    await connectDB();

    const { email, otp } = await request.json();
 // 1️⃣ Check required fields
    if (!email || !otp) {
      return response(false, 400, "Email and OTP are required");
    }

    // ✅ Check if user exists
    const user = await UserModel.findOne({ email });

    // 2️⃣ Find OTP record for this email
    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return response(false, 404, "No OTP found for this email, logi Again");
    }

    // 3️⃣ Check if OTP is expired
    if (otpRecord.expiredAt < new Date()) {
      return response(false, 400, "OTP has expired");
    }

    // 4️⃣ Match OTP
    if (otpRecord.otp !== otp) {
      return response(false, 400, "Invalid OTP");
    }

    // 5️⃣ OTP is valid → delete it for one-time use
    await OTPModel.deleteOne({ _id: otpRecord._id });

    // ✅ Generate JWT token
    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role:user.role,
    })
      .setIssuedAt()
      .setExpirationTime("7d")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    return response(true, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role,
      },
    });
    // 6️⃣ Success response
    // return response(true, 200, "OTP verified successfully");
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return response(false, 500, "Internal server error", {
      message: error?.message || String(error),
    });
  }
}
