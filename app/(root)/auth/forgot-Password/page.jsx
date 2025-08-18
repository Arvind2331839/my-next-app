"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/assets/images/logo-black.png";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { z } from "zod";
import axios from "axios";
import showTost from "@/lib/showTost";
import OTPVerification from "@/components/Application/OTPVerification";

// Schemas
const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [isTypeConfirmPassword, setIsTypeConfirmPassword] = useState(true);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [otpEmail, setOtpEmail] = useState("");

  // Step 1 form (email)
  const emailForm = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  // Step 3 form (reset password)
  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Step 1 → Send OTP
  const handleSendOtp = async (values) => {
   try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/forgotPassword", values);
      if (!data.success) throw new Error(data.message);
     showTost("success", data.message);
      setOtpEmail(values.email);
      setStep(2);
    } catch (error) {
      showTost("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify OTP
  const handleOtpVerification = async (values) => {
   try {
      setOtpVerificationLoading(true);
      const { data } = await axios.post("/api/auth/verify-otp", values);
      if (!data.success) throw new Error(data.message);

      showTost("success", data.message);
      setStep(3);
    } catch (error) {
      showTost("error", error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  // Step 3 → Reset password
  const handleResetPassword = async (values) => {
    try {
      setResetLoading(true);
      const { data } = await axios.post("/api/auth/reset-password", {
        email: otpEmail,
        password: values.password,
      });
      if (!data.success) throw new Error(data.message);

      showTost("success", data.message);
      window.location.href = "/auth/login";
    } catch (error) {
      showTost("error", error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <Image className="max-w-[150px]" src={Logo} alt="Logo" priority />
        </div>

        <div className="mt-4 mb-4">
          <h1 className="text-2xl text-center font-bold">Forgot Password</h1>
          <p className="text-center text-sm">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {step === 1 && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleSendOtp)}
              className="space-y-6"
              noValidate
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                className="w-full"
                type="submit"
                text="Send OTP"
                loading={loading}
              />
            </form>
          </Form>
        )}

        {step === 2 && (
          <OTPVerification
            email={otpEmail}
            onSubmit={handleOtpVerification}
            loading={otpVerificationLoading}
          />
        )}

        {step === 3 && (
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(handleResetPassword)}
              className="space-y-6"
              noValidate
            >
              {/* Password */}
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type={isTypePassword ? "password" : "text"}
                        placeholder="*******"
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute top-1/2 transform -translate-y-1/2 right-2"
                      type="button"
                      onClick={() => setIsTypePassword((prev) => !prev)}
                    >
                      {isTypePassword ? <IoMdEyeOff /> : <IoEye />}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={isTypeConfirmPassword ? "password" : "text"}
                        placeholder="*******"
                        {...field}
                      />
                    </FormControl>
                    <button
                      className="absolute top-1/2 transform -translate-y-1/2 right-2"
                      type="button"
                      onClick={() => setIsTypeConfirmPassword((prev) => !prev)}
                    >
                      {isTypeConfirmPassword ? <IoMdEyeOff /> : <IoEye />}
                    </button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                className="w-full"
                type="submit"
                text="Reset Password"
                loading={resetLoading}
              />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
