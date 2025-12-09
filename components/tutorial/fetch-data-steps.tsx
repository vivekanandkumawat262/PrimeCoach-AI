// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get latest onboarding row for this user
  const { data: onboarding, error } = await supabase
    .from("onboarding_responses")
    .select("age, height_cm, weight_kg, goal, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasOnboarding = !!onboarding && !error;

  return (
    <div className="py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-2xl font-bold">PrimeCoach Dashboard</h1>
        <p className="text-sm text-slate-300">
          Welcome, <span className="font-semibold">{user.email}</span>
        </p>
      </div>

      {/* Onboarding status */}
      {!hasOnboarding && (
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-100">
          <p className="font-medium">You haven&apos;t completed onboarding yet.</p>
          <p className="mt-1 text-yellow-200/80">
            Tell us about your body, goals, and training setup so we can build
            your plan.
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
      {hasOnboarding && (
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
            Next: We&apos;ll generate a weekly workout + nutrition plan based on this
            profile.
          </p>
        </div>
      )}

      {/* Placeholder for AI plan (coming soon) */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <h2 className="text-sm font-semibold text-slate-200 mb-2">
          Your AI plan
        </h2>
        <p className="text-sm text-slate-400">
          This is where your weekly workout split and macros will appear once we
          connect the AI plan generator.
        </p>
      </div>
    </div>
  );
}

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




export function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      {/* Tutorial steps... */}
    </ol>
  );
}
