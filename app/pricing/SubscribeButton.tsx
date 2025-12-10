"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  isLoggedIn: boolean;
  priceId: string;
};

export function SubscribeButton({ isLoggedIn, priceId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to start checkout");
        return;
      }

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        setErrorMsg("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading || !priceId}
        className="w-full inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
      >
        {isLoggedIn ? (loading ? "Redirecting..." : "Subscribe with Stripe") : "Login to subscribe"}
      </button>
      {errorMsg && (
        <p className="text-xs text-red-400 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
