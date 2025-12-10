"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
};

export default function OnboardingForm({ userId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("light");
  const [goal, setGoal] = useState("lose_fat");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [trainingLocation, setTrainingLocation] = useState("gym");
  const [dietPref, setDietPref] = useState("none");
  const [allergies, setAllergies] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [injuries, setInjuries] = useState("");
  const [gymAccess, setGymAccess] = useState("commercial_gym");

  function toggleEquipment(value: string) {
    setEquipment((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const allergiesArray = allergies
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const supabase = createClient();

    const { data, error } = await supabase
      .from("onboarding_responses")
      .insert({
        user_id: userId,
        age: Number(age),
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        gender,
        activity_level: activityLevel,
        goal,
        experience_level: experienceLevel,
        // gym_access: trainingLocation !== "home",
        gym_access: gymAccess,
        training_location: trainingLocation,
        diet_pref: dietPref,
        allergies: allergiesArray,
        equipment,
        injuries,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Later we’ll trigger AI generation here.
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Basic Info
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Age</label>
            <input
              type="number"
              min={10}
              max={90}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Height (cm)
            </label>
            <input
              type="number"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Weight (kg)
            </label>
            <input
              type="number"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Gender</label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Activity Level
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="sedentary">Mostly sitting</option>
              <option value="light">Lightly active</option>
              <option value="active">Active</option>
              <option value="very_active">Very active</option>
            </select>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Goals & Experience
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Primary Goal
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="lose_fat">Lose fat</option>
              <option value="gain_muscle">Gain muscle</option>
              <option value="recomp">Recomposition</option>
              <option value="strength">Improve strength</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Experience Level
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Injuries / Limitations (optional)
          </label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            placeholder="e.g., knee pain, lower back issues"
          />
        </div>
      </section>

      {/* Training */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Training Setup
        </h2>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Training Location
          </label>
          <div className="flex gap-4 text-sm">
            {["gym", "home", "both"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTrainingLocation(option)}
                className={`rounded-md border px-3 py-1 ${
                  trainingLocation === option
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                {option === "gym" ? "Gym" : option === "home" ? "Home" : "Both"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">
            Equipment (home workouts)
          </label>
          <div className="flex flex-wrap gap-3 text-sm">
            {["dumbbells", "bands", "pullup_bar", "bench", "none"].map(
              (opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={equipment.includes(opt)}
                    onChange={() => toggleEquipment(opt)}
                  />
                  <span className="capitalize">
                    {opt.replace("_", " ").replace("bands", "Resistance bands")}
                  </span>
                </label>
              )
            )}
          </div>
        </div>
      </section>

      {/* Gym access */}
      <div className="space-y-2">
        <label className="block text-sm text-slate-200">Gym access</label>
        <select
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          value={gymAccess}
          onChange={(e) => setGymAccess(e.target.value)}
        >
          <option value="commercial_gym">Commercial gym available</option>
          <option value="home_only">Home workouts only</option>
          <option value="both">Both gym and home</option>
        </select>
      </div>

      {/* Diet */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Diet & Preferences
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Diet Preference
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={dietPref}
              onChange={(e) => setDietPref(e.target.value)}
            >
              <option value="none">No preference</option>
              <option value="veg">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non_veg">Non-veg</option>
              <option value="high_protein">High-protein</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-400">
              Allergies (comma separated)
            </label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g., peanuts, lactose"
            />
          </div>
        </div>
      </section>

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save & Continue"}
      </button>
    </form>
  );
}
