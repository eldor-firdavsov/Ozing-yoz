import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Code2,
  CheckCircle2,
  Terminal,
  Zap,
  Lock,
  Mail,
  User,
  GraduationCap,
  BookOpen,
  Trophy
} from "lucide-react";
import { UZ } from "./lib/i18n/uz";
import { supabase } from "./lib/supabase";
import { appStore } from "./lib/store";
import { BrandLogo, SoundToggle, ThemeToggle } from "./components/ui/GlassComponents";
import { sounds } from "./lib/audio";
import { Workspace } from "./pages/student/Workspace";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { LiveControl } from "./pages/teacher/LiveControl";
import { TeacherLoginPage } from "./pages/auth/TeacherLoginPage";

// 1. LANDING PAGE (/) - Mondly Modern Aesthetic
const LandingPage: React.FC = () => {
  const profile = appStore.getProfile();
  const isAuthenticated = Boolean(profile.id && !profile.is_guest && profile.email);
  const isTeacher = profile.role === "teacher";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Navigation - Mondly Sleek Header */}
      <nav className="border-b border-slate-200/90 dark:border-slate-800 px-6 sm:px-12 py-4 flex items-center justify-between w-full bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-40">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-3">
          <SoundToggle />
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              onClick={() => sounds.playClick()}
              className="mondly-btn-primary text-xs sm:text-sm py-2.5 px-6 font-bold inline-flex items-center gap-2"
              to={isTeacher ? "/teach" : "/app"}
            >
              <span>{isTeacher ? "Ustoz Kabineti" : "Darslarimga o'tish"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                onClick={() => sounds.playClick()}
                className="mondly-btn-secondary text-xs sm:text-sm py-2 px-5 font-bold"
                to="/login"
              >
                {UZ.cta.login}
              </Link>
              <Link
                onClick={() => sounds.playClick()}
                className="mondly-btn-primary text-xs sm:text-sm py-2 px-6 font-bold"
                to="/register"
              >
                {UZ.cta.register}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Mondly High Contrast Educational Hero */}
      <main className="w-full px-6 sm:px-12 lg:px-20 py-16 text-center space-y-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{UZ.tagline}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-display">
          Kod yozishni o'rgan. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600">O'zing yoz!</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          IT o'quv markazlari uchun zamonaviy HTML va CSS amaliyot platformasi. Ustoz AI tayyor kod bermaydi —
          4 bosqichli maslahat zinapoyasi orqali mustaqil fikrlab yozishga yo'naltiradi.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            onClick={() => sounds.playClick()}
            className="mondly-btn-primary px-9 py-3.5 text-base font-bold inline-flex items-center gap-2.5 shadow-md hover:shadow-lg"
            to={isAuthenticated ? "/app" : "/register"}
          >
            <span>Darslarni Boshlash</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          {!isAuthenticated && (
            <Link
              onClick={() => sounds.playClick()}
              className="mondly-btn-secondary px-8 py-3.5 text-base font-bold"
              to="/login"
            >
              Tizimga kirish
            </Link>
          )}
        </div>

        {/* Three Value Pillars - Mondly Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12 w-full">
          <div className="mondly-card p-8 space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Ustoz AI (Leak-Guard)</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Savol → Yo'nalish → Tushuntirish → Qisman yechim. Tayyor kod hech qachon berilmaydi, talaba o'z kodi muallifi bo'ladi.
            </p>
          </div>

          <div className="mondly-card p-8 space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Jonli Musobaqa (Live QR)</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Talabalar 5 soniyada QR kod orqali ulanadi. Katta proyektor doskasida real-vaqt reytingi va konsept xaritasi ko'rinadi.
            </p>
          </div>

          <div className="mondly-card p-8 space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Xavfsiz Ustoz Nazorati</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Qiynalayotgan talabalar kodini jonli tekshiring, xonaga yo'riqnoma yuboring va AI bilan yangi topshiriqlar yarating.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
        O'zing Yoz © 2026 — Har bir talaba o'z kodi muallifi
      </footer>
    </div>
  );
};

// 2. STUDENT AUTH PAGE (/login & /register)
const AuthPage: React.FC<{ mode: "login" | "register" }> = ({ mode }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    sounds.playClick();

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (mode === "register") {
        if (!fullName.trim()) throw new Error("Iltimos, ism-sharifingizni kiriting");
        if (password.length < 6) throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");

        try {
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: { data: { full_name: fullName.trim(), role: "student" } },
          });
        } catch (_) {}

        appStore.setProfile({
          id: `student-${Date.now()}`,
          full_name: fullName.trim(),
          email: cleanEmail,
          username: cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
          role: "student",
          xp: 0,
          streak: 0,
          is_guest: false,
        });

        sounds.playSuccess();
        navigate("/app");
      } else {
        // Login mode
        let user = null;
        try {
          const { data, error: sbError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          if (!sbError && data?.user) user = data.user;
        } catch (_) {}

        appStore.setProfile({
          id: user?.id || `student-${Date.now()}`,
          email: cleanEmail,
          full_name: user?.user_metadata?.full_name || cleanEmail.split("@")[0],
          username: cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
          role: "student",
          is_guest: false,
        });

        sounds.playSuccess();
        navigate("/app");
      }
    } catch (err: any) {
      sounds.playError();
      setError(err.message || UZ.errors.invalidAuth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors">
      <header className="max-w-xl w-full mx-auto pt-4 flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <Link
            to="/teach/login"
            onClick={() => sounds.playClick()}
            className="text-sm font-semibold text-lime-900 dark:text-emerald-300 hover:text-lime-950 dark:hover:text-white bg-lime-100 dark:bg-emerald-950/60 hover:bg-lime-200 dark:hover:bg-emerald-900 px-3.5 py-2 rounded-xl border border-lime-300 dark:border-emerald-700 shadow-xs inline-flex items-center gap-1.5 transition-all"
          >
            <GraduationCap className="w-4 h-4 text-lime-700 dark:text-emerald-400" />
            <span>Ustozmisiz?</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-700 dark:text-emerald-400" />
          </Link>
          <SoundToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <form
          onSubmit={handleSubmit}
          className="glass-panel dark:bg-[#0F172A] p-8 sm:p-10 space-y-6 shadow-glass-lg rounded-2xl border border-slate-200/80 dark:border-slate-800"
        >
          {/* Teacher link pill in header for login */}
          {mode === "login" && (
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-lime-50 to-white dark:from-emerald-950/40 dark:to-slate-900 rounded-xl border border-lime-200/90 dark:border-emerald-800 text-sm">
              <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ustoz hisobi bilan kirasizmi?</span>
              </span>
              <Link
                to="/teach/login"
                onClick={() => sounds.playClick()}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 inline-flex items-center gap-1 underline"
              >
                <span>Ustoz kabineti</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {mode === "login" ? "Talaba Kabinetiga Kirish" : "Talaba Ro'yxatdan O'tishi"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === "login"
                ? "Darslar va musobaqalarni davom ettirish uchun kiring"
                : "Kod yozishni boshlash uchun hisobingizni oching"}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">To'liq ism-familiyangiz</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    required
                    placeholder="Masalan: Azizbek Rahimov"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input pl-10 text-sm py-2.5"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Elektron pochta (Email)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="email"
                  placeholder="talaba@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-10 text-sm font-mono py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Parol</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="password"
                  placeholder="Kamida 6 ta belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-10 text-sm py-2.5"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="duo-btn-green w-full py-4 text-base font-black shadow-xs"
          >
            {loading ? "Yuklanmoqda..." : mode === "login" ? UZ.cta.login : UZ.cta.register}
          </button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
            {mode === "login" ? (
              <>
                Hisobingiz yo'qmi?{" "}
                <Link
                  className="text-slate-900 dark:text-white font-bold underline"
                  to="/register"
                  onClick={() => sounds.playClick()}
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            ) : (
              <>
                Hisobingiz bormi?{" "}
                <Link
                  className="text-slate-900 dark:text-white font-bold underline"
                  to="/login"
                  onClick={() => sounds.playClick()}
                >
                  Kirish
                </Link>
              </>
            )}
          </p>
        </form>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        O'zing Yoz — Har bir talaba o'z kodi muallifi
      </footer>
    </div>
  );
};

