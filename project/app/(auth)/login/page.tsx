"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserRole } from "@/types/user";
import { AuthService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  ShieldCheck,
  User,
  Building,
  Briefcase,
  Shield,
  ArrowRight,
  Lock,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["resident", "authority", "officer", "admin"] as const),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_PRESETS: {
  role: UserRole;
  label: string;
  email: string;
  desc: string;
  icon: React.ElementType;
  route: string;
}[] = [
  {
    role: "resident",
    label: "Alex Morgan",
    email: "alex.morgan@community.org",
    desc: "Resident (Ward 4)",
    icon: User,
    route: "/resident/dashboard",
  },
  {
    role: "authority",
    label: "Marcus Vance",
    email: "marcus.vance@civic.gov.local",
    desc: "Authority Admin",
    icon: Building,
    route: "/authority/dashboard",
  },
  {
    role: "officer",
    label: "Elena Rostova",
    email: "elena.rostova@pwi.gov.local",
    desc: "Field Officer (Public Works)",
    icon: Briefcase,
    route: "/officer/dashboard",
  },
  {
    role: "admin",
    label: "Sarah Jenkins",
    email: "sarah.jenkins@admin.gov.local",
    desc: "City Administrator",
    icon: Shield,
    route: "/admin/dashboard",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex.morgan@community.org",
      password: "password123",
      role: "resident",
    },
  });

  const selectedRole = watch("role");

  const selectPreset = (preset: (typeof DEMO_PRESETS)[0]) => {
    setValue("email", preset.email);
    setValue("password", "password123");
    setValue("role", preset.role);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await AuthService.login(data.email, data.role);

      const targetPreset = DEMO_PRESETS.find((p) => p.role === data.role);
      router.push(targetPreset?.route || "/resident/dashboard");
    } catch {
      setErrorMsg("Invalid credentials. Please select one of the demo roles.");
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
          Sign In to Civic Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Access your resident dashboard, department worklist, or authority console.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Switcher Card */}
        <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-4 mb-5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
              1-Click Demo Profiles
            </span>
            <span className="text-[11px] text-teal-700 font-medium">Click to populate</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isCurrent = selectedRole === preset.role;
              return (
                <button
                  type="button"
                  key={preset.role}
                  onClick={() => selectPreset(preset)}
                  className={cn(
                    "flex flex-col text-left p-2.5 rounded-lg border text-xs transition-all",
                    isCurrent
                      ? "bg-white border-teal-600 shadow-xs ring-1 ring-teal-600"
                      : "bg-white/80 border-slate-200 hover:bg-white text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Icon className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 shadow-md">
          {errorMsg && (
            <Alert variant="error" className="mb-5">
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="flex justify-end pt-0.5">
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full justify-center h-11"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New community resident?{" "}
              <Link
                href="/register"
                className="font-semibold text-teal-600 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer Back Link */}
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

