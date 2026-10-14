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
  GraduationCap,
  Heart,
  Zap,
  Target,
  ChevronRight,
  Lock,
  Star,
  Check
} from "lucide-react";
import { appStore } from "../../lib/store";
import { COURSE_CHALLENGES, ChallengeItem } from "../../lib/challenges-data";
import { BrandLogo, SoundToggle, GlassModal } from "../../components/ui/GlassComponents";
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

  // Split into Duolingo-style Units
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

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col md:flex-row text-[#3C3C3C] selection:bg-[#D7FFB8]">
      {/* ======================================================== */}
      {/* 1. DUOLINGO DESKTOP LEFT STICKY SIDEBAR (w-64)            */}
      {/* ======================================================== */}
      <aside className="w-64 border-r-2 border-[#E5E5E5] bg-white h-screen sticky top-0 hidden md:flex flex-col justify-between p-4 shrink-0 select-none z-30">
        <div className="space-y-6">
          {/* Duolingo Brand Header */}
          <div className="px-3 pt-2">
            <BrandLogo size="md" />
          </div>

          {/* Navigation Links with 3D Pill Look */}
          <nav className="space-y-2">
            <Link
              to="/app"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#84D8FF] border-b-4 border-b-[#1CB0F6] font-extrabold text-sm uppercase tracking-wider transition-all"
            >
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
              <span>O'rganish</span>
            </Link>

            <button
              onClick={() => {
                sounds.playClick();
                setShowJoinModal(true);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border-2 border-transparent font-extrabold text-sm uppercase tracking-wider transition-all"
            >
              <Trophy className="w-5 h-5 text-[#FFC800] stroke-[2.5]" />
              <span>Musobaqa</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowHelpModal(true);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border-2 border-transparent font-extrabold text-sm uppercase tracking-wider transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#58CC02] stroke-[2.5]" />
              <span>Ustoz AI</span>
            </button>

            <Link
              to="/teach/login"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border-2 border-transparent font-extrabold text-sm uppercase tracking-wider transition-all"
            >
              <GraduationCap className="w-5 h-5 text-indigo-500 stroke-[2.5]" />
              <span>Ustoz Kabineti</span>
            </Link>
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="pt-4 border-t-2 border-[#E5E5E5] space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center font-black text-lg border-b-2 border-[#46A302]">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="overflow-hidden">
                <p className="font-extrabold text-sm text-slate-900 truncate">
                  {profile.full_name || "Mehmon talaba"}
                </p>
                <p className="text-xs font-bold text-slate-400">Talaba</p>
              </div>
            </div>
            <SoundToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full duo-btn-white py-2 text-xs font-extrabold text-slate-500 hover:text-rose-600"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. CENTER FEED: DUOLINGO UNITS LEARNING PATH (Expanded)   */}
      {/* ======================================================== */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-4xl w-full mx-auto space-y-8">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-2 border-[#E5E5E5] rounded-2xl">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-black text-[#FF9600]">
              <Flame className="w-5 h-5 fill-[#FF9600]" />
              <span>{profile.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 font-black text-[#FFC800]">
              <Zap className="w-5 h-5 fill-[#FFC800]" />
              <span>{profile.xp}</span>
            </div>
            <SoundToggle />
          </div>
        </header>

        {/* Filter and Search Bar (Duolingo Pill Bar) */}
        <div className="duo-card p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-1/2">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mashq nomi yoki mavzu bo'yicha qidiruv..."
                className="w-full bg-[#F7F7F7] border-2 border-slate-200 rounded-xl pl-11 pr-4 py-2 text-sm font-semibold focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Daraja:
              </span>
              {(["all", 1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedLevel(lvl);
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-extrabold uppercase transition-all ${
                    selectedLevel === lvl
                      ? "bg-[#58CC02] text-white border-b-2 border-[#46A302]"
                      : "bg-[#F7F7F7] border border-slate-200 text-slate-600 hover:bg-slate-100"
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
                className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all uppercase tracking-wider ${
                  selectedTopic === t.id
                    ? "bg-[#1CB0F6] text-white border-b-2 border-[#1899D6]"
                    : "bg-[#F7F7F7] border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* UNIT 1: HTML ASOSLARI (Duolingo Green Banner)           */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="bg-[#58CC02] border-b-4 border-[#46A302] text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#D7FFB8]">
                1-BO'LIM
              </span>
              <h2 className="text-2xl font-black text-white">HTML Asoslari va Matnlar</h2>
              <p className="text-sm font-semibold text-[#D7FFB8]">
                Teglar, sarlavhalar, paragraflar va formalar bilan boshlang'ich sahifani yozing
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-3">
            {unit1.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`duo-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300 ${
                    isDone ? "bg-[#F7FEE7] border-lime-300 border-b-lime-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl border-b-4 ${
                        isDone
                          ? "bg-[#58CC02] border-[#46A302] text-white"
                          : "bg-[#F7F7F7] border-slate-300 text-slate-700"
                      }`}
                    >
                      {isDone ? <Check className="w-7 h-7 stroke-[3]" /> : <Star className="w-6 h-6 fill-[#FFC800] text-[#FFC800]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                          {c.level}-daraja
                        </span>
                        <span className="text-xs font-mono font-bold text-[#FF9600]">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "duo-btn-white" : "duo-btn-green"} px-6 py-2.5 text-xs shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* UNIT 2: CSS FLEXBOX TARTIBI (Duolingo Blue Banner)       */}
        {/* ======================================================== */}
        <section className="space-y-4 pt-4">
          <div className="bg-[#1CB0F6] border-b-4 border-[#1899D6] text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#DDF4FF]">
                2-BO'LIM
              </span>
              <h2 className="text-2xl font-black text-white">Flexbox va Zamonaviy Joylashuv</h2>
              <p className="text-sm font-semibold text-[#DDF4FF]">
                Elementlarni markazlash, navbar yasash va interaktiv tugmalar
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-3">
            {unit2.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`duo-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300 ${
                    isDone ? "bg-[#F7FEE7] border-lime-300 border-b-lime-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl border-b-4 ${
                        isDone
                          ? "bg-[#58CC02] border-[#46A302] text-white"
                          : "bg-[#F7F7F7] border-slate-300 text-slate-700"
                      }`}
                    >
                      {isDone ? <Check className="w-7 h-7 stroke-[3]" /> : <Star className="w-6 h-6 fill-[#FFC800] text-[#FFC800]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                          {c.level}-daraja
                        </span>
                        <span className="text-xs font-mono font-bold text-[#FF9600]">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "duo-btn-white" : "duo-btn-blue"} px-6 py-2.5 text-xs shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* UNIT 3: CSS GRID & RESPONSIVE (Duolingo Purple Banner)   */}
        {/* ======================================================== */}
        <section className="space-y-4 pt-4">
          <div className="bg-[#CE82FF] border-b-4 border-[#A55EEA] text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#F3E8FF]">
                3-BO'LIM
              </span>
              <h2 className="text-2xl font-black text-white">CSS Grid va Responsive Dizayn</h2>
              <p className="text-sm font-semibold text-[#F3E8FF]">
                Murakkab to'rlar, moslashuvchan media so'rovlari va professional tartib
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-3">
            {unit3.map((c) => {
              const isDone = appStore.isChallengeCompleted(c.id);
              return (
                <div
                  key={c.id}
                  className={`duo-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300 ${
                    isDone ? "bg-[#F7FEE7] border-lime-300 border-b-lime-400" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl border-b-4 ${
                        isDone
                          ? "bg-[#58CC02] border-[#46A302] text-white"
                          : "bg-[#F7F7F7] border-slate-300 text-slate-700"
                      }`}
                    >
                      {isDone ? <Check className="w-7 h-7 stroke-[3]" /> : <Star className="w-6 h-6 fill-[#FFC800] text-[#FFC800]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                          {c.level}-daraja
                        </span>
                        <span className="text-xs font-mono font-bold text-[#FF9600]">
                          +100 XP
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">{c.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                        {c.description_md.replace(/[`*]/g, "")}
                      </p>
                    </div>
                  </div>

                  <Link
                    onClick={() => sounds.playClick()}
                    to={`/app/challenge/${c.id}`}
                    className={`${isDone ? "duo-btn-white" : "duo-btn-green"} px-6 py-2.5 text-xs shrink-0 self-end sm:self-auto`}
                  >
                    <span>{isDone ? "Takrorlash" : "Boshlash"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 3. DUOLINGO DESKTOP RIGHT SIDEBAR (w-80)                  */}
      {/* ======================================================== */}
      <aside className="w-80 p-6 space-y-6 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto select-none border-l-2 border-[#E5E5E5] bg-white">
        {/* Top Floating Stat Pills */}
        <div className="flex items-center justify-between gap-2 p-2 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5]">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 font-extrabold text-sm text-[#FF9600]">
            <Flame className="w-5 h-5 fill-[#FF9600]" />
            <span>{profile.streak}</span>
          </div>

          {/* XP Lightning */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 font-extrabold text-sm text-[#FFC800]">
            <Zap className="w-5 h-5 fill-[#FFC800]" />
            <span>{profile.xp}</span>
          </div>

          {/* Hearts / Hints */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 font-extrabold text-sm text-[#FF4B4B]">
            <Heart className="w-5 h-5 fill-[#FF4B4B]" />
            <span>4/4</span>
          </div>
        </div>

        {/* Daily Quests Card (Duolingo Style) */}
        <div className="duo-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#58CC02]" />
              <span>Kunlik Maqsad</span>
            </h4>
            <span className="text-xs font-extrabold text-slate-400">
              {Math.min(completedCount, 3)}/3
            </span>
          </div>

          <p className="text-xs text-slate-600 font-semibold">
            Bugun kamida 3 ta amaliy mashqni mustaqil yakunlang.
          </p>

          <div className="w-full bg-[#E5E5E5] h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#58CC02] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedCount / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Live Classroom Tournament Widget */}
        <div className="duo-card p-5 space-y-3.5 bg-gradient-to-br from-white to-amber-50/40 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC800] border-b-2 border-[#E5B400] flex items-center justify-center text-white shrink-0">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
                Jonli Musobaqa
              </h4>
              <p className="text-xs text-slate-500 font-semibold">Sinf xonasiga ulanish</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Ustoz taqdim etgan 6 xonali xona kodini kiriting (masalan: <strong>FLX742</strong>).
          </p>

          <button
            onClick={() => {
              sounds.playClick();
              setShowJoinModal(true);
            }}
            className="w-full duo-btn-orange py-2.5 text-xs font-black shadow-xs"
          >
            Xonaga ulanish →
          </button>
        </div>

        {/* Ustoz AI Mascot Bubble Card */}
        <div className="duo-card p-5 space-y-3 bg-[#F7FEE7] border-lime-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-b-2 border-[#46A302] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider text-[#58CC02]">
                Ustoz AI Maslahati
              </h4>
              <p className="text-xs text-lime-800 font-bold">Zinapoya tizimi</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
            "Kodni tayyor ko'chirmang. 1-darajali maslahat orqali fikrlab o'zingiz yozing — natija ancha mustahkam bo'ladi!"
          </p>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 4. MODALS (Join Class & Help)                            */}
      {/* ======================================================== */}
      <GlassModal open={showJoinModal} onClose={() => setShowJoinModal(false)} title="Jonli Xonaga Ulanish">
        <form onSubmit={handleJoinClass} className="space-y-4">
          <p className="text-sm font-semibold text-slate-600">
            Ustozingiz bergan 6 xonali xona kodini (masalan: <strong>FLX742</strong>) kiriting:
          </p>
          <input
            required
            autoFocus
            maxLength={8}
            placeholder="FLX742"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="glass-input text-center font-mono text-2xl tracking-widest uppercase font-black py-3 border-2 focus:border-[#58CC02]"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="duo-btn-white text-xs py-2 px-4"
            >
              Bekor qilish
            </button>
            <button type="submit" className="duo-btn-green text-xs py-2 px-5 font-black">
              Xonaga kirish →
            </button>
          </div>
        </form>
      </GlassModal>

      <GlassModal open={showHelpModal} onClose={() => setShowHelpModal(false)} title="Talaba Qo'llanmasi — O'zing Yoz">
        <div className="space-y-4 text-xs text-slate-700">
          <p className="text-sm font-extrabold text-slate-900">Platforma qanday ishlaydi?</p>
          <div className="space-y-2.5">
            <div className="p-3.5 bg-lime-50 rounded-2xl border-2 border-lime-200 space-y-1">
              <strong className="text-lime-900 text-sm">1. Mashg'ulotni tanlang</strong>
              <p className="text-slate-600 font-semibold">Bo'limlar bo'yicha HTML/CSS mashqlarini tanlab "Boshlash" tugmasini bosing.</p>
            </div>
            <div className="p-3.5 bg-sky-50 rounded-2xl border-2 border-sky-200 space-y-1">
              <strong className="text-sky-900 text-sm">2. Mustaqil kod yozing</strong>
              <p className="text-slate-600 font-semibold">VS Code muhiti va tezkor sinov (Ctrl+Enter) yordamida o'z kodingizni sinang.</p>
            </div>
            <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-1">
              <strong className="text-amber-900 text-sm">3. Ustoz AI dan maslahat oling</strong>
              <p className="text-slate-600 font-semibold">Agar qiynalsangiz, 4 bosqichli maslahat zinapoyasidan foydalaning: Savol → Yo'nalish → Tushuntirish → Qisman yechim.</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setShowHelpModal(false)} className="duo-btn-green text-xs py-2 px-5 font-black">
              Tushundim
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
