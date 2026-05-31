import { clsx } from "clsx";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-trust text-white hover:bg-blue-700 focus:ring-blue-200",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus:ring-slate-200",
  ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  to?: string;
}

export function Button({
  children,
  variant = "primary",
  icon,
  className,
  to,
  onClick,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

  if (to) {
    return (
      <Link className={classes} to={to} onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} {...props}>
      {icon}
      {children}
    </button>
  );
}
