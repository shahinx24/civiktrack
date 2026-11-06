import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxChars,
      id,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold text-slate-700 tracking-wide"
            >
              {label}
              {props.required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
          )}
          {maxChars && (
            <span className="text-xs text-slate-400">
              {charCount}/{maxChars}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          disabled={disabled}
          maxLength={maxChars}
          className={cn(
            "flex min-h-[96px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            error && "border-rose-400 focus:ring-rose-500",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

