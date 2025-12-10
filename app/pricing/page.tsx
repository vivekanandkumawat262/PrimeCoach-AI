// app/pricing/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SubscribeButton } from "./SubscribeButton";

export default async function PricingPage() {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

  return (
    <div className="py-12 flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Pricing</h1>
        <p className="text-sm text-slate-400 text-center">
          Get unlimited AI-generated workout and nutrition plans tailored to
          your goals.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-100">
            PrimeCoach AI Monthly
          </p>
          <p className="text-3xl font-bold text-indigo-400">$19</p>
          <p className="text-xs text-slate-500">per month</p>
          <ul className="mt-3 text-xs text-slate-300 space-y-1">
            <li>• Personalized weekly workout split</li>
            <li>• Daily macros and sample meals</li>
            <li>• Update your plan as your body changes</li>
          </ul>
        </div>

        <div className="pt-2">
          <SubscribeButton
            isLoggedIn={!!user}
            priceId={priceId ?? ""}
          />
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Payments handled securely by Stripe. You can cancel anytime.
        </p>
      </div>
    </div>
  );
}
