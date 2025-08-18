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
import Link from "next/link";
import {
  USER_DASHBOARD,
  WEBSITE_FORGOTPASSWORD,
  WEBSITE_REGISTER,
} from "@/route/websiteRoute";
import { z } from "zod";
import axios from "axios";
import showTost from "@/lib/showTost";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { logIn } from "@/store/slice/authSlice";
import { baseUserSchema } from "@/lib/zodSchema";
import { useSearchParams, useRouter } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/route/adminRoute";

// ------------------- Login Schema -------------------
export const loginSchema = baseUserSchema.pick({
  email: true,
  password: true,
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false); // login button loading
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false); // otp button loading
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState(); // email for OTP verification

  // react-hook-form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, formState } = form;

  // ------------------- Login Submit -------------------
  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post(
        "/api/auth/login",
        values
      );

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }

      // Set email for OTP verification before reset
      setOtpEmail(values.email);
      form.reset();

      // Save token
      localStorage.setItem("userToken", loginResponse.data.token);

      showTost("success", loginResponse.message);
    } catch (error) {
      showTost("error", error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- OTP Verification Submit -------------------
  const handleOtpVerification = async (values) => {
    setOtpVerificationLoading(true);
    try {
      const { data } = await axios.post("/api/auth/verify-otp", values);

      if (!data.success) {
        throw new Error(data.message);
      }

      showTost("success", data.message);
      dispatch(logIn(data.data.user));

      // ✅ Redirect after successful OTP verification
      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        data.data.user.role === "admin"
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
    } catch (error) {
      showTost("error", error.message);
      console.error("OTP verification error:", error);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <Image className="max-w-[150px]" src={Logo} alt="Logo" priority />
        </div>

        {!otpEmail ? (
          <>
            <div className="mt-4 mb-4">
              <h1 className="text-2xl text-center font-bold">
                Login to account
              </h1>
              <p className="text-center text-sm">
                Log in to your account by filling out the form below
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={handleSubmit(handleLoginSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@gmail.com"
                          {...field}
                          aria-invalid={!!formState.errors.email}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isTypePassword ? "password" : "text"}
                          placeholder="*******"
                          {...field}
                          aria-invalid={!!formState.errors.password}
                        />
                      </FormControl>
                      <button
                        className="absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer"
                        type="button"
                        onClick={() => setIsTypePassword((prev) => !prev)}
                        aria-label={
                          isTypePassword ? "Show password" : "Hide password"
                        }
                      >
                        {isTypePassword ? <IoMdEyeOff /> : <IoEye />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Login Button */}
                <div>
                  <ButtonLoading
                    className="w-full"
                    type="submit"
                    text="Login"
                    loading={loading}
                    disabled={formState.isSubmitting}
                  />
                </div>

                {/* Links */}
                <div className="text-center">
                  <div className="flex justify-center items-center gap-1">
                    <p>Don’t have an account?</p>
                    <Link
                      href={WEBSITE_REGISTER}
                      className="cursor-pointer font-medium text-blue-600 hover:underline"
                    >
                      Create Account
                    </Link>
                  </div>
                  <div className="flex justify-center items-center text-sm mt-2 gap-1">
                    <p>Forget Password?</p>
                    <Link
                      href={WEBSITE_FORGOTPASSWORD}
                      className="cursor-pointer text-blue-600 hover:underline"
                    >
                      Reset
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </>
        ) : (
          // OTP Verification Form
          <div className="mt-5">
            <OTPVerification
              email={otpEmail}
              onSubmit={handleOtpVerification}
              loading={otpVerificationLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
