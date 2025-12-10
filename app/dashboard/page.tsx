import { unstable_noStore as noStore } from "next/cache";
// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { hasEnvVars } from "@/lib/utils";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { PrimeCoachLogo } from "@/components/deploy-button";
import Link from "next/link"; // ✅ use Next.js Link, not from "lucide-react"
import { GeneratePlanButton } from "./GeneratePlanButton";

// helper to show nice goal text
function goalLabel(goal?: string | null) {
  if (!goal) return "-";
  switch (goal) {
    case "lose_fat":
      return "Lose fat";
    case "gain_muscle":
      return "Gain muscle";
    case "recomp":
      return "Recomposition";
    case "strength":
      return "Strength";
    default:
      return goal;
  }
}

export default async function DashboardPage() {
  // 🔴 Tell Next: do NOT cache this page (per-request)
  noStore();
  // ✅ createClient already returns the Supabase client; no double-await
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser(); // ✅ just one await, supabase is already a client

  if (!user) {
    // ✅ your login route is /auth/login in this starter
    redirect("/auth/login");
  }

  // Get latest onboarding row for this user
  const { data: onboarding, error } = await supabase
    .from("onboarding_responses") // ✅ from, not form
    .select("age, height_cm, weight_kg, goal, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasOnboarding = !!onboarding && !error;

  // latest plan
  const { data: plan } = await supabase
    .from("plans")
    .select("id, workout_plan, nutrition_plan, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasPlan = !!plan;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_subscribed, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  const isSubscribed = profile?.is_subscribed;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex items-center">
              <PrimeCoachLogo />
            </Link>
          </div>
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <AuthButton />
            </Suspense>
          )}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero + tutorial strip (you can keep this as your "marketing" section) */}
      <div className="flex-1 flex flex-col items-center">
        {/* Actual PrimeCoach dashboard content */}
        <div className="w-full max-w-5xl px-5 pb-10 space-y-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold">PrimeCoach Dashboard</h1>
            <p className="text-sm text-slate-300">
              Welcome, <span className="font-semibold">{user.email}</span>
            </p>
          </div>

          {/* Onboarding status */}
          {!hasOnboarding && (
            <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-100">
              <p className="font-medium">
                You haven&apos;t completed onboarding yet.
              </p>
              <p className="mt-1 text-yellow-200/80">
                Tell us about your body, goals, and training setup so we can
                build your plan.
              </p>
              <a
                href="/onboarding"
                className="mt-3 inline-flex rounded-md bg-yellow-500 px-4 py-1.5 text-xs font-medium text-black hover:bg-yellow-400"
              >
                Complete onboarding
              </a>
            </div>
          )}

          {/* Onboarding summary card */}
          {hasOnboarding && onboarding && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-[0.18em]">
                Your profile
              </h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="font-medium text-slate-100">
                    {onboarding.age ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Height</p>
                  <p className="font-medium text-slate-100">
                    {onboarding.height_cm ? `${onboarding.height_cm} cm` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Weight</p>
                  <p className="font-medium text-slate-100">
                    {onboarding.weight_kg ? `${onboarding.weight_kg} kg` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Goal</p>
                  <p className="font-medium text-slate-100">
                    {goalLabel(onboarding.goal)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Next: We&apos;ll generate a weekly workout + nutrition plan
                based on this profile.
              </p>
            </div>
          )}

          {/* Placeholder for AI plan (coming soon) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-2">
              Your AI plan
            </h2>
            <p className="text-sm text-slate-400">
              This is where your weekly workout split and macros will appear
              once we connect the AI plan generator.
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2 text-2xl font-bold">PrimeCoach Dashboard</h1>
              <p className="text-sm text-slate-300">
                Welcome, <span className="font-semibold">{user.email}</span>
              </p>
            </div>
            <GeneratePlanButton />

            {/* for subscriber only */}

            {isSubscribed ? (
              <GeneratePlanButton />
            ) : (
              <a
                href="/pricing"
                className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-black hover:bg-emerald-400"
              >
                Upgrade to unlock AI plans
              </a>
            )}


          </div>

          {/* AI plan section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-1">
              Your AI plan
            </h2>

            {!hasPlan && (
              <p className="text-sm text-slate-400">
                No plan generated yet. Click &quot;Generate AI plan&quot; to
                create your first weekly plan.
              </p>
            )}

            {hasPlan && (
              <>
                {/* Workout split summary */}
                <div>
                  <p className="text-xs uppercase text-slate-500 mb-1">
                    Weekly split
                  </p>
                  <div className="grid gap-2 text-xs sm:grid-cols-2">
                    {plan.workout_plan?.days?.map((day: any) => (
                      <div
                        key={day.day}
                        className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2"
                      >
                        <p className="font-semibold text-slate-100">
                          {day.day}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {day.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Macros summary */}
                <div>
                  <p className="text-xs uppercase text-slate-500 mb-1">
                    Daily macros
                  </p>
                  <p className="text-sm text-slate-200">
                    {plan.nutrition_plan?.daily_calories} kcal •{" "}
                    {plan.nutrition_plan?.protein_g}g protein •{" "}
                    {plan.nutrition_plan?.carbs_g}g carbs •{" "}
                    {plan.nutrition_plan?.fats_g}g fats
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {plan.nutrition_plan?.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
