"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ShieldCheck, ArrowRight, User, Mail, Lock, Phone } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    ward: z.string().min(1, "Please select your municipal ward"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    terms: z.literal(true, {
      message: "You must accept the Civic Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const WARDS = [
  { label: "Ward 1 - Downtown Civic Center", value: "Ward 1 - Downtown" },
  { label: "Ward 2 - Highland Park District", value: "Ward 2 - Highland Park" },
  { label: "Ward 3 - Old Town & Heritage Corridor", value: "Ward 3 - Old Town" },
  { label: "Ward 4 - Riverside & Waterfront", value: "Ward 4 - Riverside" },
  { label: "Ward 5 - West Hills & Suburbs", value: "Ward 5 - West Hills" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ward: "Ward 4 - Riverside",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await AuthService.register(data.name, data.email, data.ward);
      router.push("/resident/dashboard");
    } catch {
      setErrorMsg("Failed to create resident account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
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
          Create Resident Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Join your local neighborhood network to report issues and track resolutions.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 sm:p-8 shadow-md">
          {errorMsg && (
            <Alert variant="error" className="mb-5">
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Legal Name"
              placeholder="e.g. Alex Morgan"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@community.org"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 234-5678"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Select
              label="Residential Ward District"
              options={WARDS}
              error={errors.ward?.message}
              {...register("ward")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  {...register("terms")}
                />
                <span>
                  I agree to the CivicTrack Community Guidelines and verify I am a
                  resident reporting in good faith.
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-rose-600 font-medium">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center h-11 mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Register & Enter Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-teal-600 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

