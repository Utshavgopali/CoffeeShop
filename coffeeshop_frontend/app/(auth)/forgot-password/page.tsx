"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  forgotEmailSchema,
  forgotCodeSchema,
  forgotResetSchema,
} from "../_components/schema";
import {
  forgotPasswordRequestAction,
  forgotPasswordVerifyAction,
  forgotPasswordResetAction,
} from "@/lib/actions/auth-action";

type Step = "email" | "code" | "reset" | "done";

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: "email", label: "Email" },
  { key: "code", label: "Verify" },
  { key: "reset", label: "New password" },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const value = formData.get("email") as string;

    const parsed = forgotEmailSchema.safeParse({ email: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid email");
      return;
    }

    setLoading(true);
    const result = await forgotPasswordRequestAction(value);
    setLoading(false);

    if (result.success) {
      setEmail(value);
      setInfo(result.message || "Code sent");
      setStep("code");
    } else {
      setError(result.message || "Something went wrong");
    }
  }

  async function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const value = formData.get("code") as string;

    const parsed = forgotCodeSchema.safeParse({ code: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid code");
      return;
    }

    setLoading(true);
    const result = await forgotPasswordVerifyAction(email, value);
    setLoading(false);

    if (result.success) {
      setCode(value);
      setStep("reset");
    } else {
      setError(result.message || "Invalid or expired code");
    }
  }

  async function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = forgotResetSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid password");
      return;
    }

    setLoading(true);
    const result = await forgotPasswordResetAction(email, code, data.newPassword);
    setLoading(false);

    if (result.success) {
      setStep("done");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(result.message || "Something went wrong");
    }
  }

  async function handleResend() {
    setError("");
    setLoading(true);
    const result = await forgotPasswordRequestAction(email);
    setLoading(false);
    setInfo(result.success ? "A new code has been sent." : result.message || "Could not resend code");
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-roast-700 bg-roast-900 p-8 shadow-xl shadow-ink/10">
      <Link href="/login" className="mb-6 flex items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
        <ArrowLeft size={14} /> Back to sign in
      </Link>

      {step !== "done" && (
        <div className="mb-7 flex items-center gap-2">
          {STEP_LABELS.map((s, idx) => {
            const stepIndex = STEP_LABELS.findIndex((x) => x.key === step);
            const isActive = idx === stepIndex;
            const isDone = idx < stepIndex;
            return (
              <div key={s.key} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
                    isDone ? "bg-gold text-ink" : isActive ? "border border-gold text-gold" : "border border-roast-600 text-ivory-dim"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                {idx < STEP_LABELS.length - 1 && (
                  <span className={`h-px flex-1 ${isDone ? "bg-gold" : "bg-roast-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
      )}
      {info && step === "code" && (
        <div className="mb-5 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">{info}</div>
      )}

      {step === "email" && (
        <>
          <h1 className="font-display text-2xl text-ivory">Reset your password</h1>
          <p className="mt-1 font-body text-sm text-ivory-dim">
            Enter the email on your account and we&apos;ll send a 6-digit code.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-roast-600 bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send code"}
            </button>
          </form>
        </>
      )}

      {step === "code" && (
        <>
          <h1 className="font-display text-2xl text-ivory">Check your inbox</h1>
          <p className="mt-1 font-body text-sm text-ivory-dim">
            Enter the 6-digit code sent to <span className="text-ivory">{email}</span>.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleCodeSubmit}>
            <div className="relative">
              <KeyRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
              <input
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg border border-roast-600 bg-roast-950 py-3 pl-10 pr-4 font-mono text-lg tracking-[0.5em] text-ivory outline-none transition placeholder:tracking-normal placeholder:text-ivory-dim/40 focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="w-full font-mono text-xs text-gold-dim hover:text-gold"
            >
              Resend code
            </button>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <h1 className="font-display text-2xl text-ivory">Set a new password</h1>
          <p className="mt-1 font-body text-sm text-ivory-dim">Choose a strong password for your account.</p>
          <form className="mt-6 space-y-4" onSubmit={handleResetSubmit}>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
              <input
                name="newPassword"
                type="password"
                placeholder="New password"
                className="w-full rounded-lg border border-roast-600 bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-dim/60" />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-roast-600 bg-roast-950 py-3 pl-10 pr-4 text-sm text-ivory outline-none transition placeholder:text-ivory-dim/40 focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold py-3 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </form>
        </>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 size={40} className="text-moss-bright" />
          <h1 className="mt-4 font-display text-2xl text-ivory">Password reset</h1>
          <p className="mt-1 font-body text-sm text-ivory-dim">Redirecting you to sign in...</p>
        </div>
      )}
    </div>
  );
}