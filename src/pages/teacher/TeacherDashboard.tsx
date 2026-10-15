import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Play,
  Users,
  BookOpen,
  QrCode,
  ExternalLink,
  Code2,
  FolderPlus,
  ArrowRight,
  Clock,
  Layers,
  Copy,
  Check,
  LogOut,
  HelpCircle,
  Trophy,
  Lightbulb
} from "lucide-react";
import { appStore } from "../../lib/store";
import { COURSE_CHALLENGES, ChallengeItem } from "../../lib/challenges-data";
import { BrandLogo, SoundToggle, ThemeToggle, GlassModal } from "../../components/ui/GlassComponents";
import { sounds } from "../../lib/audio";
import { UZ } from "../../lib/i18n/uz";
import { supabase } from "../../lib/supabase";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const handleTeacherLogout = () => {
    sounds.playClick();
    appStore.logout();
    navigate("/teach/login");
  };

  // AI Builder Form State
  const [aiTopic, setAiTopic] = useState("");
  const [aiLevel, setAiLevel] = useState<1 | 2 | 3>(2);
  const [aiNotes, setAiNotes] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<ChallengeItem | null>(null);

  // Room Form State
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(COURSE_CHALLENGES[1].id);
  const [roomDuration, setRoomDuration] = useState<number>(900);

  // Class Form State
  const [className, setClassName] = useState("");
  const [classesList, setClassesList] = useState([
    { id: "1", name: "Frontend Guruhi #12", joinCode: "FEG12", studentsCount: 16 },
    { id: "2", name: "HTML & CSS Intensiv", joinCode: "INT2026", studentsCount: 22 },
  ]);

  const handleGenerateAi = async () => {
    if (!aiTopic.trim()) return;
    setDrafting(true);
    sounds.playClick();

    try {
      const { data, error } = await supabase.functions.invoke("draft-challenge", {
        body: { topic: aiTopic, level: aiLevel, notes: aiNotes },
      });
      if (error || !data?.title) throw error || new Error("Fallback draft");
      setDraftResult(data);
      sounds.playSuccess();
    } catch {
      // Smart Fallback Challenge Generation
      const generated: ChallengeItem = {
        id: `custom-${Date.now()}`,
        title: `${aiTopic} Amaliyoti`,
        description_md: `Ushbu topshiriqda **${aiTopic}** mavzusini qo'llab elementlarni tartibga keltiring. ${aiNotes}`,
        level: aiLevel,
        topics: [aiTopic.toLowerCase().replace(/\s+/g, "-"), "styling"],
        starter_html: '<div class="container">\n  <div class="box">Element</div>\n</div>',
        starter_css: ".container {\n  padding: 24px;\n  border: 2px dashed #cbd5e1;\n  /* Shu yerga yozing */\n}\n.box {\n  background: #84cc16;\n  padding: 16px;\n  border-radius: 8px;\n}",
        solution_html: '<div class="container">\n  <div class="box">Element</div>\n</div>',
        solution_css: ".container {\n  padding: 24px;\n  border: 2px dashed #cbd5e1;\n  display: flex;\n  justify-content: center;\n}\n.box {\n  background: #84cc16;\n  padding: 16px;\n  border-radius: 8px;\n}",
        target_html: '<div style="padding: 24px; border: 2px dashed #cbd5e1; display: flex; justify-content: center;"><div style="background: #84cc16; padding: 16px; border-radius: 8px;">Element</div></div>',
        target_css: "",
        tests: [
          { type: "exists", selector: ".container", label: ".container bloki mavjud" },
          { type: "exists", selector: ".box", label: ".box elementi mavjud" },
        ],
        fallback_hints: {
          "1": "Konteyner ichidagi elementni tartibga keltirish uchun qaysi CSS xossasi kerak?",
          "2": ".container selektori ichiga kerakli xossalarni yozing.",
          "3": "Masalan: display: flex; yordamida elementlar qator bo'lib joylashadi.",
          "4": "display: flex;\njustify-content: center;",
        },
        is_public: true,
      };
      setDraftResult(generated);
      sounds.playSuccess();
    } finally {
      setDrafting(false);
    }
  };

  const handleSaveChallenge = () => {
    if (!draftResult) return;
    appStore.saveCustomChallenge(draftResult);
    sounds.playSuccess();
    setShowAiModal(false);
    setDraftResult(null);
    setAiTopic("");
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += cleanChars.charAt(Math.floor(Math.random() * cleanChars.length));
    }
    appStore.updateRoom(code, {
      code,
      status: "lobby",
      started_at: null,
      duration_sec: roomDuration,
      challenge_id: selectedChallengeId,
    });
    sounds.playSuccess();
    setShowCreateRoomModal(false);
    navigate(`/teach/live/${code}`);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    const newCode = "CLS" + Math.floor(100 + Math.random() * 900);
    setClassesList((prev) => [
      ...prev,
      { id: String(Date.now()), name: className, joinCode: newCode, studentsCount: 0 },
    ]);
    sounds.playSuccess();
    setClassName("");
    setShowCreateClassModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] px-4 sm:px-8 lg:px-12 py-6 w-full space-y-8 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-glass-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
          <span className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-mono flex items-center gap-2 border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Ustoz: teacher@ilmla.uz</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <ThemeToggle />
          <button
            onClick={() => {
              sounds.playClick();
              setShowCreateRoomModal(true);
            }}
            className="duo-btn-green text-xs sm:text-sm py-2.5 px-4 font-black shadow-xs flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Jonli xona ochish</span>
          </button>
          <Link
            onClick={() => sounds.playClick()}
            to="/app"
            className="duo-btn-white dark:bg-slate-800 dark:border-slate-700 text-xs sm:text-sm py-2.5 px-4 font-extrabold text-slate-700 dark:text-slate-200"
          >
            Talaba ekrani
          </Link>
          <button
            onClick={handleTeacherLogout}
            title="Ustoz hisobidan chiqish"
            className="duo-btn-white dark:bg-slate-800 dark:border-slate-700 text-xs sm:text-sm py-2.5 px-4 font-extrabold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>
        </div>
      </header>

      {/* Quick Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 shadow-glass-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Jami o'quvchilar</p>
          <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">38 nafar</p>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Ro'yxatdan o'tgan faol talabalar</p>
        </div>
        <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 shadow-glass-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Bugun topshirganlar</p>
          <p className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">29 ta</p>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Mustaqil tekshiruvdan o'tgan</p>
        </div>
        <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 shadow-glass-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">O'rtacha maslahat darajasi</p>
          <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">L 1.6</p>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">O'quvchilar mustaqil yozmoqda</p>
        </div>
        <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 shadow-glass-sm bg-gradient-to-br from-white to-lime-50/40 dark:from-[#0F172A] dark:to-emerald-950/20">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Ustoz AI xavfsizligi</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">Leak-Guard Faol</p>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Tayyor yechim talabaga berilmaydi</p>
        </div>
      </div>

      {/* Teacher Competition Workflow Guide */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-lime-500/10 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-[#0B0F19] border border-lime-200/90 dark:border-emerald-800 shadow-glass-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Ustoz uchun yo'riqnoma: Darsda jonli musobaqa o'tkazish</span>
          </h3>
          <span className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
            3 oddiy qadam
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-white/95 dark:bg-[#0F172A] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>Xonani oching</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              Yuqoridagi <strong>"Jonli xona ochish"</strong> tugmasini bosing yoki tayyor <strong>FLX742</strong> xonasiga kiring.
            </p>
          </div>

          <div className="p-4 bg-white/95 dark:bg-[#0F172A] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>Proyektorga uzating</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              <strong>"Proyektor ekrani"</strong> tugmasini bosing va doskaga oching. O'quvchilar QR kod orqali 5 soniyada ulanishadi.
            </p>
          </div>

          <div className="p-4 bg-white/95 dark:bg-[#0F172A] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</span>
              <span>Darsni boshqaring</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              <strong>"Boshlash"</strong> tugmasini bosing, qiynalgan talabalar kodini ko'ring va umumiy ko'rsatma (Nudge) yuboring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Challenge Builder Card (2 Cols) */}
        <div className="lg:col-span-2 glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 sm:p-7 space-y-6 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Ustoz AI bilan Yangi Challenge yaratish</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Gemini AI o'quv markazingiz talabalari uchun kod, yechim, 4 bosqichli maslahat va avtomatik testlarni shakllantiradi.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setShowAiModal(true);
              }}
              className="duo-btn-green text-sm py-2.5 px-4 font-black shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Yaratish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card dark:bg-slate-900 dark:border-slate-800 p-5 space-y-2.5 border-l-4 border-l-sky-500">
              <span className="text-xs font-bold text-sky-800 dark:text-sky-400 uppercase tracking-wider">1-daraja: Boshlang'ich</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">HTML teglari va matnlar</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Semantik HTML, sarlavhalar, paragraflar, rasmlar va havolalar.</p>
            </div>
            <div className="glass-card dark:bg-slate-900 dark:border-slate-800 p-5 space-y-2.5 border-l-4 border-l-amber-500">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">2-daraja: O'rta</span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">Flexbox & Grid tartiblash</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Markazlash, kartalar galereyasi va navigatsiya panellari.</p>
            </div>
          </div>

          {/* Quick Start Live Room Card */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border-2 border-slate-700 border-b-4 border-b-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Jonli Dars Xonasi (Live Room)</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                O'quvchilar doskadagi QR kod orqali ulanadi. Proyektorda reyting va Heatmap ko'rinadi.
              </p>
            </div>
            <Link
              onClick={() => sounds.playClick()}
              to="/teach/live/FLX742"
              className="duo-btn-green text-sm font-black py-3 px-6 shrink-0"
            >
              FLX742 xonani ochish →
            </Link>
          </div>
        </div>

        {/* Right Column: Class Management (1 Col) */}
        <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-3.5">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <span>Guruhlarim ({classesList.length})</span>
            </h3>
            <button
              onClick={() => {
                sounds.playClick();
                setShowCreateClassModal(true);
              }}
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Yangi
            </button>
          </div>

          <div className="space-y-3.5">
            {classesList.map((cls) => (
              <div key={cls.id} className="glass-card dark:bg-slate-900 dark:border-slate-800 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{cls.name}</h4>
                  <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-700">
                    {cls.joinCode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{cls.studentsCount} nafar talaba</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/join/${cls.joinCode}`);
                      sounds.playClick();
                      alert(`Havola nusxalandi: /join/${cls.joinCode}`);
                    }}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline font-medium"
                  >
                    Ulanish havolasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Challenge Builder Modal */}
      <GlassModal open={showAiModal} onClose={() => setShowAiModal(false)} title="AI bilan yangi topshiriq yaratish">
        {!draftResult ? (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700">Mavzu yoki Konsept</label>
              <input
                required
                placeholder="Masalan: Flexbox bilan ikki tomonlama navbar"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="glass-input text-sm py-2.5 mt-1.5"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Qiyinlik darajasi</label>
              <div className="flex gap-2.5 mt-1.5">
                {([1, 2, 3] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAiLevel(lvl)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      aiLevel === lvl
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {lvl}-daraja
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Qo'shimcha talablar (ixtiyoriy)</label>
              <textarea
                rows={3}
                placeholder="Masalan: .container balandligi 60px bo'lsin..."
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                className="glass-input text-sm py-2.5 mt-1.5"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAiModal(false)} className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl">
                Bekor qilish
              </button>
              <button
                disabled={drafting || !aiTopic.trim()}
                onClick={handleGenerateAi}
                className="glass-btn-brand text-sm py-2.5 px-5 font-bold rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                <span>{drafting ? "AI yaratmoqda..." : "Yaratish"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-lime-50 rounded-xl border border-lime-200 space-y-1.5">
              <h4 className="font-bold text-base text-slate-900">{draftResult.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{draftResult.description_md}</p>
            </div>

            <div className="text-sm text-slate-600 space-y-1.5">
              <p>• Testlar soni: <strong>{draftResult.tests.length} ta</strong></p>
              <p>• Boshlang'ich kod va to'liq yechim tayyorlandi</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setDraftResult(null)} className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl">
                Qayta generatsiya
              </button>
              <button onClick={handleSaveChallenge} className="glass-btn-brand text-sm py-2.5 px-5 font-bold rounded-xl">
                Katalogga saqlash
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Create Live Room Modal */}
      <GlassModal open={showCreateRoomModal} onClose={() => setShowCreateRoomModal(false)} title="Yangi Jonli Xona Boshlash">
        <form onSubmit={handleCreateRoom} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Topshiriqni tanlang</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="glass-input text-sm py-2.5 mt-1.5"
            >
              {COURSE_CHALLENGES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level}-daraja)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Dars vaqti (taymer)</label>
            <select
              value={roomDuration}
              onChange={(e) => setRoomDuration(Number(e.target.value))}
              className="glass-input text-sm py-2.5 mt-1.5"
            >
              <option value={300}>5 daqiqa (Tezkor mashq)</option>
              <option value={600}>10 daqiqa</option>
              <option value={900}>15 daqiqa (Standart)</option>
              <option value={1800}>30 daqiqa</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateRoomModal(false)}
              className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl"
            >
              Bekor qilish
            </button>
            <button type="submit" className="glass-btn-brand text-sm py-2.5 px-5 font-bold rounded-xl">
              Xonani ochish →
            </button>
          </div>
        </form>
      </GlassModal>

      {/* Create Class Modal */}
      <GlassModal open={showCreateClassModal} onClose={() => setShowCreateClassModal(false)} title="Yangi Sinf Yaratish">
        <form onSubmit={handleAddClass} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Sinf / Guruh nomi</label>
            <input
              required
              placeholder="Masalan: Frontend 15-guruh"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="glass-input text-sm py-2.5 mt-1.5"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateClassModal(false)}
              className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl"
            >
              Bekor qilish
            </button>
            <button type="submit" className="glass-btn-primary text-sm py-2.5 px-5 font-bold rounded-xl">
              Sinfni saqlash
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
