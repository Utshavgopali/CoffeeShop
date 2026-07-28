import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = { title: "Sign in — Roast & Origin" };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}