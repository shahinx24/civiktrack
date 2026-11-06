import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "accent"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] select-none";

    const variants: Record<string, string> = {
      default:
        "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 shadow-sm",
      accent:
        "bg-teal-600 text-white hover:bg-teal-700 focus-visible:outline-teal-600 shadow-sm shadow-teal-600/10",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:outline-slate-400",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:outline-teal-600 shadow-xs",
      ghost:
        "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600 shadow-sm",
      link:
        "text-teal-600 underline-offset-4 hover:underline p-0 h-auto font-normal",
    };

    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

