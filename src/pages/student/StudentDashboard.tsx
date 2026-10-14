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
  HelpCircle
} from "lucide-react";
import { appStore } from "../../lib/store";
import { COURSE_CHALLENGES } from "../../lib/challenges-data";
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-12 w-full space-y-8">
      {/* Top Navbar - Full Width */}
      <header className="glass-panel px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-glass-sm rounded-2xl w-full">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-100 rounded-full text-sm font-mono text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse" />
            <span>Talaba:</span>
            <strong className="text-slate-950 font-bold">{profile.full_name || "Mehmon talaba"}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle />

          {/* Help Modal Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowHelpModal(true);
            }}
            title="Qanday ishlashini bilish"
            className="glass-btn-secondary text-sm py-2 px-3.5 font-medium flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-lime-700" />
            <span className="hidden sm:inline">Qo'llanma</span>
          </button>

          {/* Join Live Competition Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowJoinModal(true);
            }}
            className="glass-btn-brand text-sm py-2 px-4 font-bold shadow-xs flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Musobaqaga ulanish</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Tizimdan chiqish"
            className="glass-btn-secondary text-sm py-2 px-3.5 font-medium text-slate-600 hover:text-rose-600 hover:border-rose-200 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* Hero Stats Banner - Full Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {/* XP Card */}
        <div className="glass-panel p-6 flex items-center gap-5 shadow-glass-sm">
          <div className="w-14 h-14 rounded-2xl bg-lime-100 border border-lime-300 flex items-center justify-center text-lime-700 shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">To'plangan tajriba</p>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">{profile.xp} XP</p>
          </div>
        </div>

        {/* Completed Challenges */}
        <div className="glass-panel p-6 flex items-center gap-5 shadow-glass-sm">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Bajarilgan mashqlar</p>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              {completedCount} / {challenges.length} ta
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="glass-panel p-6 flex items-center gap-5 shadow-glass-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Faollik ketma-ketligi</p>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-700 mt-1">{profile.streak} kun</p>
          </div>
        </div>

        {/* Ustoz AI Ladder Status */}
        <div className="glass-panel p-6 flex items-center gap-5 shadow-glass-sm bg-gradient-to-br from-white/95 to-lime-50/60">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Ustoz AI Yordamchisi</p>
            <p className="text-sm font-bold text-slate-900 mt-1">4 bosqichli maslahat faol</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Full Width */}
      <div className="glass-panel p-5 space-y-4 shadow-glass-sm w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mashq nomi yoki mavzu bo'yicha qidiruv..."
              className="glass-input pl-11 text-sm sm:text-base py-3"
            />
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <span className="text-sm text-slate-600 font-semibold flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Daraja:
            </span>
            {(["all", 1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playClick();
                  setSelectedLevel(lvl);
                }}
                className={`text-sm px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedLevel === lvl
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {lvl === "all" ? "Barchasi" : `${lvl}-daraja`}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-1 select-none">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sounds.playClick();
                setSelectedTopic(t.id);
              }}
              className={`text-sm font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedTopic === t.id
                  ? "bg-[#84CC16] text-slate-950 shadow-xs"
                  : "bg-white/80 border border-slate-200/90 text-slate-700 hover:bg-white hover:text-slate-950"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Room Quick Banner - Full Width */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-glass w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2.5">
              <span>Jonli Musobaqa Xonasi</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-lime-400/20 text-lime-300 font-mono font-medium">
                Real-vaqt sinxron
              </span>
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Ustozingiz bergan kodni kiritib darsdagi jonli musobaqaga qo'shiling (masalan: <strong>FLX742</strong>).
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            setShowJoinModal(true);
          }}
          className="glass-btn-brand text-sm font-bold py-3 px-6 shrink-0 rounded-xl"
        >
          Xonaga ulanish →
        </button>
      </div>

      {/* Challenges Grid - Full Width Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {filteredChallenges.map((c) => {
          const isDone = appStore.isChallengeCompleted(c.id);
          return (
            <div
              key={c.id}
              className={`glass-card p-6 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-glass ${
                isDone ? "border-lime-200 bg-lime-50/25" : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      c.level === 1
                        ? "bg-sky-100 text-sky-800"
                        : c.level === 2
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {c.level}-daraja
                  </span>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-lime-700 bg-lime-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bajarildi</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400">+100 XP</span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-snug">{c.title}</h3>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-sans">
                  {c.description_md.replace(/[`*]/g, "")}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-sm text-slate-500 font-mono font-medium">
                  {c.tests.length} ta tekshiruv
                </span>
                <Link
                  onClick={() => sounds.playClick()}
                  to={`/app/challenge/${c.id}`}
                  className={`text-sm py-2 px-5 rounded-xl font-bold inline-flex items-center gap-1.5 transition-all ${
                    isDone
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-[#84CC16] text-slate-950 hover:bg-[#65A30D] hover:text-white shadow-xs"
                  }`}
                >
                  <span>{isDone ? "Qayta ko'rish" : "Boshlash"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Join Class / Room Modal */}
      <GlassModal open={showJoinModal} onClose={() => setShowJoinModal(false)} title="Sinfga yoki Jonli xonaga ulanish">
        <form onSubmit={handleJoinClass} className="space-y-4">
          <p className="text-sm text-slate-600">
            Ustozingiz bergan 6 xonali xona kodini (masalan: <strong>FLX742</strong>) kiriting:
          </p>
          <input
            required
            autoFocus
            maxLength={8}
            placeholder="Kodni kiriting (masalan: FLX742)"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="glass-input text-center font-mono text-xl tracking-widest uppercase font-bold py-3"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowJoinModal(false)}
              className="glass-btn-secondary text-xs"
            >
              Bekor qilish
            </button>
            <button type="submit" className="glass-btn-brand text-xs font-semibold">
              Xonaga kirish →
            </button>
          </div>
        </form>
      </GlassModal>

      {/* Help Modal */}
      <GlassModal open={showHelpModal} onClose={() => setShowHelpModal(false)} title="Talaba Qo'llanmasi — O'zing Yoz">
        <div className="space-y-4 text-xs text-slate-700">
          <p className="text-sm font-semibold text-slate-900">Platformadan qanday foydalaniladi?</p>
          <div className="space-y-2.5">
            <div className="p-3 bg-lime-50 rounded-xl border border-lime-200 space-y-1">
              <strong className="text-lime-900">1. Mashqni tanlang</strong>
              <p className="text-slate-600">Qidiruv yoki mavzular bo'yicha HTML/CSS mashqlarini tanlab "Boshlash" tugmasini bosing.</p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
              <strong className="text-sky-900">2. Mustaqil kod yozing</strong>
              <p className="text-slate-600">VS Code muhiti, sintaksis yoritgich va avtomatik yakunlash yordam beradi. "Tekshirish" (Ctrl+Enter) orqali kodingizni sinang.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <strong className="text-amber-900">3. Ustoz AI dan maslahat oling</strong>
              <p className="text-slate-600">Agar qiynalsangiz, 4 bosqichli maslahat zinapoyasidan foydalaning: Savol → Yo'nalish → Tushuntirish → Qisman yechim.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
              <strong className="text-purple-900">4. Jonli musobaqa</strong>
              <p className="text-slate-600">Ustoz dars davomida 6 xonali kod bersa, "Musobaqaga ulanish" tugmasini bosib xonaga kiring va reytingda yuqoriga chiqing!</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setShowHelpModal(false)} className="glass-btn-primary text-xs py-2 px-4">
              Tushundim
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
