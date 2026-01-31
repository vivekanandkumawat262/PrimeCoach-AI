# 🚀 PrimeCoach AI – AI-Powered Fitness & Nutrition Coaching SaaS

PrimeCoach AI is a **subscription-based AI fitness coaching platform** that generates **personalized workout and nutrition plans** using user onboarding data and **Google Gemini AI**.

Built with **Next.js (App Router)**, **Supabase**, **Stripe**, and **Google Gemini**, PrimeCoach AI demonstrates real-world SaaS features like authentication, onboarding pipelines, AI generation, and paid feature gating.

---

## 🧠 Key Features

### 🔐 Authentication & Sessions
- Supabase Auth (Email / Magic Link)
- Secure SSR + middleware session handling
- Protected routes (server & client)

### 🧍 User Onboarding Flow
- Collects age, height, weight, and fitness goals
- Training location & available equipment
- Diet preferences, allergies & injuries

### 🤖 AI-Generated Fitness Plans
- Weekly workout split (days, focus, exercises)
- Daily nutrition macros (calories, protein, carbs, fats)
- Generated using **Google Gemini AI**
- Strict JSON output parsing & validation

### 💳 Stripe Subscriptions
- Monthly paid plan ($19/month)
- Stripe Checkout sessions
- Secure webhook handling
- Subscription status stored in Supabase

### 🔒 Feature Gating
- Only subscribed users can generate AI plans
- Free users redirected to pricing page

### 📊 User Dashboard
- Profile summary
- Onboarding status
- Latest AI plan preview
- Regenerate plans anytime (subscribers)

### 🎨 Modern UI
- Tailwind CSS
- Dark / light theme support
- Responsive layout
- Clean SaaS-style UX

---

## 🏗️ Tech Stack

### Frontend / Fullstack
- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide Icons

### Backend & Services
- **Supabase**
  - Authentication
  - PostgreSQL database
  - Row-level security (RLS)
- **Stripe**
  - Subscriptions
  - Webhooks
- **Google Gemini AI**
  - AI workout & nutrition generation

---

## 📂 Project Structure

primecoach-ai/
├── app/
│ ├── (protected)/
│ │ ├── dashboard/
│ │ ├── onboarding/
│ │ └── pricing/
│ ├── api/
│ │ ├── generate-plan/
│ │ ├── create-checkout-session/
│ │ └── stripe-webhook/
│ ├── auth/
│ └── layout.tsx
│
├── components/
│ ├── ui/
│ ├── navbar/
│ ├── hero/
│ └── auth/
│
├── lib/
│ ├── supabase/
│ ├── stripe.ts
│ └── utils.ts
│
├── public/
├── styles/
├── package.json
└── README.md


---

## 🔐 Authentication Flow

1. User signs up / logs in using Supabase Auth  
2. Session managed via SSR cookies  
3. Middleware protects authenticated routes  
4. User redirected to onboarding if profile is incomplete  

---

## 🧾 Database Tables (Supabase)

### `profiles`
- `stripe_customer_id`
- `is_subscribed`
- `subscription_status`

### `onboarding_responses`
- User body & goal data
- Training & diet preferences

### `plans`
- `workout_plan` (JSON)
- `nutrition_plan` (JSON)
- Linked to onboarding response

---

## 💳 Subscription Flow (Stripe)

1. User clicks **Upgrade**
2. Checkout session created via API route
3. Stripe handles payment securely
4. Webhook updates subscription status
5. AI plan generation is unlocked

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_ID=your_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI
GEMINI_API_KEY=your_gemini_api_key
▶️ Running Locally
1️⃣ Install dependencies
npm install
2️⃣ Start development server
npm run dev
3️⃣ Open in browser
http://localhost:3000
🔌 Core API Routes
AI
Route	Method	Description
/api/generate-plan	POST	Generate AI workout & nutrition plan
Payments
Route	Method	Description
/api/create-checkout-session	POST	Create Stripe checkout
/api/stripe-webhook	POST	Handle Stripe events
🎯 Learning Outcomes
Real SaaS architecture with Next.js App Router

Supabase SSR authentication & session handling

Stripe subscriptions & webhook integration

AI prompt engineering & JSON parsing

Feature gating & paid access control

Server Components + API routes

Production-ready environment handling

🚀 Future Enhancements
Plan history & comparisons

PDF export of workout plans

Push / email notifications

Mobile app version

Trainer / coach dashboard

Annual & lifetime plans

👨‍💻 Author
Vivekanand Kumawat
Full Stack Developer | AI SaaS Builder

FastAPI • Next.js • Supabase • Stripe • System Design