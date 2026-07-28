"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { registerSchema } from "./schema";
import { registerAction } from "@/lib/actions/auth-action";
import GoogleAuthButton from "./GoogleAuthButton";

export default function RegisterForm() {
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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = registerSchema.safeParse(data);
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
    const result = await registerAction(formData);
    setLoading(false);

    if (result.success) {
      router.push("/login?registered=true");
    } else {
      setError(result.message || "Registration failed");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-roast-700 bg-roast-900 p-8 shadow-xl shadow-ink/10">
      <h1 className="font-display text-2xl text-ivory">Create your account</h1>
      <p className="mt-1 font-body text-sm text-ivory-dim">Join us for fresh-roasted beans, delivered.</p>

      {error && (
        <div className="mt-5 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Name</label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className={`w-full rounded-lg border bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:ring-2 ${
                fieldErrors.name ? "border-clay focus:ring-clay/20" : "border-roast-600 focus:border-gold focus:ring-gold/15"
              }`}
            />
          </div>
          {fieldErrors.name && <p className="mt-1 text-xs text-clay">{fieldErrors.name}</p>}
        </div>

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
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
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

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className={`w-full rounded-lg border bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:ring-2 ${
                fieldErrors.confirmPassword ? "border-clay focus:ring-clay/20" : "border-roast-600 focus:border-gold focus:ring-gold/15"
              }`}
            />
          </div>
          {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-clay">{fieldErrors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-roast-700" />
        <span className="font-mono text-[11px] uppercase tracking-wide text-ivory-dim/60">or</span>
        <span className="h-px flex-1 bg-roast-700" />
      </div>

      <GoogleAuthButton />

      <p className="mt-6 text-center font-body text-sm text-ivory-dim">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}