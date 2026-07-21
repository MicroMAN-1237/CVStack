// This file handles saving and loading CV data for the logged-in user

let currentUser = null;

// Step 1: check user is logged in AND subscribed, then load existing CV if it exists
async function initCvBuilder() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  currentUser = session.user;

  // check subscription status before allowing access
  const { data: cvRow } = await supabaseClient
    .from("cvs")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  const isSubscribed = cvRow && cvRow.is_subscription === true;

  if (!isSubscribed) {
    window.location.href = "pricing.html";
    return;
  }

  // fill the form with existing data, since we already fetched it above
  if (cvRow) {
    document.getElementById("full_name").value = cvRow.full_name || "";
    document.getElementById("job_title").value = cvRow.job_title || "";
    document.getElementById("email").value = cvRow.email || "";
    document.getElementById("phone").value = cvRow.phone || "";
    document.getElementById("skills").value = cvRow.skills || "";
    document.getElementById("experience").value = cvRow.experience || "";
  }
}

// Step 2: save the form data (insert new, or update if it already exists)
async function handleCvSave(event) {
  event.preventDefault();

  const messageBox = document.getElementById("cv-message");
  messageBox.textContent = "Saving...";
  messageBox.className = "cv-message";

  const cvData = {
    user_id: currentUser.id,
    full_name: document.getElementById("full_name").value,
    job_title: document.getElementById("job_title").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    skills: document.getElementById("skills").value,
    experience: document.getElementById("experience").value,
  };

  // upsert = insert if new, update if it already exists (based on user_id)
  const { error } = await supabaseClient
    .from("cvs")
    .upsert(cvData, { onConflict: "user_id" });

  if (error) {
    messageBox.textContent = "Error: " + error.message;
    messageBox.className = "cv-message error";
    return;
  }

  messageBox.textContent = "Your CV has been saved successfully!";
  messageBox.className = "cv-message success";
}

document.getElementById("cv-form").addEventListener("submit", handleCvSave);
initCvBuilder();
