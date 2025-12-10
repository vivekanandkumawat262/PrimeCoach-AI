import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

function extractJson(text: string) {
  // Remove ```json fences etc if Gemini wraps output
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
}

export async function POST() {
  try {
    // Supabase server client (from the starter)
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Latest onboarding row
    const { data: onboarding, error: onboardingError } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (onboardingError || !onboarding) {
      return NextResponse.json(
        { error: "Onboarding data not found" },
        { status: 400 }
      );
    }

    // Check subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_subscribed")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_subscribed) {
      return NextResponse.json(
        { error: "Subscription required to generate plans" },
        { status: 403 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    // ✅ New Gemini SDK
    const ai = new GoogleGenAI({ apiKey }); // or just {} if env is set
    const modelName = "gemini-2.5-flash";

    const prompt = `
You are an expert fitness coach and nutritionist.

Create a 7-day workout plan and simple nutrition guide for this user:

Age: ${onboarding.age}
Height: ${onboarding.height_cm} cm
Weight: ${onboarding.weight_kg} kg
Primary goal: ${onboarding.goal}
Gym access: ${onboarding.gym_access}
Diet preference: ${onboarding.diet_pref}
Allergies: ${onboarding.allergies || "None"}
Available equipment: ${onboarding.equipment || "Not specified"}


Return ONLY valid JSON with this shape (no extra text):

{
  "workout_plan": {
    "days": [
      {
        "day": "Monday",
        "focus": "Upper body push",
        "exercises": [
          {
            "name": "Bench press",
            "sets": 4,
            "reps": "6-8",
            "notes": "2-3 mins rest"
          }
        ]
      }
    ]
  },
  "nutrition_plan": {
    "daily_calories": 2200,
    "protein_g": 150,
    "carbs_g": 220,
    "fats_g": 70,
    "notes": "High protein, moderate carbs, mostly whole foods.",
    "example_meals": [
      {
        "name": "Breakfast",
        "items": ["Oats", "Greek yogurt", "Berries"]
      }
    ]
  }
}
Only output JSON. No markdown. No explanations.
    `.trim();

    console.log("[generate-plan] Prompt:", prompt);

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    // New SDK returns text directly
    const rawText = (response as any).text ?? "";
    console.log("[generate-plan] Raw Gemini text:", rawText);

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = extractJson(rawText);
      console.log("[generate-plan] Parsed JSON:", parsed);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", rawText);
      return NextResponse.json(
        { error: "Failed to parse AI plan" },
        { status: 500 }
      );
    }

    const { workout_plan, nutrition_plan } = parsed;

    console.log("[generate-plan] Saving plan to Supabase...");

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        source_onboarding_id: onboarding.id,
        week_start_date: new Date().toISOString().slice(0, 10),
        workout_plan,
        nutrition_plan,
      })
      .select()
      .maybeSingle();

    console.log("[generate-plan] Supabase insert result:", { plan, planError });

    if (planError || !plan) {
      console.error(planError);
      return NextResponse.json(
        { error: "Failed to save plan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("[generate-plan] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error generating plan" },
      { status: 500 }
    );
  }
}
