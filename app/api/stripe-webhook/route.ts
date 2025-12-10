// app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
 

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new NextResponse("Webhook secret not set", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string | undefined;

        if (customerId) {
          // Lookup subscription
          const subscriptionId = session.subscription as string | undefined;
          const priceId =
            session?.lines?.data?.[0]?.price?.id ||
            session?.display_items?.[0]?.price?.id ||
            null;

          // Find Supabase user by stripe_customer_id
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .limit(1);

          const profile = profiles?.[0];

          if (profile) {
            await supabase
              .from("profiles")
              .update({
                stripe_subscription_id: subscriptionId,
                stripe_price_id: priceId,
                subscription_status: "active",
                is_subscribed: true,
              })
              .eq("id", profile.id);
          }
        }
        break;
      }
      case "customer.subscription.deleted":
      case "customer.subscription.canceled":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string | undefined;
        const status = subscription.status as string;

        const { data: profiles } = await supabase
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .limit(1);

        const profile = profiles?.[0];

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items?.data?.[0]?.price?.id,
              subscription_status: status,
              is_subscribed: status === "active" || status === "trialing",
            })
            .eq("id", profile.id);
        }
        break;
      }
      default:
        // ignore other events
        break;
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
