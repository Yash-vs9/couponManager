import React from "react";

export type ButtonVariant = "default" | "outline" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<ButtonVariant, string> = {
    default: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md",
    outline: "border border-gray-600 text-white hover:bg-gray-800 shadow-sm",
    ghost: "text-white hover:bg-gray-800",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}