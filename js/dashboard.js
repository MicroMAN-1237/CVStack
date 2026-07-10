// حماية الصفحة: نتحقق أن المستخدم مسجل دخول فعلاً
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    // ما كاينش جلسة تسجيل دخول → نرجعوه لصفحة الدخول
    window.location.href = "login.html";
    return;
  }

  // نعرض بريد المستخدم في الصفحة
  document.getElementById("user-email").textContent = session.user.email;
}

// زر تسجيل الخروج
document.getElementById("logout-btn").addEventListener("click", handleLogout);

// نتحقق فور تحميل الصفحة
checkAuth();
