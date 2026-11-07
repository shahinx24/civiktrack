// src/components/ui/toast.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps extends ToastMessage {
  onDismiss: () => void;
}

function Toast({ id, type, title, description, onDismiss }: ToastProps) {
  const bg = {
    success: "bg-teal-100 text-teal-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  }[type];

  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-md shadow-md pointer-events-auto",
        bg,
        "min-w-[260px] max-w-sm"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss toast"
        className="text-current hover:opacity-80"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
