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
  Check
} from "lucide-react";
import { appStore } from "../../lib/store";
import { COURSE_CHALLENGES, ChallengeItem } from "../../lib/challenges-data";
import { BrandLogo, SoundToggle, GlassModal } from "../../components/ui/GlassComponents";
import { sounds } from "../../lib/audio";
import { UZ } from "../../lib/i18n/uz";
import { supabase } from "../../lib/supabase";

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAiModal, setShowAiModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navbar */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between shadow-glass-sm rounded-2xl">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono">
            Ustoz Kabineti
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SoundToggle />
          <button
            onClick={() => {
              sounds.playClick();
              setShowCreateRoomModal(true);
            }}
            className="glass-btn-brand text-xs py-2 px-3.5 font-semibold"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Jonli xona boshlash</span>
          </button>
          <Link
            onClick={() => sounds.playClick()}
            to="/app"
            className="glass-btn-secondary text-xs py-2 px-3"
          >
            Talaba ekrani
          </Link>
        </div>
      </header>

      {/* Quick Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 shadow-glass-sm">
          <p className="text-xs text-slate-500 font-medium">Jami o'quvchilar</p>
          <p className="font-mono text-3xl font-bold text-slate-900 mt-1">38 nafar</p>
        </div>
        <div className="glass-panel p-5 shadow-glass-sm">
          <p className="text-xs text-slate-500 font-medium">Bugun topshirganlar</p>
          <p className="font-mono text-3xl font-bold text-lime-700 mt-1">29 ta</p>
        </div>
        <div className="glass-panel p-5 shadow-glass-sm">
          <p className="text-xs text-slate-500 font-medium">O'rtacha maslahat darajasi</p>
          <p className="font-mono text-3xl font-bold text-slate-900 mt-1">L 1.6</p>
          <p className="text-[11px] text-slate-400 mt-0.5">O'quvchilar mustaqil yozmoqda</p>
        </div>
        <div className="glass-panel p-5 shadow-glass-sm bg-gradient-to-br from-white to-lime-50/40">
          <p className="text-xs text-slate-500 font-medium">Ustoz AI xavfsizligi</p>
          <p className="text-xs font-bold text-lime-800 mt-1">Leak-Guard Faol</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Tayyor yechim yashirilgan</p>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Challenge Builder Card (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-5 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-600" />
                <span>Ustoz AI bilan Yangi Challenge yaratish</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Gemini AI o'quv markazingiz talabalari uchun kod, yechim, 4 bosqichli maslahat va avtomatik testlarni shakllantiradi.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setShowAiModal(true);
              }}
              className="glass-btn-primary text-xs py-2 px-3.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yaratish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 space-y-2 border-l-4 border-l-sky-500">
              <span className="text-xs font-semibold text-sky-800">1-daraja: Boshlang'ich</span>
              <h4 className="font-bold text-sm text-slate-900">HTML teglari va matnlar</h4>
              <p className="text-xs text-slate-500">Semantik HTML, sarlavhalar, paragraflar, rasmlar va havolalar.</p>
            </div>
            <div className="glass-card p-4 space-y-2 border-l-4 border-l-amber-500">
              <span className="text-xs font-semibold text-amber-800">2-daraja: O'rta</span>
              <h4 className="font-bold text-sm text-slate-900">Flexbox & Grid tartiblash</h4>
              <p className="text-xs text-slate-500">Markazlash, kartalar galereyasi va navigatsiya panellari.</p>
            </div>
          </div>

          {/* Quick Start Live Room Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-lime-400" />
                <span>Jonli Dars Xonasi (Live Room)</span>
              </h3>
              <p className="text-xs text-slate-300">
                O'quvchilar doskadagi QR kod orqali ulanadi. Proyektorda reyting va Heatmap ko'rinadi.
              </p>
            </div>
            <Link
              onClick={() => sounds.playClick()}
              to="/teach/live/FLX742"
              className="glass-btn-brand text-xs font-semibold py-2 px-4 shrink-0"
            >
              FLX742 xonani ochish →
            </Link>
          </div>
        </div>

        {/* Right Column: Class Management (1 Col) */}
        <div className="glass-panel p-6 space-y-4 shadow-glass">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <span>Guruhlarim ({classesList.length})</span>
            </h3>
            <button
              onClick={() => {
                sounds.playClick();
                setShowCreateClassModal(true);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Yangi
            </button>
          </div>

          <div className="space-y-3">
            {classesList.map((cls) => (
              <div key={cls.id} className="glass-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{cls.name}</h4>
                  <span className="font-mono text-xs font-bold text-lime-800 bg-lime-100 px-2 py-0.5 rounded">
                    {cls.joinCode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{cls.studentsCount} nafar talaba</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/join/${cls.joinCode}`);
                      sounds.playClick();
                      alert(`Havola nusxalandi: /join/${cls.joinCode}`);
                    }}
                    className="text-slate-600 hover:text-slate-900 underline"
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
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">Mavzu yoki Konsept</label>
              <input
                required
                placeholder="Masalan: Flexbox bilan ikki tomonlama navbar"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="glass-input text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Qiyinlik darajasi</label>
              <div className="flex gap-2 mt-1">
                {([1, 2, 3] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setAiLevel(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                      aiLevel === lvl
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {lvl}-daraja
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Qo'shimcha talablar (ixtiyoriy)</label>
              <textarea
                rows={2}
                placeholder="Masalan: .container balandligi 60px bo'lsin..."
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                className="glass-input text-xs mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAiModal(false)} className="glass-btn-secondary text-xs">
                Bekor qilish
              </button>
              <button
                disabled={drafting || !aiTopic.trim()}
                onClick={handleGenerateAi}
                className="glass-btn-brand text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{drafting ? "AI yaratmoqda..." : "Yaratish"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-lime-50 rounded-xl border border-lime-200 space-y-1">
              <h4 className="font-bold text-sm text-slate-900">{draftResult.title}</h4>
              <p className="text-xs text-slate-600">{draftResult.description_md}</p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Testlar soni: {draftResult.tests.length} ta</p>
              <p>• Boshlang'ich kod va yechim tayyorlandi</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDraftResult(null)} className="glass-btn-secondary text-xs">
                Qayta generatsiya
              </button>
              <button onClick={handleSaveChallenge} className="glass-btn-brand text-xs font-semibold">
                Katalogga saqlash
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Create Live Room Modal */}
      <GlassModal open={showCreateRoomModal} onClose={() => setShowCreateRoomModal(false)} title="Yangi Jonli Xona Boshlash">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Topshiriqni tanlang</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="glass-input text-xs mt-1"
            >
              {COURSE_CHALLENGES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level}-daraja)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Dars vaqti (taymer)</label>
            <select
              value={roomDuration}
              onChange={(e) => setRoomDuration(Number(e.target.value))}
              className="glass-input text-xs mt-1"
            >
              <option value={300}>5 daqiqa (Tezkor mashq)</option>
              <option value={600}>10 daqiqa</option>
              <option value={900}>15 daqiqa (Standart)</option>
              <option value={1800}>30 daqiqa</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateRoomModal(false)}
              className="glass-btn-secondary text-xs"
            >
              Bekor qilish
            </button>
            <button type="submit" className="glass-btn-brand text-xs font-semibold">
              Xonani ochish →
            </button>
          </div>
        </form>
      </GlassModal>

      {/* Create Class Modal */}
      <GlassModal open={showCreateClassModal} onClose={() => setShowCreateClassModal(false)} title="Yangi Sinf Yaratish">
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Sinf / Guruh nomi</label>
            <input
              required
              placeholder="Masalan: Frontend 15-guruh"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="glass-input text-xs mt-1"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateClassModal(false)}
              className="glass-btn-secondary text-xs"
            >
              Bekor qilish
            </button>
            <button type="submit" className="glass-btn-primary text-xs font-semibold">
              Sinfni saqlash
            </button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
