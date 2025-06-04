"use client";

import React, { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { cn } from "@/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: "mail" | "lock";
  label?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, icon, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative w-full">
        <div className="flex items-center rounded-3xl bg-white px-6 py-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          <span className="text-gray-400">
            {icon === "mail" && <Mail size={20} />}
            {icon === "lock" && <Lock size={20} />}
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <input
            type={isPasswordType && showPassword ? "text" : type}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-gray-400",
              className
            )}
            placeholder={label}
            ref={ref}
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";
