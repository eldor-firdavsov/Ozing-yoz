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
  Code2
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navbar */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between shadow-glass-sm rounded-2xl">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-700">
            <span>Talaba:</span>
            <strong className="text-slate-900">{profile.full_name}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <button
            onClick={() => {
              sounds.playClick();
              setShowJoinModal(true);
            }}
            className="glass-btn-secondary text-xs py-2 px-3 font-medium"
          >
            <Users className="w-3.5 h-3.5 text-lime-700" />
            <span>Sinfga qo'shilish</span>
          </button>
          <Link
            onClick={() => sounds.playClick()}
            to="/teach"
            className="glass-btn-primary text-xs py-2 px-3.5"
          >
            Ustoz paneli
          </Link>
        </div>
      </header>

      {/* Hero Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* XP Card */}
        <div className="glass-panel p-5 flex items-center gap-4 shadow-glass-sm">
          <div className="w-12 h-12 rounded-2xl bg-lime-100 border border-lime-300 flex items-center justify-center text-lime-700">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">To'plangan tajriba</p>
            <p className="font-mono text-2xl font-bold text-slate-900 mt-0.5">{profile.xp} XP</p>
          </div>
        </div>

        {/* Completed Challenges */}
        <div className="glass-panel p-5 flex items-center gap-4 shadow-glass-sm">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Bajarilgan mashqlar</p>
            <p className="font-mono text-2xl font-bold text-slate-900 mt-0.5">
              {completedCount} / {challenges.length} ta
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="glass-panel p-5 flex items-center gap-4 shadow-glass-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Faollik ketma-ketligi</p>
            <p className="font-mono text-2xl font-bold text-amber-700 mt-0.5">{profile.streak} kun</p>
          </div>
        </div>

        {/* Ustoz AI Ladder Status */}
        <div className="glass-panel p-5 flex items-center gap-4 shadow-glass-sm bg-gradient-to-br from-white/90 to-lime-50/50">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-lime-400 flex items-center justify-center shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Ustoz AI Yordamchisi</p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">4 bosqichli maslahat faol</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 space-y-3 shadow-glass-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mashq nomi yoki mavzu bo'yicha qidiruv..."
              className="glass-input pl-10 text-xs py-2.5"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Daraja:
            </span>
            {(["all", 1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playClick();
                  setSelectedLevel(lvl);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedLevel === lvl
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white/80 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {lvl === "all" ? "Barchasi" : `${lvl}-daraja`}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 select-none">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sounds.playClick();
                setSelectedTopic(t.id);
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedTopic === t.id
                  ? "bg-[#84CC16] text-slate-950 font-semibold shadow-xs"
                  : "bg-white/70 border border-slate-200/80 text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.map((c) => {
          const isDone = appStore.isChallengeCompleted(c.id);
          return (
            <div
              key={c.id}
              className={`glass-card p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-glass ${
                isDone ? "border-lime-200 bg-lime-50/20" : ""
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
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
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-lime-700 bg-lime-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Bajarildi</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-400">+100 XP</span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{c.title}</h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.description_md.replace(/[`*]/g, "")}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-600 border border-slate-200/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  {c.tests.length} ta tekshiruv
                </span>
                <Link
                  onClick={() => sounds.playClick()}
                  to={`/app/challenge/${c.id}`}
                  className={`text-xs py-1.5 px-4 rounded-lg font-semibold inline-flex items-center gap-1.5 transition-all ${
                    isDone
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-[#84CC16] text-slate-950 hover:bg-[#65A30D] hover:text-white shadow-xs"
                  }`}
                >
                  <span>{isDone ? "Qayta ko'rish" : "Boshlash"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
    </div>
  );
};
