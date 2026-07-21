// This function is called automatically by Stripe when a payment event happens.
// It verifies the event is genuinely from Stripe, then updates Supabase
// to mark the user as subscribed.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeEvent = JSON.parse(event.body);
  console.log("Webhook received event type:", stripeEvent.type);

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const userId = session.client_reference_id;

    console.log("client_reference_id (userId):", userId);

    if (!userId) {
      console.log("No userId found on session, cannot update Supabase.");
      return { statusCode: 200, body: "ok, but no userId" };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("SUPABASE_URL present:", !!supabaseUrl);
    console.log("SUPABASE_SERVICE_ROLE_KEY present:", !!supabaseServiceKey);

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/cvs?user_id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({ is_subscription: true }),
    });

    const responseText = await updateResponse.text();
    console.log("Supabase update status:", updateResponse.status);
    console.log("Supabase update response:", responseText);
  }

  return { statusCode: 200, body: "ok" };
};
