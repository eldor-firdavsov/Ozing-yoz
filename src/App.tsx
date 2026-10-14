import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
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
  GraduationCap
} from "lucide-react";
import { UZ } from "./lib/i18n/uz";
import { supabase } from "./lib/supabase";
import { appStore } from "./lib/store";
import { BrandLogo, SoundToggle } from "./components/ui/GlassComponents";
import { sounds } from "./lib/audio";
import { Workspace } from "./pages/student/Workspace";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { LiveControl } from "./pages/teacher/LiveControl";
import { TeacherLoginPage } from "./pages/auth/TeacherLoginPage";

// 1. LANDING PAGE (/)
const LandingPage: React.FC = () => {
  const profile = appStore.getProfile();
  const isTeacher = profile.role === "teacher";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      {/* Navigation - Full Width */}
      <nav className="glass-nav px-6 sm:px-12 py-4 flex items-center justify-between w-full shadow-glass-sm">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-4">
          <SoundToggle />
          {profile.email ? (
            <Link
              onClick={() => sounds.playClick()}
              className="glass-btn-brand text-sm py-2.5 px-5 font-bold shadow-xs inline-flex items-center gap-2"
              to={isTeacher ? "/teach" : "/app"}
            >
              <span>{isTeacher ? "Ustoz Kabineti" : "Darslarga o'tish"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                onClick={() => sounds.playClick()}
                className="glass-btn-secondary text-sm py-2 px-4 font-semibold"
                to="/login"
              >
                {UZ.cta.login}
              </Link>
              <Link
                onClick={() => sounds.playClick()}
                className="glass-btn-brand text-sm py-2 px-5 font-bold"
                to="/register"
              >
                {UZ.cta.register}
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section - Full Width Edge-to-Edge */}
      <main className="w-full px-6 sm:px-12 lg:px-20 py-16 text-center space-y-10 my-auto">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/95 border border-slate-200/90 shadow-glass-sm text-sm font-semibold text-slate-800">
          <Sparkles className="w-4 h-4 text-lime-600" />
          <span>{UZ.tagline}</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-tight">
          Kod yoz. <span className="text-[#65A30D] font-mono">O'zing yoz▍</span>
        </h1>

        <p className="max-w-4xl mx-auto text-lg sm:text-2xl text-slate-600 leading-relaxed font-sans">
          IT o'quv markazlari uchun maxsus HTML va CSS amaliyot platformasi. Ustoz AI tayyor kodni bermaydi —
          4 bosqichli maslahat zinapoyasi orqali har bir talabaga mustaqil fikrlab yozishni o'rgatadi.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-brand px-9 py-4 text-base font-bold shadow-sm inline-flex items-center gap-2.5 rounded-xl"
            to="/app/challenge/22222222-2222-2222-2222-222222222222"
          >
            <span>Workspace darsini ochish</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-secondary px-9 py-4 text-base font-semibold rounded-xl"
            to="/teach/login"
          >
            Ustoz kabineti (teacher@ilmla.uz)
          </Link>
        </div>

        {/* Three Value Pillars - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12 w-full">
          <div className="glass-panel p-8 space-y-4 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 border border-lime-300 flex items-center justify-center text-lime-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Ustoz AI (4 bosqichli)</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Savol → Yo'nalish → Tushuntirish → Qisman yechim. Leak-guard algoritmi tayyor javob chiqib ketishini qat'iy bloklaydi.
            </p>
          </div>

          <div className="glass-panel p-8 space-y-4 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Jonli Musobaqa (Live QR)</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Talabalar 5 soniyada QR kod bilan ulanadi. Proyektorda real-vaqt reyting va konsept xaritasi jonli ko'rinadi.
            </p>
          </div>

          <div className="glass-panel p-8 space-y-4 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Ustoz nazorati</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Qiynalayotgan talabalarning kodini jonli ko'ring, guruhga tezkor ko'rsatma (nudge) yuboring va AI bilan yangi topshiriq yarating.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        O'zing Yoz © 2026 — "Javobni emas, yo'lni ko'rsatamiz."
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
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-[#F8FAFC]">
      <header className="max-w-xl w-full mx-auto pt-4 flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <Link
            to="/teach/login"
            onClick={() => sounds.playClick()}
            className="text-sm font-semibold text-lime-900 hover:text-lime-950 bg-lime-100 hover:bg-lime-200 px-3.5 py-2 rounded-xl border border-lime-300 shadow-xs inline-flex items-center gap-1.5 transition-all"
          >
            <GraduationCap className="w-4 h-4 text-lime-700" />
            <span>Ustozmisiz?</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-700" />
          </Link>
          <SoundToggle />
        </div>
      </header>

      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <form
          onSubmit={handleSubmit}
          className="glass-panel p-8 sm:p-10 space-y-6 shadow-glass-lg rounded-2xl border border-slate-200/80"
        >
          {/* Teacher link pill in header for login */}
          {mode === "login" && (
            <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-lime-50 to-white rounded-xl border border-lime-200/90 text-sm">
              <span className="text-slate-800 font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-lime-700" />
                <span>Ustoz hisobi bilan kirasizmi?</span>
              </span>
              <Link
                to="/teach/login"
                onClick={() => sounds.playClick()}
                className="font-bold text-lime-800 hover:text-lime-900 inline-flex items-center gap-1 underline"
              >
                <span>Ustoz kabineti</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {mode === "login" ? "Talaba Kabinetiga Kirish" : "Talaba Ro'yxatdan O'tishi"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "login"
                ? "Darslar va musobaqalarni davom ettirish uchun kiring"
                : "Kod yozishni boshlash uchun hisobingizni oching"}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">To'liq ism-familiyangiz</label>
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
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Elektron pochta (Email)</label>
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
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Parol</label>
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
            className="glass-btn-brand w-full py-3.5 text-sm font-bold shadow-xs rounded-xl"
          >
            {loading ? "Yuklanmoqda..." : mode === "login" ? UZ.cta.login : UZ.cta.register}
          </button>

          <p className="text-center text-sm text-slate-500 pt-2">
            {mode === "login" ? (
              <>
                Hisobingiz yo'qmi?{" "}
                <Link
                  className="text-slate-900 font-bold underline"
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
                  className="text-slate-900 font-bold underline"
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

      <footer className="py-4 text-center text-xs text-slate-400">
        O'zing Yoz — Har bir talaba o'z kodi muallifi
      </footer>
    </div>
  );
};

// 3. GUEST JOIN PAGE (/join/:code)
const GuestJoinPage: React.FC = () => {
  const { code = "FLX742" } = useParams();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const handleGuestJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    sounds.playSuccess();
    appStore.setProfile({
      id: `guest-${Date.now()}`,
      full_name: nickname.trim(),
      email: "",
      username: `guest_${Date.now().toString().slice(-4)}`,
      role: "student",
      is_guest: true,
    });
    navigate(`/room/${code.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <form onSubmit={handleGuestJoin} className="glass-panel max-w-sm w-full p-8 space-y-5 text-center shadow-glass-lg rounded-2xl">
        <BrandLogo size="lg" />
        <div className="space-y-1">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jonli musobaqa xonasi</p>
          <div className="font-mono text-3xl font-extrabold text-slate-900">{code}</div>
        </div>

        <div className="text-left">
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Ismingiz</label>
          <input
            required
            autoFocus
            placeholder="Masalan: Sardor"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="glass-input text-center text-sm font-semibold py-2.5"
          />
        </div>

        <button type="submit" className="glass-btn-brand w-full py-2.5 text-xs font-bold shadow-xs">
          Xonaga qo'shilish →
        </button>
      </form>
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
        <Route path="/app" element={<StudentDashboard />} />
        <Route path="/app/challenges" element={<StudentDashboard />} />
        <Route path="/app/challenge/:id" element={<Workspace />} />
        <Route path="/room/:code" element={<Workspace isRoom={true} />} />
        <Route path="/teach" element={<TeacherDashboard />} />
        <Route path="/teach/live/:code" element={<LiveControl isProjector={false} />} />
        <Route path="/teach/live/:code/screen" element={<LiveControl isProjector={true} />} />
      </Routes>
    </BrowserRouter>
  );
}