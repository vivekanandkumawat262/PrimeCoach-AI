import Link from "next/link";
import { Button } from "./ui/button";

// app/_components/primecoach-logo.tsx
export function PrimeCoachLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Icon circle */}
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 text-xs font-bold">
        PC
      </div>

      {/* Text part */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight">
          PrimeCoach <span className="text-indigo-400">AI</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          fitness coach
        </span>
      </div>
    </div>
  );
}

