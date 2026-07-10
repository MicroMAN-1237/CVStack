// This file starts the checkout process when the user clicks "Subscribe Now"

document.getElementById("checkout-btn").addEventListener("click", async () => {
  const messageBox = document.getElementById("checkout-message");
  messageBox.textContent = "Redirecting to secure checkout...";

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  try {
    // call our backend function (runs on Netlify), which talks to Stripe securely
    const response = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        email: session.user.email,
      }),
    });

    const result = await response.json();

    if (result.url) {
      // send the user to Stripe's secure payment page
      window.location.href = result.url;
    } else {
      messageBox.textContent = "Something went wrong. Please try again.";
    }
  } catch (err) {
    messageBox.textContent = "Error: could not start checkout.";
  }
});
