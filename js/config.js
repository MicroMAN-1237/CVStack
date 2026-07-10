// إعدادات الاتصال بـ Supabase
// هذا الملف يحتوي على المفاتيح العامة (آمنة للنشر)

const SUPABASE_URL = "https://ayykgrdmjaeafdnwlsfz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_OZp7Ow8KhCyhlEEwlBTQtw_zRsZHN6w";

// إنشاء اتصال Supabase (يستخدم في كل الملفات الأخرى)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
