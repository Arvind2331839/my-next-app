import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { baseUserSchema } from "@/lib/zodSchema";
import UserModel from "@/model/userModel";
import { SignJWT } from "jose";

const SECRET_KEY = process.env.SECRET_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const registerSchema = baseUserSchema.pick({
  name: true,
  email: true,
  password: true,
});

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const validated = registerSchema.safeParse(payload);
    console.log("validated", validated);
    if (!validated.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validated.error.format()
      );
    }

    const { name, email, password } = validated.data;

    // check if user already exists
    const existing = await UserModel.exists({ email });
    if (existing) {
      return response(true, 409, "User already registered");
    }

    // create new user (password will be hashed by pre-save hook)
    const newUser = new UserModel({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();

    // generate verification token
    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({ userId: savedUser._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // send verification email
    await sendMail(
      "Email verification request from developer goswami",
      email,
      emailVerificationLink(`${BASE_URL}/api/auth/mail/${token}`)
    );

    return response(
      true,
      200,
      "Registration success, please verify your email address",
      {
        user: savedUser,
      }
    );
  } catch (error) {
    // console.error("Registration error:", error);
    return response(false, 500, "Internal server error", {
      message: error?.message || String(error),
    });
  }
}
