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
  Lock
} from "lucide-react";
import { UZ } from "./lib/i18n/uz";
import { supabase, toSyntheticEmail } from "./lib/supabase";
import { appStore } from "./lib/store";
import { BrandLogo, SoundToggle } from "./components/ui/GlassComponents";
import { sounds } from "./lib/audio";
import { Workspace } from "./pages/student/Workspace";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { LiveControl } from "./pages/teacher/LiveControl";

// 1. LANDING PAGE (/)
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC]">
      {/* Nav */}
      <nav className="glass-nav px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto rounded-b-2xl shadow-glass-sm">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <SoundToggle />
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-secondary text-xs py-2 px-3.5"
            to="/login"
          >
            {UZ.cta.login}
          </Link>
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-brand text-xs py-2 px-4 font-semibold"
            to="/register"
          >
            {UZ.cta.register}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-glass-sm text-xs font-semibold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-lime-600" />
          <span>{UZ.tagline}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Kod yoz. <span className="text-[#65A30D] font-mono">O'zing yoz▍</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
          IT o'quv markazlari uchun maxsus HTML va CSS platformasi. Ustoz AI tayyor kodni berib qo'ymaydi —
          4 bosqichli maslahat zinapoyasi orqali o'quvchini mustaqil fikrlashga va professional kod yozishga o'rgatadi.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-brand px-7 py-3 text-sm font-bold shadow-sm inline-flex items-center gap-2"
            to="/app/challenge/22222222-2222-2222-2222-222222222222"
          >
            <span>Workspace darsini ochish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            onClick={() => sounds.playClick()}
            className="glass-btn-secondary px-7 py-3 text-sm font-semibold"
            to="/teach"
          >
            Ustoz kabineti (Demo)
          </Link>
        </div>

        {/* Three Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-10">
          <div className="glass-panel p-6 space-y-3 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-lime-100 border border-lime-300 flex items-center justify-center text-lime-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Ustoz AI (4 bosqichli)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Savol → Yo'nalish → Tushuntirish → Qisman yechim. Leak-guard algoritmi tayyor javob chiqib ketishini qat'iy bloklaydi.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Jonli xona (Live QR)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O'quvchilar doskadagi QR kod orqali 5 soniyada ulanadi. Proyektorda real-vaqt reyting va konsept xaritasi ko'rsatiladi.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3 shadow-glass transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Ustoz nazorati</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Qaysi talaba qaysi qatorda qiynalayotganini real vaqtda ko'ring, guruhga tezkor ko'rsatma (nudge) yuboring va AI bilan yangi mashq yarating.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        O'zing Yoz © 2026 — "Javobni emas, yo'lni ko'rsatamiz."
      </footer>
    </div>
  );
};

// 2. AUTH PAGE (/login & /register)
const AuthPage: React.FC<{ mode: "login" | "register" }> = ({ mode }) => {
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    sounds.playClick();

    try {
      const email = toSyntheticEmail(username);

      if (mode === "register") {
        try {
          await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, username } },
          });
        } catch (_) {}

        appStore.setProfile({
          full_name: fullName,
          username,
          role: isTeacher ? "teacher" : "student",
          is_guest: false,
        });

        sounds.playSuccess();
        if (isTeacher) navigate("/teach");
        else navigate("/app");
      } else {
        try {
          await supabase.auth.signInWithPassword({ email, password });
        } catch (_) {}

        appStore.setProfile({
          username,
          full_name: username.charAt(0).toUpperCase() + username.slice(1),
          role: isTeacher ? "teacher" : "student",
          is_guest: false,
        });

        sounds.playSuccess();
        if (isTeacher) navigate("/teach");
        else navigate("/app");
      }
    } catch (err: any) {
      sounds.playError();
      setError(err.message || UZ.errors.invalidAuth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <form onSubmit={handleSubmit} className="glass-panel max-w-md w-full p-8 space-y-5 shadow-glass-lg rounded-2xl">
        <div className="text-center space-y-1">
          <BrandLogo size="lg" />
          <p className="text-xs text-slate-500 font-medium">
            {mode === "login" ? "Tizimga kirish" : "Yangi hisob yaratish"}
          </p>
        </div>

        {mode === "register" && (
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsTeacher(false);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isTeacher ? "bg-white shadow-xs text-slate-900" : "text-slate-500"
              }`}
            >
              Men talabaman
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsTeacher(true);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isTeacher ? "bg-white shadow-xs text-slate-900" : "text-slate-500"
              }`}
            >
              Men ustozman
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          {mode === "register" && (
            <input
              required
              placeholder="To'liq ism-sharifingiz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="glass-input text-xs"
            />
          )}

          <input
            required
            placeholder="Foydalanuvchi nomi (username)"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            className="glass-input font-mono text-xs"
          />

          <input
            required
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input text-xs"
          />

          {mode === "register" && (
            <input
              placeholder={isTeacher ? "Ustoz taklif kodi (masalan: USTOZ2026)" : "Sinf kodi (ixtiyoriy)"}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="glass-input font-mono text-xs uppercase"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="glass-btn-brand w-full py-2.5 text-xs font-bold shadow-xs"
        >
          {loading ? "Yuklanmoqda..." : mode === "login" ? UZ.cta.login : UZ.cta.register}
        </button>

        <p className="text-center text-xs text-slate-500 pt-1">
          {mode === "login" ? (
            <>
              Hisobingiz yo'qmi?{" "}
              <Link className="text-slate-900 font-bold underline" to="/register">
                Ro'yxatdan o'tish
              </Link>
            </>
          ) : (
            <>
              Hisobingiz bormi?{" "}
              <Link className="text-slate-900 font-bold underline" to="/login">
                Kirish
              </Link>
            </>
          )}
        </p>
      </form>
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
      full_name: nickname.trim(),
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
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jonli dars xonasi</p>
          <div className="font-mono text-3xl font-extrabold text-slate-900">{code}</div>
        </div>

        <input
          required
          autoFocus
          placeholder="Ismingizni kiriting"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="glass-input text-center text-sm font-semibold py-2.5"
        />

        <button type="submit" className="glass-btn-brand w-full py-2.5 text-xs font-bold shadow-xs">
          {UZ.cta.joinRoom} →
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
        <Route path="/join/:code" element={<GuestJoinPage />} />
        <Route path="/app" element={<StudentDashboard />} />
        <Route path="/app/challenges" element={<StudentDashboard />} />
        <Route path="/app/challenge/:id" element={<Workspace />} />
        <Route path="/room/:code" element={<Workspace />} />
        <Route path="/teach" element={<TeacherDashboard />} />
        <Route path="/teach/live/:code" element={<LiveControl isProjector={false} />} />
        <Route path="/teach/live/:code/screen" element={<LiveControl isProjector={true} />} />
      </Routes>
    </BrowserRouter>
  );
}