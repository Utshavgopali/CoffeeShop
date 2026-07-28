"use client";

import { useRef, useState } from "react";
import { User as UserIcon, Camera, Lock, CheckCircle2 } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { useUser } from "@/context/UserContext";
import {
  updateProfileAction,
  requestPasswordChangeAction,
  confirmPasswordChangeAction,
} from "@/lib/actions/auth-action";

export default function ProfilePage() {
  const { user, setUser, loading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwStep, setPwStep] = useState<"idle" | "code">("idle");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updated = await updateProfileAction(formData);
      setUser(updated);
      setProfileSuccess("Profile updated");
    } catch {
      setProfileError("Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;

    setPwLoading(true);
    const result = await requestPasswordChangeAction(currentPassword);
    setPwLoading(false);

    if (result.success) {
      setPwStep("code");
      setPwSuccess(result.message || "Code sent to your email");
    } else {
      setPwError(result.message || "Could not send code");
    }
  }

  async function handleConfirmCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError("");
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    const newPassword = formData.get("newPassword") as string;

    setPwLoading(true);
    const result = await confirmPasswordChangeAction({ code, newPassword });
    setPwLoading(false);

    if (result.success) {
      setPwStep("idle");
      setPwSuccess("Password updated successfully");
    } else {
      setPwError(result.message || "Could not update password");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
          <div className="h-64 animate-pulse rounded-xl bg-roast-900" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center">
          <p className="font-body text-sm text-ivory-dim">Sign in to view your profile.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <h1 className="font-display text-3xl text-ivory">Profile settings</h1>

        <form onSubmit={handleProfileSubmit} className="mt-8 rounded-xl border border-roast-700 bg-roast-900 p-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-roast-600 bg-roast-800"
            >
              {avatarPreview || user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview || user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-gold">
                  <UserIcon size={28} />
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-roast-950/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={18} className="text-ivory" />
              </span>
            </button>
            <input ref={fileInputRef} type="file" name="avatar" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarChange} className="hidden" />
            <div>
              <p className="font-body text-sm text-ivory">{user.name}</p>
              <p className="font-mono text-xs text-ivory-dim">{user.email}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-gold-dim">{user.provider} account</p>
            </div>
          </div>

          {profileError && (
            <div className="mt-5 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{profileError}</div>
          )}
          {profileSuccess && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">
              <CheckCircle2 size={15} /> {profileSuccess}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Name</label>
              <input
                name="name"
                defaultValue={user.name}
                className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={user.email}
                className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-6 rounded-lg bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>

        {user.provider === "local" && (
          <div className="mt-6 rounded-xl border border-roast-700 bg-roast-900 p-6">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-gold-dim" />
              <h2 className="font-display text-lg text-ivory">Change password</h2>
            </div>

            {pwError && (
              <div className="mt-4 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{pwError}</div>
            )}
            {pwSuccess && pwStep === "idle" && (
              <div className="mt-4 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">{pwSuccess}</div>
            )}

            {pwStep === "idle" ? (
              <form onSubmit={handleRequestCode} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Current password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    required
                    className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="rounded-lg border border-gold-dim px-6 py-2.5 font-body text-sm text-gold transition hover:bg-gold hover:text-ink disabled:opacity-60"
                >
                  {pwLoading ? "Sending code..." : "Send verification code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmCode} className="mt-4 space-y-4">
                <p className="font-body text-sm text-ivory-dim">{pwSuccess}</p>
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Verification code</label>
                  <input
                    name="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 font-mono text-lg tracking-[0.5em] text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">New password</label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="rounded-lg bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
                  >
                    {pwLoading ? "Updating..." : "Update password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPwStep("idle")}
                    className="font-mono text-xs text-ivory-dim hover:text-ivory"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