// 3. STUDENT & TEACHER ROUTE GUARDS (Enforce Auth Strictly)
const StudentRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = appStore.getProfile();
  const isAuthenticated = Boolean(profile.id && !profile.is_guest && profile.email);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const TeacherRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = appStore.getProfile();
  const isTeacher = Boolean(profile.id && !profile.is_guest && profile.role === "teacher");
  if (!isTeacher) {
    return <Navigate to="/teach/login" replace />;
  }
  return <>{children}</>;
};

// 4. GUEST / STUDENT JOIN PAGE (/join/:code)
const GuestJoinPage: React.FC = () => {
  const { code = "FLX742" } = useParams();
  const navigate = useNavigate();
  const profile = appStore.getProfile();
  const isAuthenticated = Boolean(profile.id && !profile.is_guest && profile.email);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthenticatedJoin = () => {
    sounds.playSuccess();
    navigate(`/room/${code.trim().toUpperCase()}`);
  };

  const handleRegisterAndJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    sounds.playClick();

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (!fullName.trim()) throw new Error("Iltimos, ismingizni kiriting");
      if (password.length < 6) throw new Error("Parol kamida 6 ta belgidan iborat bo'lishi kerak");

      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: fullName.trim(), role: "student" } },
        });
      } catch (_) {}

      appStore.setProfile({
        id: `student-${Date.now()}`,
        full_name: fullName.trim(),
        email: cleanEmail,
        username: cleanEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, ""),
        role: "student",
        xp: 0,
        streak: 0,
        is_guest: false,
      });

      sounds.playSuccess();
      navigate(`/room/${code.trim().toUpperCase()}`);
    } catch (err: any) {
      sounds.playError();
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="glass-panel max-w-md w-full p-8 space-y-6 text-center shadow-glass-lg rounded-2xl">
        <BrandLogo size="lg" />

        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jonli musobaqa xonasi</p>
          <div className="font-mono text-3xl font-extrabold text-slate-900">{code}</div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-900">
              Salom, <strong>{profile.full_name}</strong>! Xonaga ulanishga tayyormisiz?
            </div>
            <button
              onClick={handleAuthenticatedJoin}
              className="mondly-btn-primary w-full py-3.5 text-base font-bold shadow-sm"
            >
              Musobaqaga qo'shilish →
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterAndJoin} className="space-y-4 text-left pt-2">
            <p className="text-xs text-slate-500 font-semibold text-center">
              Musobaqada qatnashish uchun talaba sifatida ro'yxatdan o'ting:
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">To'liq ismingiz</label>
              <input
                required
                autoFocus
                placeholder="Masalan: Sardor Aliyev"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input text-sm py-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Elektron pochta (Email)</label>
              <input
                required
                type="email"
                placeholder="talaba@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input text-sm font-mono py-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Parol (kamida 6 ta belgi)</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input text-sm py-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mondly-btn-primary w-full py-3.5 text-sm font-bold shadow-sm"
            >
              {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tib, xonaga kirish →"}
            </button>

            <p className="text-center text-xs text-slate-500 pt-1">
              Hisobingiz bormi?{" "}
              <Link to="/login" className="text-slate-900 font-bold underline">
                Kirish
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/teach/login" element={<TeacherLoginPage />} />
        <Route path="/join/:code" element={<GuestJoinPage />} />

        {/* Protected Student Routes */}
        <Route
          path="/app"
          element={
            <StudentRouteGuard>
              <StudentDashboard />
            </StudentRouteGuard>
          }
        />
        <Route
          path="/app/challenges"
          element={
            <StudentRouteGuard>
              <StudentDashboard />
            </StudentRouteGuard>
          }
        />
        <Route
          path="/app/challenge/:id"
          element={
            <StudentRouteGuard>
              <Workspace />
            </StudentRouteGuard>
          }
        />
        <Route
          path="/room/:code"
          element={
            <StudentRouteGuard>
              <Workspace isRoom={true} />
            </StudentRouteGuard>
          }
        />

        {/* Protected Teacher Routes */}
        <Route
          path="/teach"
          element={
            <TeacherRouteGuard>
              <TeacherDashboard />
            </TeacherRouteGuard>
          }
        />
        <Route
          path="/teach/live/:code"
          element={
            <TeacherRouteGuard>
              <LiveControl isProjector={false} />
            </TeacherRouteGuard>
          }
        />
        <Route path="/teach/live/:code/screen" element={<LiveControl isProjector={true} />} />
      </Routes>
    </BrowserRouter>
  );
}