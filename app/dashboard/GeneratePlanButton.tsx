"use client";

import { useState } from "react";

export function GeneratePlanButton() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/generate-plan", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to generate plan");
        return;
      }

      // reload to fetch latest plan from server
      window.location.reload();
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
        disabled={loading}
        className="inline-flex items-center rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-medium text-black hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Generating plan..." : "Generate AI plan"}
      </button>
      {errorMsg && (
        <p className="text-xs text-red-400">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
