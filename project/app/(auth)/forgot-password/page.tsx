"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    setTimeout(() => {
      setSubmittedEmail(data.email);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-teal-400 group-hover:bg-slate-800 transition-colors shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Civic<span className="text-teal-600">Track</span>
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Reset Your Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 shadow-md">
          {submittedEmail ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reset Link Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-800">{submittedEmail}</strong>,
                a secure password reset email has been sent. Check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="default" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@community.org"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full justify-center h-11"
                isLoading={loading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

