import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";

// app/_components/Hero.tsx (or wherever you keep it)

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      {/* Logo Row */}
      <div className="flex flex-col gap-3 items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          PrimeCoach AI
        </div>
        <span className="text-[10px] text-slate-500">
          Powered by{" "}
          <span className="font-semibold text-slate-300">Next.js</span>,{" "}
          <span className="font-semibold text-slate-300">Supabase</span> &{" "}
          <span className="font-semibold text-slate-300">OpenAI</span>
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl lg:text-5xl font-semibold !leading-tight mx-auto max-w-2xl text-center">
        Your AI-powered
        <span className="block">
          <span className="font-bold text-indigo-400">fitness & nutrition</span>{" "}
          coach.
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-sm lg:text-base text-slate-400 max-w-xl text-center">
        PrimeCoach AI builds a fully personalized workout split and nutrition
        plan based on your body, goals, and training setup — updated in
        seconds, not weeks.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <a
          href="/register"
          className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition"
        >
          Get started free
        </a>
        <a
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-md border border-slate-700 px-5 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 transition"
        >
          View demo flow
        </a>
      </div>

      {/* Divider */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />

      {/* Small feature highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-xs sm:text-sm">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
          <p className="font-medium text-slate-200 mb-1">Personalized plans</p>
          <p className="text-slate-400">
            Age, goals, equipment & diet preferences all factored in.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
          <p className="font-medium text-slate-200 mb-1">Weekly dashboard</p>
          <p className="text-slate-400">
            See your training split and macros for the full week.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-4 py-3">
          <p className="font-medium text-slate-200 mb-1">Stripe-ready MVP</p>
          <p className="text-slate-400">
            Subscription-based SaaS, ready to show to clients or ship.
          </p>
        </div>
      </div>
    </div>
  );
}
