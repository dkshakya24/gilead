import React, { type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "outline"
    | "text"
    | "danger"
    | "secondary"
    | "ghost"
    | "gradient"
    | "outline-danger"
    | "link";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          "flex items-center justify-center cursor-pointer rounded-2xl px-6 py-2 font-medium transition-colors focus:outline-none",
          fullWidth && "w-full",
          disabled && "opacity-50 cursor-not-allowed",
          variant === "primary" &&
            "bg-crimson-600 text-white hover:bg-crimson-700 focus:ring-crimson-500",
          variant === "outline" &&
            "border border-gray-300 bg-gray-50 text-gray-700 hover:bg-white focus:ring-gray-500",
          variant === "text" &&
            "text-crimson-600 hover:bg-gray-50 hover:text-crimson-700",
          variant === "danger" &&
            "bg-[#C5203F] text-white hover:bg-[#a81b36] focus:ring-[#C5203F]",
          variant === "secondary" &&
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
          variant === "gradient" &&
            "bg-gradient-to-r from-[#7E7AFF] to-[#9954D9] text-white hover:opacity-90",
          variant === "outline-danger" &&
            "border border-red-700 text-[#C5203F] hover:bg-red-50",
          variant === "ghost" &&
            "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
          variant === "link" &&
            "text-crimson-600 underline hover:text-crimson-700 px-0 py-0",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
