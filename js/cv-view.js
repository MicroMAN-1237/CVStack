// This file loads the user's CV data and renders it as a formatted document

async function loadCv() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const { data, error } = await supabaseClient
    .from("cvs")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const cvPaper = document.getElementById("cv-paper");

  if (error || !data || !data.full_name) {
    cvPaper.innerHTML = `
      <p>You haven't created a CV yet.</p>
      <a href="build-cv.html" class="btn btn-primary">Build my CV</a>
    `;
    return;
  }

  renderCv(data, cvPaper);
}

function renderCv(cv, container) {
  // split skills by comma, and experience by line breaks, for cleaner display
  const skillsList = cv.skills
    ? cv.skills.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const experienceLines = cv.experience
    ? cv.experience.split("\n").filter(Boolean)
    : [];

  container.innerHTML = `
    <div class="cv-header">
      <h1>${escapeHtml(cv.full_name)}</h1>
      <p class="cv-job-title">${escapeHtml(cv.job_title || "")}</p>
      <div class="cv-contact">
        ${cv.email ? `<span>${escapeHtml(cv.email)}</span>` : ""}
        ${cv.phone ? `<span>${escapeHtml(cv.phone)}</span>` : ""}
      </div>
    </div>

    ${skillsList.length > 0 ? `
      <div class="cv-section">
        <h2>Skills</h2>
        <div class="cv-skills">
          ${skillsList.map(skill => `<span class="cv-skill-tag">${escapeHtml(skill)}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    ${experienceLines.length > 0 ? `
      <div class="cv-section">
        <h2>Experience</h2>
        ${experienceLines.map(line => `<p class="cv-exp-line">${escapeHtml(line)}</p>`).join("")}
      </div>
    ` : ""}
  `;
}

// basic protection against HTML injection when displaying user text
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Download as PDF: we use the browser's print function.
// The user picks "Save as PDF" as the printer destination.
document.getElementById("download-btn").addEventListener("click", () => {
  window.print();
});

loadCv();
