"use client";

import * as React from "react";
import Toast from "@/components/ui/toast";
import { ToastMessage, ToastType } from "@/components/ui/toast";

interface ToastContextProps {
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, ...msg }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container positioned bottom‑right */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
