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
  Award,
  Crown,
  Eye,
  ArrowLeft
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { appStore, LiveRoomState } from "../../lib/store";
import { QRCard, SyncedTimer, BrandLogo, SoundToggle, GlassModal } from "../../components/ui/GlassComponents";
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
    } catch (_) {}
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
    } catch (_) {}
    setNudgeText("");
  };

  const stuckStudents = leaderboard.filter((s) => s.hintLevel >= 3 && !s.passed);
  const passedCount = leaderboard.filter((s) => s.passed).length;

  // ==========================================
  // PROJECTOR SCREEN VIEW (/teach/live/:code/screen)
  // ==========================================
  if (isProjector) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12 flex flex-col justify-between">
        <header className="glass-panel p-6 flex items-center justify-between shadow-glass rounded-2xl">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-6">
            <span className="font-mono text-3xl font-extrabold px-6 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-slate-900">
              KOD: {code}
            </span>
            <SyncedTimer durationSec={roomData.duration_sec} startedAt={startedAt} status={status} />
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 my-auto items-center">
          {/* Left 4 Cols: Big QR Card */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <QRCard code={code} />
            <div className="glass-panel p-6 text-center shadow-glass">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Topshirganlar ko'rsatkichi</p>
              <p className="font-mono text-4xl font-extrabold text-lime-700 mt-2">
                {passedCount} / {leaderboard.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">talaba muvaffaqiyatli yakunladi</p>
            </div>
          </div>

          {/* Right 8 Cols: Live Podium & Heatmap */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Top 5 Leaderboard */}
            <div className="glass-panel p-8 space-y-5 shadow-glass">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Crown className="w-7 h-7 text-amber-500" />
                  <span>Jonli Reyting (Top 5)</span>
                </h2>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Real-vaqt sinxron
                </span>
              </div>

              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.user_id}
                    className={`glass-card p-4 flex items-center justify-between transition-all ${
                      idx === 0
                        ? "border-amber-300 bg-amber-50/40 shadow-sm"
                        : idx === 1
                        ? "border-slate-300 bg-slate-50/50"
                        : idx === 2
                        ? "border-orange-200 bg-orange-50/30"
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
                            : "text-slate-300"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="text-xl font-bold text-slate-900">{item.nickname}</span>
                        {item.passed && (
                          <span className="ml-3 text-xs px-2.5 py-0.5 rounded-full bg-lime-100 text-lime-800 font-bold">
                            Bajardi ✓
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-slate-900">{item.score} XP</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Concept Heatmap */}
            <div className="glass-panel p-6 space-y-4 shadow-glass">
              <h3 className="text-base font-bold text-slate-900">Konsept xaritasi (Talabalar qiynalgan mavzular)</h3>
              <div className="space-y-3">
                {Object.entries(conceptCounts).map(([concept, count]) => (
                  <div key={concept} className="space-y-1">
                    <div className="flex justify-between text-sm font-mono font-medium text-slate-700">
                      <span>#{concept}</span>
                      <span>{count} ta talaba</span>
                    </div>
                    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <header className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 shadow-glass-sm rounded-2xl">
        <div className="flex items-center gap-4">
          <Link
            to="/teach"
            onClick={() => sounds.playClick()}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <BrandLogo size="md" />
          <span className="font-mono text-lg font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-900">{code}</span>
          <span
            className={`text-xs uppercase font-bold px-3 py-1 rounded-full ${
              status === "live"
                ? "bg-lime-100 text-lime-800 animate-pulse"
                : status === "paused"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {status}
          </span>
          <SyncedTimer durationSec={roomData.duration_sec} startedAt={startedAt} status={status} />
        </div>

        <div className="flex items-center gap-2">
          <SoundToggle />
          <button
            onClick={() => broadcastState("live")}
            disabled={status === "live"}
            className="glass-btn-brand text-xs py-2 px-3 font-semibold"
          >
            <Play className="w-3.5 h-3.5" /> Boshlash
          </button>
          <button
            onClick={() => broadcastState("paused")}
            disabled={status === "paused" || status === "lobby"}
            className="glass-btn-secondary text-xs py-2 px-3"
          >
            <Pause className="w-3.5 h-3.5" /> Pauza
          </button>
          <button
            onClick={() => broadcastState("ended")}
            disabled={status === "ended"}
            className="glass-btn-secondary text-xs py-2 px-3 text-rose-600 hover:bg-rose-50"
          >
            <Square className="w-3.5 h-3.5" /> Tugatish
          </button>
          <Link
            className="glass-btn-primary text-xs py-2 px-3.5"
            target="_blank"
            to={`/teach/live/${code}/screen`}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Proyektor ekrani
          </Link>
        </div>
      </header>

      {/* 3 Columns Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Stuck Students Alert */}
        <div className="glass-panel p-5 space-y-4 shadow-glass">
          <div className="flex items-center justify-between text-amber-700 font-bold text-sm">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Hozir qiynalayotganlar</span>
            </span>
            <span className="font-mono text-xs bg-amber-100 px-2 py-0.5 rounded-full">{stuckStudents.length} ta</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {stuckStudents.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Hozircha hech bir o'quvchi 3-darajali maslahatga tushmadi. Barchasi yaxshi davom etmoqda!
              </div>
            ) : (
              stuckStudents.map((s) => (
                <div key={s.user_id} className="glass-card p-3 flex items-center justify-between border-l-4 border-l-rose-500">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{s.nickname}</p>
                    <p className="text-xs text-rose-600 font-medium">Maslahat darajasi: L{s.hintLevel}</p>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setViewingStudentCode({
                        nickname: s.nickname,
                        snippet: s.code_snippet || "/* Kod yuklanmoqda... */",
                      });
                    }}
                    className="glass-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Kodni ko'rish</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Teacher Broadcast Nudge */}
          <div className="pt-4 border-t border-slate-200/70 space-y-2">
            <label className="text-xs font-semibold text-slate-700">O'quvchilarga tezkor ko'rsatma (Nudge)</label>
            <div className="flex gap-2">
              <input
                value={nudgeText}
                onChange={(e) => setNudgeText(e.target.value)}
                placeholder="Masalan: .container balandligiga e'tibor bering!"
                className="glass-input text-xs"
              />
              <button onClick={sendNudge} className="glass-btn-primary px-3.5 py-2">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Panel 2: Live Heatmap */}
        <div className="glass-panel p-5 space-y-4 shadow-glass">
          <h3 className="font-bold text-sm text-slate-900">Konsept xaritasi (Heatmap)</h3>
          <p className="text-xs text-slate-500">O'quvchilar Ustoz AI dan eng ko'p so'ragan mavzular:</p>
          <div className="space-y-3">
            {Object.entries(conceptCounts).map(([concept, count]) => (
              <div key={concept} className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-700">
                  <span>#{concept}</span>
                  <span className="font-semibold">{count} marta</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, count * 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Live Participants Leaderboard */}
        <div className="glass-panel p-5 space-y-4 shadow-glass">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <span>Qatnashuvchilar ({leaderboard.length})</span>
            </h3>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {leaderboard.map((p, idx) => (
              <div key={p.user_id} className="glass-card p-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                  <span className="font-bold text-slate-900">{p.nickname}</span>
                  {p.passed && <span className="text-[11px] text-lime-700 font-bold bg-lime-100 px-1.5 py-0.2 rounded">✓</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">L{p.hintLevel}</span>
                  <span className="font-mono font-bold text-slate-900">{p.score} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Code Inspector Modal */}
      <GlassModal
        open={Boolean(viewingStudentCode)}
        onClose={() => setViewingStudentCode(null)}
        title={`${viewingStudentCode?.nickname || "O'quvchi"}ning joriy kodi`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap max-h-60">
            {viewingStudentCode?.snippet}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setViewingStudentCode(null)} className="glass-btn-secondary text-xs">
              Yopish
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
