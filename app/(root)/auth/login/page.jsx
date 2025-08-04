"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/assets/images/logo-black.png";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { zSchema } from "@/lib/zodSchema";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { z } from "zod";
// import { Link } from "lucide-react";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/route/websiteRoute";

// If you want to be explicit about the picked schema type:
const formSchema = zSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    password: z.string().min("3", "password firld is required"),
  });

// type FormValues = React.infer<typeof formSchema>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, formState } = form;

  const handleLoginSubmit = async (values) => {
    console.log("clicked");
    console.log(values);
    // perform login...
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
          <h1 className="text-2xl text-center font-bold">Login to account</h1>
          <p className="text-center text-sm">
            Log in to your account by filling out the form below
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleLoginSubmit)}
            className="space-y-6"
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
                    className="absolute top-1/2 mt-1 right-2 cursor-pointer"
                    type="button"
                    onClick={() => setIsTypePassword(!isTypePassword)}
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
                <p>Forget Password ?</p>
                <Link
                  href="/register"
                  className="cursor-pointer  text-blue-600 hover:underline"
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
