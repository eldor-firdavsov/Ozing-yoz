import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { SoundToggle, ThemeToggle } from "../../components/ui/GlassComponents";
import { supabase } from "../../lib/supabase";
import { appStore } from "../../lib/store";
import { sounds } from "../../lib/audio";

export const TeacherLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("teacher@ilmla.uz");
  const [password, setPassword] = useState("teacher");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    sounds.playClick();

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Supabase Auth attempt
      let authUser = null;
      try {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });
        if (!sbError && data?.user) {
          authUser = data.user;
        }
      } catch {}

      // 2. Validate teacher credentials (teacher@ilmla.uz / teacher or valid Supabase session)
      if (authUser || (cleanEmail === "teacher@ilmla.uz" && password === "teacher")) {
        appStore.setProfile({
          id: authUser?.id || "teacher-id-1",
          role: "teacher",
          full_name: "Bosh Ustoz",
          email: cleanEmail,
          username: "teacher_admin",
          is_guest: false,
        });

        sounds.playSuccess();
        navigate("/teach");
      } else {
        throw new Error("Email yoki parol noto'g'ri. Faqat tasdiqlangan ustoz hisobi bilan kirish mumkin.");
      }
    } catch (err: any) {
      sounds.playError();
      setError(err.message || "Tizimga kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("teacher@ilmla.uz");
    setPassword("teacher");
    sounds.playClick();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100">
      <header className="max-w-xl w-full mx-auto pt-6 flex items-center justify-between">
        <Link
          to="/login"
          onClick={() => sounds.playClick()}
          className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Talaba kirishiga qaytish</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </header>

      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <form
          onSubmit={handleTeacherLogin}
          className="glass-panel p-8 sm:p-10 space-y-6 shadow-glass-lg rounded-2xl border border-slate-200/80 dark:border-slate-800 dark:bg-[#0F172A]"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 dark:bg-slate-800 text-lime-400 flex items-center justify-center shadow-glass border border-slate-800 dark:border-slate-700">
              <ShieldCheck className="w-7 h-7 text-lime-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ustozlar Tizimi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Faqat IT o'quv markazi ustozlari va ma'murlar uchun. Yangi hisob ochish talab qilinmaydi.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Ustoz Elektron Pochtasi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  placeholder="teacher@ilmla.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-10 text-sm font-mono py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Ustoz Paroli</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-10 text-sm py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Quick Credential Badge */}
          <div
            onClick={handleFillDemo}
            className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all select-none"
            title="Bosing va avtomatik to'ldiring"
          >
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-lime-700 dark:text-lime-400" />
              <span>
                Kirish: <strong>teacher@ilmla.uz</strong> / <strong>teacher</strong>
              </span>
            </div>
            <span className="text-xs text-lime-700 dark:text-lime-400 font-bold underline">To'ldirish</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="duo-btn-green w-full py-4 text-base font-black shadow-sm inline-flex items-center justify-center gap-2"
          >
            <span>{loading ? "Tekshirilmoqda..." : "Ustoz kabinetiga kirish"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </main>

      <footer className="text-center py-4 text-sm text-slate-400 dark:text-slate-500">
        O'zing Yoz Ustoz Portali — Faqat tasdiqlangan instruktorlar uchun
      </footer>
    </div>
  );
};
