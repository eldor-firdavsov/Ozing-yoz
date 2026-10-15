import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Filter,
  Users,
  Compass,
  Code2,
  LogOut,
  QrCode,
  Trophy,
  HelpCircle,
  Heart,
  Zap,
  Target,
  ChevronRight,
  Lock,
  Star,
  Check,
  Calendar,
  Layers,
  Clock,
  Play
} from "lucide-react";
import { appStore } from "../../lib/store";
import { COURSE_CHALLENGES, ChallengeItem } from "../../lib/challenges-data";
import { BrandLogo, SoundToggle, ThemeToggle, GlassModal } from "../../components/ui/GlassComponents";
import { sounds } from "../../lib/audio";
import { UZ } from "../../lib/i18n/uz";

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const profile = appStore.getProfile();
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [classCode, setClassCode] = useState("");

  const challenges = appStore.getChallenges();
  const completedCount = challenges.filter((c) => appStore.isChallengeCompleted(c.id)).length;
  const nextChallenge = challenges.find((c) => !appStore.isChallengeCompleted(c.id)) || challenges[0];

  const topics = [
    { id: "all", label: "Barchasi" },
    { id: "semantic-html", label: "HTML Asoslari" },
    { id: "flexbox", label: "Flexbox" },
    { id: "grid", label: "CSS Grid" },
    { id: "responsive", label: "Responsive" },
    { id: "forms", label: "Formalar" },
    { id: "colors", label: "Ranglar & Stil" },
  ];

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description_md.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === "all" || c.topics.includes(selectedTopic);
    const matchesLevel = selectedLevel === "all" || c.level === selectedLevel;
    return matchesSearch && matchesTopic && matchesLevel;
  });

  // Group into Curriculum Units
  const unit1 = filteredChallenges.filter((c) => c.level === 1 || c.topics.includes("forms"));
  const unit2 = filteredChallenges.filter((c) => c.level === 2 && !c.topics.includes("forms"));
  const unit3 = filteredChallenges.filter((c) => c.level === 3 || (!unit1.includes(c) && !unit2.includes(c)));

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) return;
    sounds.playSuccess();
    setShowJoinModal(false);
    navigate(`/room/${classCode.trim().toUpperCase()}`);
  };

  const handleLogout = () => {
    sounds.playClick();
    appStore.logout();
    navigate("/login");
  };

  const weekDays = [
    { label: "Du", active: true },
    { label: "Se", active: completedCount > 0 },
    { label: "Cho", active: completedCount > 1 },
    { label: "Pa", active: completedCount > 3 },
    { label: "Ju", active: completedCount > 5 },
    { label: "Sha", active: false },
    { label: "Yak", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] flex flex-col md:flex-row text-slate-800 dark:text-slate-100 selection:bg-emerald-100 dark:selection:bg-emerald-950 transition-colors">
      {/* ======================================================== */}
      {/* 1. MONDLY-STYLE LEFT NAVIGATION SIDEBAR (w-64)            */}
      {/* ======================================================== */}
      <aside className="w-64 border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A] h-screen sticky top-0 hidden md:flex flex-col justify-between p-5 shrink-0 select-none z-30 shadow-xs">
        <div className="space-y-6">
          <div className="px-1 pt-1">
            <BrandLogo size="md" />
          </div>

          {/* Student-Only Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              to="/app"
              onClick={() => sounds.playClick()}
              className="mondly-nav-item-active"
            >
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Darslar & Kurs</span>
            </Link>

            <button
              onClick={() => {
                sounds.playClick();
                setShowJoinModal(true);
              }}
              className="w-full mondly-nav-item"
            >
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Jonli Musobaqa</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowHelpModal(true);
              }}
              className="w-full mondly-nav-item"
            >
              <Sparkles className="w-5 h-5 text-sky-500" />
              <span>Ustoz AI Qo'llanma</span>
            </button>
          </nav>
        </div>

        {/* Bottom Student Profile & Logout (No Teacher Links!) */}
        <div className="pt-4 border-t border-slate-200/90 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {profile.full_name || "Talaba"}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{profile.xp} XP to'plandi</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Hisobdan chiqish</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. CENTER FEED: MONDLY CURRICULUM ROADMAP                 */}
      {/* ======================================================== */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-4xl w-full mx-auto space-y-7">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 font-bold text-amber-600 text-sm">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{profile.streak}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-emerald-600 text-sm">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>{profile.xp} XP</span>
            </div>
            <SoundToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Mondly-style Activity & Streak Tracker Banner */}
        <div className="mondly-card p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Haftalik Faollik</span>
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              Salom, {profile.full_name ? profile.full_name.split(" ")[0] : "Talaba"}!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-md">
              Har kuni 1 ta topshiriq bajarib ketma-ketlikni oshiring va mustaqil dasturchi bo'ling.
            </p>
          </div>

          {/* 7-Day Week Activity Tracker */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 text-center px-1.5">
                <span className="text-[10px] uppercase font-bold text-white/80">{day.label}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    day.active
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {day.active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "•"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Next Lesson (Mondly Daily Challenge Card) */}
        {nextChallenge && (
          <div className="mondly-card p-5 sm:p-6 bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Play className="w-6 h-6 fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Tavsiya etilgan amaliyot
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    {nextChallenge.level}-daraja
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{nextChallenge.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {nextChallenge.description_md.replace(/[`*]/g, "")}
                </p>
              </div>
            </div>

            <Link
              to={`/app/challenge/${nextChallenge.id}`}
              onClick={() => sounds.playClick()}
              className="mondly-btn-primary px-6 py-2.5 text-xs font-bold shrink-0 self-end sm:self-auto"
            >
              <span>Boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="mondly-card p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-1/2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mashq nomi yoki mavzu bo'yicha qidiruv..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Daraja:
              </span>
              {(["all", 1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedLevel(lvl);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedLevel === lvl
                      ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {lvl === "all" ? "Barchasi" : `${lvl}-daraja`}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 select-none">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTopic(t.id);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedTopic === t.id
                    ? "bg-emerald-600 text-white shadow-xs font-bold"
                    : "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* UNIT 1: HTML ASOSLARI                                    */}
        {/* ======================================================== */}
        <section className="space-y-3.5">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-100">
                1-Mavzular to'plami
              </span>
              <h2 className="text-xl font-bold text-white">HTML Asoslari va Semantika</h2>
              <p className="text-xs text-emerald-100 font-normal">
                Teglar, matnlar, sarlavhalar va formalar tuzilishi
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            {unit1.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`mondly-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-emerald-300 ${
                    isDone ? "bg-emerald-50/30 border-emerald-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold border transition-all ${
                        isDone
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <span className="font-mono text-sm font-bold text-slate-500">#{c.level}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {c.level}-daraja
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${isDone ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "mondly-btn-secondary" : "mondly-btn-primary"} px-5 py-2 text-xs font-bold shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* UNIT 2: CSS FLEXBOX                                      */}
        {/* ======================================================== */}
        <section className="space-y-3.5 pt-2">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase font-bold tracking-widest text-sky-100">
                2-Mavzular to'plami
              </span>
              <h2 className="text-xl font-bold text-white">Flexbox va Zamonaviy Joylashuv</h2>
              <p className="text-xs text-sky-100 font-normal">
                Elementlarni markazlash, qatorlar va navigatsiya menyusi
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            {unit2.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`mondly-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-sky-300 ${
                    isDone ? "bg-sky-50/30 border-sky-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold border transition-all ${
                        isDone
                          ? "bg-sky-500 border-sky-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <span className="font-mono text-sm font-bold text-slate-500">#{c.level}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {c.level}-daraja
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${isDone ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-600">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "mondly-btn-secondary" : "mondly-btn-sky"} px-5 py-2 text-xs font-bold shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* UNIT 3: CSS GRID & RESPONSIVE                            */}
        {/* ======================================================== */}
        <section className="space-y-3.5 pt-2">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase font-bold tracking-widest text-purple-100">
                3-Mavzular to'plami
              </span>
              <h2 className="text-xl font-bold text-white">CSS Grid va Moslashuvchan Dizayn</h2>
              <p className="text-xs text-purple-100 font-normal">
                Galereyalar, kartalar to'plami va mobil ekran moslashuvi
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            {unit3.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`mondly-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-purple-300 ${
                    isDone ? "bg-purple-50/30 border-purple-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold border transition-all ${
                        isDone
                          ? "bg-purple-500 border-purple-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        <span className="font-mono text-sm font-bold text-slate-500">#{c.level}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {c.level}-daraja
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${isDone ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-purple-600">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "mondly-btn-secondary" : "mondly-btn-primary"} px-5 py-2 text-xs font-bold shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 3. MONDLY-STYLE RIGHT STATS SIDEBAR (w-80)                */}
      {/* ======================================================== */}
      <aside className="w-80 p-6 space-y-6 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto select-none border-l border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
        {/* Top Stat Summary Pills */}
        <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800">
          {/* Streak Flame */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">{profile.streak} kun</span>
            <span className="text-[10px] text-slate-400 font-semibold">Ketma-ket</span>
          </div>

          {/* XP Lightning */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">{profile.xp} XP</span>
            <span className="text-[10px] text-slate-400 font-semibold">Ball</span>
          </div>

          {/* Completed */}
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
            <Award className="w-5 h-5 text-sky-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">{completedCount}/{challenges.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Tugallandi</span>
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="mondly-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kunlik Maqsad</span>
            </h4>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {Math.min(completedCount, 3)}/3 mashq
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Har kuni kamida 3 ta amaliy topshiriqni mustaqil yakunlab bilimingizni mustahkamlang.
          </p>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedCount / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Live Classroom Tournament Widget */}
        <div className="mondly-card p-5 space-y-3.5 bg-gradient-to-br from-white to-amber-50/30 dark:from-[#0F172A] dark:to-amber-950/20 border-amber-200/80 dark:border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Jonli Musobaqa
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sinf xonasiga ulanish</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Ustoz taqdim etgan 6 xonali xona kodini kiriting (masalan: <strong>FLX742</strong>).
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              setShowJoinModal(true);
            }}
            className="w-full mondly-btn-primary py-2.5 text-xs font-bold shadow-xs"
          >
            Xonaga ulanish →
          </button>
        </div>

        {/* Ustoz AI Advice Card */}
        <div className="mondly-card p-5 space-y-3 bg-gradient-to-br from-white to-emerald-50/30 dark:from-[#0F172A] dark:to-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Ustoz AI
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">4 bosqichli maslahat</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            "Kodni tayyor ko'chirmang. 1-darajali maslahat bilan o'ylab yozish — mustaqil dasturchi bo'lishning yagona yo'lidir!"
          </p>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 4. MODALS (Join Class & Help)                            */}
      {/* ======================================================== */}
      <GlassModal open={showJoinModal} onClose={() => setShowJoinModal(false)} title="Jonli Xonaga Ulanish">
        <form onSubmit={handleJoinClass} className="space-y-4">
          <p className="text-sm font-normal text-slate-600">
            Ustozingiz bergan 6 xonali xona kodini (masalan: <strong>FLX742</strong>) kiriting:
          </p>
          <input
            required
            autoFocus
            maxLength={8}
            placeholder="FLX742"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="glass-input text-center font-mono text-2xl tracking-widest uppercase font-extrabold py-3 border focus:border-emerald-500"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="mondly-btn-secondary text-xs py-2 px-4 font-bold"
            >
              Bekor qilish
            </button>
            <button type="submit" className="mondly-btn-primary text-xs py-2 px-5 font-bold">
              Xonaga kirish →
            </button>
          </div>
        </form>
      </GlassModal>

      <GlassModal open={showHelpModal} onClose={() => setShowHelpModal(false)} title="Talaba Qo'llanmasi — O'zing Yoz">
        <div className="space-y-4 text-xs text-slate-700">
          <p className="text-sm font-bold text-slate-900">Platforma qanday ishlaydi?</p>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <strong className="text-emerald-900 text-sm">1. Amaliyotni tanlang</strong>
              <p className="text-slate-600">Bo'limlar bo'yicha HTML/CSS mashqlarini tanlab "Boshlash" tugmasini bosing.</p>
            </div>
            <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
              <strong className="text-sky-900 text-sm">2. Mustaqil kod yozing</strong>
              <p className="text-slate-600">VS Code uslubidagi muhitda kod yozing va Ctrl+Enter orqali testlarni bajaring.</p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <strong className="text-amber-900 text-sm">3. Ustoz AI dan maslahat oling</strong>
              <p className="text-slate-600">Savol → Yo'nalish → Tushuntirish → Qisman yechim zinapoyasi orqali yordam oling.</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowHelpModal(false)}
              className="mondly-btn-primary text-xs py-2 px-5 font-bold"
            >
              Tushundim
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
