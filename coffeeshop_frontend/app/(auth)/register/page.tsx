import type { Metadata } from "next";
import RegisterForm from "../_components/RegisterForm";

export const metadata: Metadata = { title: "Create account — Roast & Origin" };

export default function RegisterPage() {
  return <RegisterForm />;
}