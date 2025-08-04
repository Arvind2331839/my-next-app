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
import { WEBSITE_REGISTER } from "@/route/websiteRoute";
import { loginSchema } from "@/lib/zodSchema";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, formState } = form;

  const handleLoginSubmit = async (values) => {
    console.log("clicked");
    console.log('Loged in successfully',values);
    // perform login...
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-center">
          <Image
            className="max-w-[150px]"
            src={Logo}
            alt="Logo"
            priority
          />
        </div>
        <div className="mt-4 mb-4">
          <h1 className="text-2xl text-center font-bold">Login to account</h1>
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
                    aria-label={isTypePassword ? "Show password" : "Hide password"}
                  >
                    {isTypePassword ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <ButtonLoading
                className="w-full"
                type="submit"
                text="Login"
                loading={loading}
                disabled={formState.isSubmitting}
              />
            </div>
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
                  href="/register"
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
