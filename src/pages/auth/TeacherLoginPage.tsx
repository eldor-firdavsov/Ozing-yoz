import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import { BrandLogo, SoundToggle } from "../../components/ui/GlassComponents";
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
      } catch (_) {}

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
    <div className="min-h-screen flex flex-col justify-between p-4 bg-[#F8FAFC]">
      <header className="max-w-md w-full mx-auto pt-6 flex items-center justify-between">
        <Link
          to="/login"
          onClick={() => sounds.playClick()}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Talaba kirishiga qaytish</span>
        </Link>
        <SoundToggle />
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-6">
        <form
          onSubmit={handleTeacherLogin}
          className="glass-panel p-8 space-y-5 shadow-glass-lg rounded-2xl border border-slate-200/80"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center shadow-glass">
              <ShieldCheck className="w-6 h-6 text-lime-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ustozlar Tizimi</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Faqat IT o'quv markazi ustozlari va ma'murlar uchun. Yangi hisob ochish talab qilinmaydi.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Ustoz Elektron Pochtasi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  required
                  type="email"
                  placeholder="teacher@ilmla.uz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-9.5 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Ustoz Paroli</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-9.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Credential Badge */}
          <div
            onClick={handleFillDemo}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all select-none"
            title="Bosing va avtomatik to'ldiring"
          >
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-lime-700" />
              <span>
                Kirish: <strong>teacher@ilmla.uz</strong> / <strong>teacher</strong>
              </span>
            </div>
            <span className="text-[10px] text-lime-700 font-bold underline">To'ldirish</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary w-full py-2.5 text-xs font-bold shadow-xs inline-flex items-center justify-center gap-2"
          >
            <span>{loading ? "Tekshirilmoqda..." : "Ustoz kabinetiga kirish"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400">
        O'zing Yoz Ustoz Portali — Faqat tasdiqlangan instruktorlar uchun
      </footer>
    </div>
  );
};
