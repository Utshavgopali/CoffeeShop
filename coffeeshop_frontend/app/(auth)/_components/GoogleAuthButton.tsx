"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { googleLoginAction } from "@/lib/actions/auth-action";

export default function GoogleAuthButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  const hasClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  if (!hasClientId) {
    return (
      <p className="rounded-lg border border-dashed border-roast-600 px-4 py-3 text-center font-mono text-xs text-ivory-dim">
        Google sign-in needs NEXT_PUBLIC_GOOGLE_CLIENT_ID configured.
      </p>
    );
  }

  return (
    <div className="flex justify-center [&>div]:!w-full">
      <GoogleLogin
        theme="filled_black"
        shape="pill"
        width="100%"
        onSuccess={async (credentialResponse) => {
          setError("");
          if (!credentialResponse.credential) {
            setError("Google sign-in failed. Please try again.");
            return;
          }
          const result = await googleLoginAction(credentialResponse.credential);
          if (result.success) {
            router.push(result.redirectTo || "/shop");
          } else {
            setError(result.message || "Google sign-in failed");
          }
        }}
        onError={() => setError("Google sign-in failed. Please try again.")}
      />
      {error && <p className="mt-2 text-center text-xs text-clay">{error}</p>}
    </div>
  );
}