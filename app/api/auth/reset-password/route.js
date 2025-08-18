// app/api/auth/resetPassword/route.js
import { z } from "zod";
import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/model/userModel";
import { baseUserSchema } from "@/lib/zodSchema";

export const resetPasswordSchema = baseUserSchema.pick({
  email: true,
  password: true,
});

export async function POST(req) {
  try {
    await connectDB();

    // ✅ Parse & validate body
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid or missing input fields",
          errors: parsed.error.format(),
        }),
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // ✅ Find user (respect soft-delete if you use it)
    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Set new password (hashing will run in your schema's pre('save'))
    user.password = password;
    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("resetPassword error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error?.message || String(error),
      }),
      { status: 500 }
    );
  }
}
