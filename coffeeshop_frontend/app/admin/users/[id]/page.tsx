"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User as UserIcon, Camera, Trash2 } from "lucide-react";
import { adminGetUser, adminUpdateUser, adminDeleteUser, type AdminUser } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";

export default function AdminUserEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminGetUser(params.id)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updated = await adminUpdateUser(params.id, formData);
      setUser(updated);
      setSuccess("User updated");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update user"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await adminDeleteUser(params.id);
      router.push("/admin/users");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-roast-900" />;
  if (!user) return <p className="font-body text-sm text-ivory-dim">User not found.</p>;

  return (
    <div className="max-w-xl">
      <Link href="/admin/users" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
        <ArrowLeft size={14} /> Back to users
      </Link>

      <h1 className="font-display text-3xl text-ivory">Edit user</h1>

      <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-roast-700 bg-roast-900 p-6">
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
          <p className="font-mono text-[11px] uppercase tracking-wide text-gold-dim">{user.provider} account</p>
        </div>

        {error && <div className="mt-5 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>}
        {success && <div className="mt-5 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">{success}</div>}

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
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ivory-dim">Role</label>
            <select
              name="role"
              defaultValue={user.role}
              className="w-full rounded-lg border border-roast-600 bg-roast-950 px-4 py-3 text-sm text-ivory outline-none focus:border-gold"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 font-mono text-xs text-clay hover:text-clay/80 disabled:opacity-40"
          >
            <Trash2 size={13} /> Delete user
          </button>
        </div>
      </form>
    </div>
  );
}
