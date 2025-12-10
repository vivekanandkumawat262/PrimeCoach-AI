

// app/(protected)/onboarding/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
    // prevent caching, this depends on logged-in user
  noStore();
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Tell us about yourself</h1>
      <p className="mb-6 text-sm text-slate-400 max-w-xl">
        We&apos;ll use this information to generate your personalized workout
        and nutrition plan.
      </p>
      <OnboardingForm userId={user.id} />
    </div>
  );
}
