// منطق التسجيل وتسجيل الدخول

// ---------- إنشاء حساب جديد ----------
async function handleSignup(event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const messageBox = document.getElementById("auth-message");

  messageBox.textContent = "جارٍ إنشاء الحساب...";
  messageBox.className = "auth-message";

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    messageBox.textContent = "خطأ: " + error.message;
    messageBox.className = "auth-message error";
    return;
  }

  // نخفي الفورم ونعرض رسالة تأكيد بارزة بدلها
  document.getElementById("signup-form").style.display = "none";
  const confirmBox = document.getElementById("confirm-box");
  confirmBox.style.display = "block";
  confirmBox.textContent =
    "تم إنشاء حسابك بنجاح! تحقق الآن من بريدك الإلكتروني (" + email + ") واضغط على رابط التأكيد لتفعيل حسابك قبل تسجيل الدخول.";

  messageBox.textContent = "";
}

// ---------- تسجيل الدخول ----------
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const messageBox = document.getElementById("auth-message");

  messageBox.textContent = "جارٍ تسجيل الدخول...";
  messageBox.className = "auth-message";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      messageBox.textContent = "حسابك غير مؤكد بعد. تحقق من بريدك الإلكتروني واضغط على رابط التأكيد أولاً.";
    } else {
      messageBox.textContent = "خطأ: " + error.message;
    }
    messageBox.className = "auth-message error";
    return;
  }

  // نجح تسجيل الدخول → توجيه للوحة التحكم
  window.location.href = "dashboard.html";
}

// ---------- تسجيل الخروج (نستخدمها لاحقًا في dashboard.html) ----------
async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
