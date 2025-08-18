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
import { z } from "zod";
import Link from "next/link";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { WEBSITE_LOGIN } from "@/route/websiteRoute";
import axios from "axios";
import showTost from "@/lib/showTost";
import { baseUserSchema } from "@/lib/zodSchema";

// 2️⃣ Register Schema (uses pick + refine for password match)
export const registerSchema = baseUserSchema
  .pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // Registration api calling
  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: registerResponce } = await axios.post(
        "/api/auth/register",
        values
      );
      if (!registerResponce.success) {
        throw new Error(registerResponce.message);
      }
      form.reset();
      // alert(registerResponce.message);
       showTost('success',registerResponce.message)
    } catch (error) {
      // alert(error.message);
      showTost('error',error.message)
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <Image
            className="max-w-[150px]"
            src={Logo.src}
            alt="Logo"
            width={Logo.width}
            height={Logo.height}
          />
        </div>
        <div className="mt-4 mb-4">
          <h1 className="text-2xl text-center font-bold">Create an account</h1>
          <p className="text-center text-sm">
            Register by filling out the form below
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleRegisterSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...field}
                      aria-invalid={!!errors.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      aria-invalid={!!errors.email}
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
                      type={showPassword ? "password" : "text"}
                      placeholder="********"
                      {...field}
                      aria-invalid={!!errors.password}
                    />
                  </FormControl>
                  <button
                    className="absolute top-1/2 mt-1 right-2 cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "password" : "text"}
                      placeholder="********"
                      {...field}
                      aria-invalid={!!errors.confirmPassword}
                    />
                  </FormControl>
                  <button
                    className="absolute top-1/2 mt-1 right-2 cursor-pointer"
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                  >
                    {showConfirmPassword ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <ButtonLoading
                className="w-full"
                type="submit"
                text="Register"
                loading={loading}
                disabled={isSubmitting}
              />
            </div>

            <div className="text-center">
              <div className="flex justify-center items-center gap-1">
                <p>Already have an account?</p>
                <Link
                  href={WEBSITE_LOGIN}
                  className="cursor-pointer font-medium text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Register;
