import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Pause,
  Square,
  ExternalLink,
  Send,
  Users,
  AlertTriangle,
  Crown,
  Eye,
  ArrowLeft,
  Copy,
  Check,
  Lightbulb
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { appStore } from "../../lib/store";
import { QRCard, SyncedTimer, BrandLogo, SoundToggle, ThemeToggle, GlassModal } from "../../components/ui/GlassComponents";
import { sounds } from "../../lib/audio";

export const LiveControl: React.FC<{ isProjector?: boolean }> = ({ isProjector = false }) => {
  const { code = "FLX742" } = useParams();
  const roomData = appStore.getRoom(code);

  const [status, setStatus] = useState<"lobby" | "live" | "paused" | "ended">(roomData.status);
  const [startedAt, setStartedAt] = useState<string | null>(roomData.started_at);
  const [nudgeText, setNudgeText] = useState("");
  const [leaderboard, setLeaderboard] = useState(roomData.leaderboard);
  const [conceptCounts, setConceptCounts] = useState<Record<string, number>>(roomData.concept_counts);
  const [viewingStudentCode, setViewingStudentCode] = useState<{ nickname: string; snippet: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Sync with store & Supabase Realtime channel
  useEffect(() => {
    // 1. Local Cross-Tab Sync via AppStore
    const unsub = appStore.subscribe(() => {
      const updated = appStore.getRoom(code);
      setStatus(updated.status);
      setStartedAt(updated.started_at);
      setLeaderboard(updated.leaderboard);
      setConceptCounts(updated.concept_counts);
    });

    // 2. Supabase Realtime Channel
    const channel = supabase.channel(`room:${code}`, {
      config: { presence: { key: isProjector ? "projector" : "teacher" } },
    });

    channel
      .on("broadcast", { event: "state" }, ({ payload }) => {
        setStatus(payload.status);
        setStartedAt(payload.started_at);
        appStore.updateRoom(code, { status: payload.status, started_at: payload.started_at });
      })
      .on("broadcast", { event: "leaderboard" }, ({ payload }) => {
        if (payload.entries) {
          setLeaderboard(payload.entries);
          appStore.updateRoom(code, { leaderboard: payload.entries });
        }
      })
      .on("broadcast", { event: "heatmap" }, ({ payload }) => {
        if (payload.counts) {
          setConceptCounts(payload.counts);
          appStore.updateRoom(code, { concept_counts: payload.counts });
        }
      })
      .subscribe();

    return () => {
      unsub();
      supabase.removeChannel(channel);
    };
  }, [code, isProjector]);

  const broadcastState = async (nextStatus: "lobby" | "live" | "paused" | "ended") => {
    sounds.playClick();
    const nowIso = nextStatus === "live" && !startedAt ? new Date().toISOString() : startedAt;
    setStatus(nextStatus);
    setStartedAt(nowIso);

    appStore.updateRoom(code, { status: nextStatus, started_at: nowIso });

    try {
      await supabase.channel(`room:${code}`).send({
        type: "broadcast",
        event: "state",
        payload: { status: nextStatus, started_at: nowIso, server_ts: Date.now() },
      });
    } catch {}
  };

  const sendNudge = async () => {
    if (!nudgeText.trim()) return;
    sounds.playSuccess();
    const msg = nudgeText.trim().slice(0, 140);
    appStore.updateRoom(code, { latest_nudge: msg });

    try {
      await supabase.channel(`room:${code}`).send({
        type: "broadcast",
        event: "nudge",
        payload: { message: msg },
      });
    } catch {}
    setNudgeText("");
  };

  const handleCopyLink = () => {
    sounds.playClick();
    const url = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const stuckStudents = leaderboard.filter((s) => s.hintLevel >= 3 && !s.passed);
  const passedCount = leaderboard.filter((s) => s.passed).length;

  // ==========================================
  // PROJECTOR SCREEN VIEW (/teach/live/:code/screen)
  // ==========================================
  if (isProjector) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 p-6 md:p-10 flex flex-col justify-between">
        <header className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4 shadow-glass rounded-2xl">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-4">
            <div className="px-5 py-2 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-mono text-xl font-bold flex items-center gap-2 shadow-sm border border-slate-800 dark:border-slate-700">
              <span className="text-slate-400 text-sm">XONA:</span>
              <span className="text-lime-400">{code}</span>
            </div>
            <SyncedTimer durationSec={roomData.duration_sec} startedAt={startedAt} status={status} />
            <ThemeToggle />
          </div>
        </header>

        {/* Live Instruction Banner for Students */}
        <div className="my-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-lime-500/10 via-white to-sky-500/10 dark:from-lime-500/20 dark:via-slate-800 dark:to-sky-500/20 border border-lime-300 dark:border-lime-700/60 text-center shadow-glass-sm">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            📱 Ulanish uchun: Kamerangizni chapdagi QR kodga qarating yoki saytga kirib <strong>{code}</strong> kodini tering
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 my-auto items-center">
          {/* Left 4 Cols: Big QR Card */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <QRCard code={code} />
            <div className="glass-panel p-6 text-center shadow-glass">
              <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 font-semibold">Topshirganlar ko'rsatkichi</p>
              <p className="font-mono text-4xl font-extrabold text-lime-700 dark:text-lime-400 mt-2">
                {passedCount} / {leaderboard.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">talaba muvaffaqiyatli yakunladi</p>
            </div>
          </div>

          {/* Right 8 Cols: Live Podium & Heatmap */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Top 5 Leaderboard */}
            <div className="glass-panel p-8 space-y-5 shadow-glass">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Crown className="w-7 h-7 text-amber-500" />
                  <span>Jonli Reyting (Top 5)</span>
                </h2>
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Real-vaqt sinxron
                </span>
              </div>

              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.user_id}
                    className={`glass-card p-4 flex items-center justify-between transition-all ${
                      idx === 0
                        ? "border-amber-300 dark:border-amber-600/50 bg-amber-50/40 dark:bg-amber-950/30 shadow-sm"
                        : idx === 1
                        ? "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                        : idx === 2
                        ? "border-orange-200 dark:border-orange-700/50 bg-orange-50/30 dark:bg-orange-950/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-2xl font-black ${
                          idx === 0
                            ? "text-amber-500"
                            : idx === 1
                            ? "text-slate-400"
                            : idx === 2
                            ? "text-orange-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{item.nickname}</span>
                        {item.passed && (
                          <span className="ml-3 text-xs px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/80 text-lime-800 dark:text-lime-300 font-bold border border-lime-300 dark:border-lime-700">
                            Bajardi ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">{item.score} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Concept Heatmap */}
            <div className="glass-panel p-6 space-y-4 shadow-glass">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Konsept xaritasi (Talabalar qiynalgan mavzular)</h3>
              <div className="space-y-3">
                {Object.entries(conceptCounts).map(([concept, count]) => (
                  <div key={concept} className="space-y-1">
                    <div className="flex justify-between text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                      <span>#{concept}</span>
                      <span>{count} ta talaba</span>
                    </div>
                    <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-lime-500 to-[#65A30D] rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, count * 8)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TEACHER LIVE CONTROL VIEW (/teach/live/:code)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 px-4 sm:px-8 lg:px-12 py-6 w-full space-y-8">
      {/* Top Header */}
      <header className="glass-panel p-5 flex flex-wrap items-center justify-between gap-4 shadow-glass-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <Link
            to="/teach"
            onClick={() => sounds.playClick()}
            title="Ustoz kabinetiga qaytish"
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <BrandLogo size="md" />

          {/* Room Code Badge with Copy Button */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{code}</span>
            <button
              onClick={handleCopyLink}
              title="Talabalarga yuborish uchun havolani nusxalash"
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded transition-all"
            >
              {copiedLink ? <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" /> : <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
            </button>
          </div>

          {/* Status Badge */}
          <span
            className={`text-sm uppercase font-bold px-4 py-1.5 rounded-full ${
              status === "live"
                ? "bg-lime-100 text-lime-800 dark:bg-lime-950/80 dark:text-lime-300 animate-pulse border border-lime-300 dark:border-lime-700"
                : status === "paused"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                : status === "ended"
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-700"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
            }`}
          >
            {status === "live" ? "● Jonli musobaqa" : status === "paused" ? "⏸ Pauza" : status === "ended" ? "🏁 Yakunlandi" : "⏳ Kutilmoqda"}
          </span>

          <SyncedTimer durationSec={roomData.duration_sec} startedAt={startedAt} status={status} />
        </div>

        {/* Action Buttons with clear explanation labels */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <SoundToggle />

          {/* Start Button */}
          <button
            onClick={() => broadcastState("live")}
            disabled={status === "live"}
            title="Musobaqaga start berish. Barcha talabalarda taymer ishga tushadi."
            className="duo-btn-green text-xs sm:text-sm py-2 px-4 font-black shadow-sm flex items-center gap-2 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Boshlash</span>
          </button>

          {/* Pause Button */}
          <button
            onClick={() => broadcastState("paused")}
            disabled={status === "paused" || status === "lobby"}
            title="Darsni vaqtinchalik to'xtatish (tushuntirish berish uchun)"
            className="duo-btn-white text-xs sm:text-sm py-2 px-3.5 font-extrabold flex items-center gap-2 disabled:opacity-40"
          >
            <Pause className="w-4 h-4" />
            <span>Pauza</span>
          </button>

          {/* End Button */}
          <button
            onClick={() => broadcastState("ended")}
            disabled={status === "ended"}
            title="Musobaqani to'xtatish va natijalarni e'lon qilish"
            className="duo-btn-red text-xs sm:text-sm py-2 px-3.5 font-extrabold flex items-center gap-2 disabled:opacity-40"
          >
            <Square className="w-4 h-4" />
            <span>Tugatish</span>
          </button>

          {/* Projector Screen Button */}
          <Link
            className="duo-btn-blue text-xs sm:text-sm py-2 px-4 font-black shadow-sm flex items-center gap-2"
            target="_blank"
            to={`/teach/live/${code}/screen`}
            title="Doskadagi katta ekranga uzatish (QR kod + Jonli reyting)"
          >
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            <span>Proyektor ekrani</span>
          </Link>
        </div>
      </header>

      {/* Teacher Guide Card */}
      {showGuide && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-lime-50 via-white to-sky-50 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-800/80 border border-lime-200/90 dark:border-slate-700 shadow-glass-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-lime-700 dark:text-lime-400" />
              <span>Ustoz uchun yo'riqnoma: Musobaqa qanday o'tkaziladi?</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>1.</strong> "Proyektor ekrani"ni doskaga oching (talabalar QR kod bilan ulanadi) →{" "}
              <strong>2.</strong> "Boshlash" tugmasini bosing (taymer yuradi) →{" "}
              <strong>3.</strong> Chap tomonda 3-darajaga tushgan o'quvchilar kodi ustiga bosing va "Nudge" yuboring.
            </p>
          </div>
          <button
            onClick={() => setShowGuide(false)}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 hover:bg-white dark:hover:bg-slate-700 transition-all"
          >
            Yopish ✕
          </button>
        </div>
      )}

      {/* 3 Columns Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Stuck Students Alert */}
        <div className="glass-panel p-6 space-y-5 shadow-glass">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 font-bold text-base">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Hozir qiynalayotganlar</span>
            </span>
            <span className="font-mono text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-full">{stuckStudents.length} ta</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {stuckStudents.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Hozircha hech bir o'quvchi 3-darajali maslahatga tushmadi. Barchasi yaxshi davom etmoqda!
              </div>
            ) : (
              stuckStudents.map((s) => (
                <div key={s.user_id} className="glass-card p-3.5 flex items-center justify-between border-l-4 border-l-rose-500">
                  <div>
                    <p className="font-bold text-base text-slate-900 dark:text-white">{s.nickname}</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Maslahat darajasi: L{s.hintLevel}</p>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setViewingStudentCode({
                        nickname: s.nickname,
                        snippet: s.code_snippet || "/* Kod yuklanmoqda... */",
                      });
                    }}
                    className="glass-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-medium rounded-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Kodni ko'rish</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Teacher Broadcast Nudge */}
          <div className="pt-4 border-t border-slate-200/70 dark:border-slate-800 space-y-2.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">O'quvchilarga tezkor ko'rsatma (Nudge)</label>
            <div className="flex gap-2">
              <input
                value={nudgeText}
                onChange={(e) => setNudgeText(e.target.value)}
                placeholder="Masalan: .container balandligiga e'tibor bering!"
                className="glass-input text-sm py-2.5"
              />
              <button onClick={sendNudge} className="glass-btn-primary px-4 py-2.5 rounded-xl">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Live Heatmap */}
        <div className="glass-panel p-6 space-y-5 shadow-glass">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Konsept xaritasi (Heatmap)</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">O'quvchilar Ustoz AI dan eng ko'p so'ragan mavzular:</p>
          <div className="space-y-3.5">
            {Object.entries(conceptCounts).map(([concept, count]) => (
              <div key={concept} className="space-y-1.5">
                <div className="flex justify-between text-sm font-mono text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">#{concept}</span>
                  <span>{count} marta</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 dark:bg-lime-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, count * 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Live Participants Leaderboard */}
        <div className="glass-panel p-6 space-y-5 shadow-glass">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <span>Qatnashuvchilar ({leaderboard.length})</span>
            </h3>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <div className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
                Hozircha xonaga hech kim ulanmagan. Proyektordagi QR kod orqali talabalar ulanadi.
              </div>
            ) : (
              leaderboard.map((p, idx) => (
                <div key={p.user_id} className="glass-card p-3.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</span>
                    <span className="font-bold text-base text-slate-900 dark:text-white">{p.nickname}</span>
                    {p.passed && <span className="text-xs text-lime-700 dark:text-lime-300 font-bold bg-lime-100 dark:bg-lime-950/80 border border-lime-300 dark:border-lime-700 px-2 py-0.5 rounded-full">✓</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">L{p.hintLevel}</span>
                    <span className="font-mono font-bold text-base text-slate-900 dark:text-white">{p.score} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Code Inspector Modal */}
      <GlassModal
        open={Boolean(viewingStudentCode)}
        onClose={() => setViewingStudentCode(null)}
        title={`${viewingStudentCode?.nickname || "O'quvchi"}ning joriy kodi`}
      >
        <div className="space-y-5">
          <div className="p-4 bg-slate-900 dark:bg-black/80 text-slate-100 font-mono text-sm rounded-xl overflow-x-auto whitespace-pre-wrap max-h-72 leading-relaxed border border-slate-800">
            {viewingStudentCode?.snippet}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setViewingStudentCode(null)} className="glass-btn-secondary text-sm py-2 px-4 rounded-xl">
              Yopish
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
