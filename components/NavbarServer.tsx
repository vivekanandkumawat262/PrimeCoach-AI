import Link from "next/link";
import { PrimeCoachLogo } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";
import { hasEnvVars } from "@/lib/utils";

export default function NavbarServer() {
  return (
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
  );
}
