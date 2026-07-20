// This function is called automatically by Stripe when a payment event happens.
// It verifies the event is genuinely from Stripe, then updates Supabase
// to mark the user as subscribed.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripeEvent = JSON.parse(event.body);

  // We only care about one event type: a checkout that finished successfully
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      // update the user's row: mark as subscribed
      await fetch(`${supabaseUrl}/rest/v1/cvs?user_id=eq.${userId}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ is_subscribed: true }),
      });
    }
  }

  return { statusCode: 200, body: "ok" };
};
