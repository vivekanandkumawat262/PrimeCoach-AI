// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="py-8">
      <h1 className="mb-2 text-2xl font-bold">Your Dashboard</h1>
      <p className="text-sm text-slate-300">
        Welcome, <span className="font-semibold">{user.email}</span>
      </p>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
        <p className="text-sm text-slate-300">
          Onboarding data saved. Next we&apos;ll show your AI-generated workout
          and nutrition plan here.
        </p>
      </div>
    </div>
  );
}
