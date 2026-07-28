"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import BeanForm from "../_components/BeanForm";
import { adminGetBean, adminUpdateBean, adminDeleteBean } from "@/lib/api/admin";
import type { Bean } from "@/lib/api/beans";
import { getApiErrorMessage } from "@/lib/api/error";

export default function EditBeanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [bean, setBean] = useState<Bean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminGetBean(params.id)
      .then(setBean)
      .catch(() => setBean(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(formData: FormData) {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const updated = await adminUpdateBean(params.id, formData);
      setBean(updated);
      setSuccess("Bean updated");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update bean"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this bean? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await adminDeleteBean(params.id);
      router.push("/admin/beans");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-roast-900" />;
  if (!bean) return <p className="font-body text-sm text-ivory-dim">Bean not found.</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/beans" className="flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
          <ArrowLeft size={14} /> Back to beans
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 font-mono text-xs text-clay hover:text-clay/80 disabled:opacity-40"
        >
          <Trash2 size={13} /> Delete bean
        </button>
      </div>
      <h1 className="mt-6 font-display text-3xl text-ivory">Edit bean</h1>

      {error && <div className="mt-6 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>}
      {success && <div className="mt-6 rounded-lg border border-moss/40 bg-moss/10 px-4 py-3 text-sm text-moss-bright">{success}</div>}

      <div className="mt-6">
        <BeanForm bean={bean} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
      </div>
    </div>
  );
}
