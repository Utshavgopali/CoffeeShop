"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { verifyPayment, type Order } from "@/lib/api/orders";
import { useCart } from "@/context/CartContext";

function VerifyContent() {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");
  const { refreshCart } = useCart();

  const [status, setStatus] = useState<"loading" | "paid" | "failed" | "pending">("loading");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!pidx) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no pidx in return URL means payment was never started
      setStatus("failed");
      return;
    }
    verifyPayment(pidx)
      .then((data) => {
        setOrder(data);
        if (data.status === "paid") {
          setStatus("paid");
          refreshCart();
        } else if (data.status === "failed" || data.status === "cancelled") {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      })
      .catch(() => setStatus("failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pidx]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        {status === "loading" && (
          <>
            <Loader2 size={40} className="animate-spin text-gold" />
            <h1 className="mt-4 font-display text-2xl text-ivory">Verifying your payment...</h1>
            <p className="mt-1 font-body text-sm text-ivory-dim">Hang tight, this only takes a moment.</p>
          </>
        )}

        {status === "paid" && (
          <>
            <CheckCircle2 size={40} className="text-moss-bright" />
            <h1 className="mt-4 font-display text-2xl text-ivory">Payment successful</h1>
            <p className="mt-1 font-body text-sm text-ivory-dim">
              Your order {order && `#${order._id.slice(-6)}`} has been placed.
            </p>
            <Link href="/orders" className="mt-6 rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              View my orders
            </Link>
          </>
        )}

        {status === "pending" && (
          <>
            <Loader2 size={40} className="text-gold-dim" />
            <h1 className="mt-4 font-display text-2xl text-ivory">Payment pending</h1>
            <p className="mt-1 font-body text-sm text-ivory-dim">We haven&apos;t received confirmation yet. Check your orders shortly.</p>
            <Link href="/orders" className="mt-6 rounded-full border border-gold-dim px-6 py-2.5 font-body text-sm text-gold hover:bg-gold hover:text-ink">
              View my orders
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle size={40} className="text-clay" />
            <h1 className="mt-4 font-display text-2xl text-ivory">Payment failed</h1>
            <p className="mt-1 font-body text-sm text-ivory-dim">Your payment didn&apos;t go through. You can try again from your cart.</p>
            <Link href="/cart" className="mt-6 rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink hover:bg-gold-bright">
              Back to cart
            </Link>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutVerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
