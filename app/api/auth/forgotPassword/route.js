import { connectDB } from "@/lib/databaseConnection";
import { generateOTP, response } from "@/lib/helperFunctions";
import UserModel from "@/model/userModel";
import OTPModel from "@/model/otpModel";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpVerification";
import { z } from "zod";

// ✅ Forgot password schema (sirf email ke liye)
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // ✅ Validate input
    const validated = forgotPasswordSchema.safeParse(body);
    if (!validated.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validated.error.format()
      );
    }

    const { email } = validated.data;
  
    // ✅ Check if user exists
    const user = await UserModel.findOne({ deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found");
    }

    // ✅ Store OTP in DB (delete old OTP if exists)
    await OTPModel.deleteMany({ email }); //deleating old otp's
    // ✅ Generate OTP
    const otp = generateOTP(); // example: 6 digit random code

    console.log("OTP Generation", otp);
    const newOtpData = new OTPModel({
      email,
      otp,
    });
    await newOtpData.save();

    // ✅ Send OTP to email
    const otpEmailStatus = await sendMail(
      "Forgot Password Verification Code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send OTP");
    }

    return response(true, 200, "OTP sent successfully", { email });
  } catch (error) {
    console.error("Forgot password error:", error);
    return response(false, 500, "Internal server error", {
      message: error?.message || String(error),
    });
  }
}
