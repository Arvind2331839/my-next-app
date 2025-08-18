import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import ButtonLoading from "./ButtonLoading";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import Link from "next/link";
import { baseUserSchema } from "@/lib/zodSchema";

// 4️⃣ OTP Schema (only email + otp)
export const otpSchema = baseUserSchema.pick({
  email: true,
  otp: true,
});

const OTPVerification = ({ email, onSubmit, loading }) => {
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      email,
    },
  });

  const { handleSubmit, formState, register } = form;

  const handleotpVerification = async (values) => {
    onSubmit(values); // values => { email: "...", otp: "123456" }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleotpVerification)}
          className="space-y-6"
          noValidate
        >
          {/* ✅ Hidden email field */}
          <input type="hidden" {...register("email")} />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />

          <div>
            <ButtonLoading
              className="w-full"
              type="submit"
              text="Verify"
              loading={loading}
              disabled={formState.isSubmitting}
            />
          </div>

          <div className="text-center">
            <div className="flex justify-center items-center text-sm mt-2 gap-1">
              <p>Resend OTP?</p>
              <Link
                href="/register"
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Resend
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
