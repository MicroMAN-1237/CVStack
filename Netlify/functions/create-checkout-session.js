// This code runs on Netlify's servers, not in the browser.
// It keeps your Stripe secret key safe, since it never reaches the user's device.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { userId, email } = JSON.parse(event.body);

  const siteUrl = process.env.SITE_URL;
  const priceId = process.env.STRIPE_PRICE_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // build the request Stripe expects (form-encoded, not JSON)
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("customer_email", email);
  params.append("client_reference_id", userId);
  params.append("success_url", `${siteUrl}/dashboard.html?checkout=success`);
  params.append("cancel_url", `${siteUrl}/pricing.html?checkout=cancelled`);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await response.json();

  if (session.error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: session.error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
