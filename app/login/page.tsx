"use client";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { InputField } from "@/components/input-field";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "gilead@gabiarc.com" && password === "Admin@gilead123") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/landing-page");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-x-4 md:flex-row h-screen">
      {/* Left Side */}
      <div className="w-full flex flex-col md:w-1/2 p-4 items-center justify-center rounded-3xl bg-[#F8F8F8] shadow-[0_0_6px_rgba(0,0,0,0.2)]">
        <div className="w-full max-w-[400px]">
          <div className="mb-6">
            <Image
              src="/GileadLogo.svg"
              alt="Gilead Logo"
              width={120}
              height={30}
              className="mb-4"
            />
            <div
              className="text-xl mb-1 font-medium text-[#27272A]"
              style={{ fontFamily: "Calibri, sans-serif" }}
            >
              Welcome to GABI ARC
            </div>
            <p className="text-sm text-[#909090]">
              Stay ahead with AI-powered content aggregation and summarization
              for executives, teams, and professionals.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-y-4">
              <InputField
                type="text"
                icon="mail"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <InputField
                type="password"
                icon="lock"
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex -mt-2 items-center justify-between">
              <Checkbox id="remember-me" label="Remember me" />
              <Link
                href="/forgot-password"
                className="text-[12px] text-[#27272A] hover:text-crimson-600"
              >
                Forgot Password
              </Link>
            </div>

            <Button variant="danger" fullWidth onClick={handleLogin}>
              Sign In
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#F8F8F8] px-2 text-gray-500">
                  Or login with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">SSO Login</Button>
              <Button
                variant="outline"
                leftIcon={
                  <Image
                    src="/microsoft_logo.svg"
                    alt="Microsoft"
                    width={18}
                    height={18}
                  />
                }
              >
                Microsoft
              </Button>
            </div>
          </div>

          <div className="mt-5 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#27272A]">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 h-full">
        <img
          src="/LoginPageImage.png"
          alt="Platform Interface"
          className="w-full h-full object-inherit"
        />
      </div>
    </div>
  );
}
