"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BeanForm from "../_components/BeanForm";
import { adminCreateBean } from "@/lib/api/admin";
import { getApiErrorMessage } from "@/lib/api/error";

export default function NewBeanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    setSubmitting(true);
    try {
      const bean = await adminCreateBean(formData);
      router.push(`/admin/beans/${bean._id}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create bean"));
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/beans" className="mb-6 flex w-fit items-center gap-1.5 font-mono text-xs text-ivory-dim hover:text-gold">
        <ArrowLeft size={14} /> Back to beans
      </Link>
      <h1 className="font-display text-3xl text-ivory">Add bean</h1>

      {error && (
        <div className="mt-6 rounded-lg border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
      )}

      <div className="mt-6">
        <BeanForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create bean" />
      </div>
    </div>
  );
}
