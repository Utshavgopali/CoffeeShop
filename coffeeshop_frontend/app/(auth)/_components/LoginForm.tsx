"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { loginSchema } from "./schema";
import { loginAction } from "@/lib/actions/auth-action";
import GoogleAuthButton from "./GoogleAuthButton";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key) errors[String(key)] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    const result = await loginAction(formData);
    setLoading(false);

    if (result.success) {
      router.push(result.redirectTo || "/shop");
    } else {
      setError(result.message || "Login failed");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-roast-700 bg-roast-900 p-8 shadow-2xl shadow-black/40">
      <h1 className="font-display text-2xl text-ivory">Welcome back</h1>
      <p className="mt-1 font-body text-sm text-ivory-dim">Sign in to keep your beans stocked.</p>

      {error && (
        <div className="mt-5 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Email</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg border bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:ring-2 ${
                fieldErrors.email ? "border-clay focus:ring-clay/20" : "border-roast-600 focus:border-gold focus:ring-gold/15"
              }`}
            />
          </div>
          {fieldErrors.email && <p className="mt-1 text-xs text-clay">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wide text-ivory-dim">Password</label>
            <Link href="/forgot-password" className="font-mono text-[11px] text-gold-dim hover:text-gold">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full rounded-lg border bg-roast-950 py-3 pl-10 pr-11 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:ring-2 ${
                fieldErrors.password ? "border-clay focus:ring-clay/20" : "border-roast-600 focus:border-gold focus:ring-gold/15"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60 hover:text-ivory"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-clay">{fieldErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-roast-950 transition hover:bg-gold-bright disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-roast-700" />
        <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">or</span>
        <span className="h-px flex-1 bg-roast-700" />
      </div>

      <GoogleAuthButton />

      <p className="mt-6 text-center font-body text-sm text-ivory-dim">
        New here?{" "}
        <Link href="/register" className="font-medium text-gold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}