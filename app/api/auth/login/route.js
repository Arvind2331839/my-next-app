import { connectDB } from "@/lib/databaseConnection";
import { generateOTP, response } from "@/lib/helperFunctions";
import UserModel from "@/model/userModel";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { baseUserSchema} from "@/lib/zodSchema";
import OTPModel from "@/model/otpModel";
import { otpEmail } from "@/email/otpVerification";
import showTost from "@/lib/showTost";

const SECRET_KEY = process.env.SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";


export const loginSchema = baseUserSchema.pick({
  email: true,
  password: true,
});

export async function POST(request) {

  try {
    await connectDB();
    const body = await request.json();

    // ✅ Validate input
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validated.error.format()
      );
    }

    const { email, password } = validated.data;

    // ✅ Check if user exists
    const user = await UserModel.findOne({deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found with this Email");
    }

    // ✅ If user not verified, send verification email
    if (!user.isEmailVerified) {
      // Generate verification token
      const secret = new TextEncoder().encode(SECRET_KEY);
      const token = await new SignJWT({ userId: user._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      // Send email
      await sendMail(
        "Email verification request from developer goswami",
        email,
        emailVerificationLink(`${BASE_URL}/api/auth/verifyEmail/${token}`)
      );

      return response(false, 403, "first, Verify your email");
    }

    // ✅ Check password
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return response(false, 401, "Invalid Password");
    }
    //send OTP For verification
    await OTPModel.deleteMany({ email }); //deleating old otp's
    const otp = generateOTP();
    console.log("OTP Generation", otp);
    const newOtpData = new OTPModel({
      email,
      otp,
    });
    await newOtpData.save();

    const otpEmailStatus = await sendMail(
      "login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "failed to send otp");
    }
    return response(true, 200, "please verify your device");

    // ✅ Generate JWT token
    // const secret = new TextEncoder().encode(SECRET_KEY);
    // const token = await new SignJWT({
    //   userId: user._id.toString(),
    //   email: user.email,
    // })
    //   .setIssuedAt()
    //   .setExpirationTime("7d")
    //   .setProtectedHeader({ alg: "HS256" })
    //   .sign(secret);

    // return response(true, 200, "Login successful", {
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //   },
    // });
  } catch (error) {
    console.error("Login error:", error);
    return response(false, 500, "Internal server error", {
      message: error?.message || String(error),
    });
  }
}
