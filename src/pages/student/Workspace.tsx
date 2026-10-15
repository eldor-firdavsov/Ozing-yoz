import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html as langHtml } from "@codemirror/lang-html";
import { css as langCss } from "@codemirror/lang-css";
import { javascript as langJs } from "@codemirror/lang-javascript";
import { EditorView, Decoration } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import confetti from "canvas-confetti";
import {
  Play,
  CheckCircle,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  RotateCcw,
  AlignLeft,
  Eye,
  Check,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bell,
  Trophy,
  Info
} from "lucide-react";

import { UZ } from "../../lib/i18n/uz";
import { supabase } from "../../lib/supabase";
import { appStore, LiveRoomState } from "../../lib/store";
import { buildSandboxedSrcDoc, AssertionResult } from "../../lib/tests-runner";
import { calculateScore } from "../../lib/scoring";
import { formatHtml, formatCss, formatJs } from "../../lib/formatter";
import { getVsCodeExtension } from "../../lib/editor-theme";
import { themeManager } from "../../lib/theme";
import { sounds } from "../../lib/audio";
import {
  BrandLogo,
  LevelDots,
  TypewriterHint,
  TestChecklistItem,
  GlassModal,
  VsCodeTabs,
  VsCodeStatusBar,
  SoundToggle,
  ThemeToggle,
  SyncedTimer
} from "../../components/ui/GlassComponents";

// Line Highlight Extension for Level 2 Hints
const setHighlightLine = StateEffect.define<number | null>();
const highlightLineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setHighlightLine)) {
        if (!e.value || e.value < 1 || e.value > tr.state.doc.lines) {
          deco = Decoration.none;
        } else {
          const linePos = tr.state.doc.line(e.value).from;
          deco = Decoration.set([
            Decoration.line({ attributes: { class: "cm-hint-line-highlight" } }).range(linePos),
          ]);
        }
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const Workspace: React.FC<{ isRoom?: boolean }> = ({ isRoom = false }) => {
  const { id, code } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  const isLiveRoom = Boolean(code) || isRoom;
  const roomCode = code || "FLX742";

  // Challenge selection
  const challengeId = id || (isLiveRoom ? appStore.getRoom(roomCode).challenge_id : "11111111-1111-1111-1111-111111111111");
  const initialChallenge = useMemo(() => appStore.getChallengeById(challengeId), [challengeId]);
  const [challenge, setChallenge] = useState(initialChallenge);

  // All challenges & Next challenge calculation
  const allChallenges = useMemo(() => appStore.getChallenges(), []);
  const currentIndex = allChallenges.findIndex((c) => c.id === challenge.id);
  const nextChallenge = currentIndex >= 0 && currentIndex < allChallenges.length - 1 ? allChallenges[currentIndex + 1] : null;

  // Live Room state if in room mode
  const [roomState, setRoomState] = useState<LiveRoomState | null>(() =>
    isLiveRoom ? appStore.getRoom(roomCode) : null
  );
  const [activeNudge, setActiveNudge] = useState<string | null>(null);

  // Saved code draft or starter
  const savedDraft = appStore.getDraft(challenge.id);
  const [codeHtml, setCodeHtml] = useState(savedDraft?.html || challenge.starter_html);
  const [codeCss, setCodeCss] = useState(savedDraft?.css || challenge.starter_css);
  const [codeJs, setCodeJs] = useState(savedDraft?.js || challenge.starter_js || "");

  const [activeCodeTab, setActiveCodeTab] = useState<"html" | "css" | "js">(() => {
    return challenge.topics?.includes("javascript") ? "js" : "css";
  });
  const [leftTab, setLeftTab] = useState<"task" | "target">("task");
  const [mobileTab, setMobileTab] = useState<"vazifa" | "kod" | "natija" | "ustoz">("kod");
  const [viewportWidth, setViewportWidth] = useState<"100%" | "768px" | "375px">("100%");
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tests & Hints
  const [debouncedDoc, setDebouncedDoc] = useState("");
  const [testResults, setTestResults] = useState<AssertionResult[]>([]);
  const [hints, setHints] = useState<
    Array<{ level: number; hint: string; line?: number | null; concept?: string; from_fallback?: boolean }>
  >([]);
  const currentScore = useMemo(() => calculateScore(hints.map((h) => h.level)), [hints]);
  const [maxHintLevel, setMaxHintLevel] = useState(0);
  const [failedChecksSinceL3, setFailedChecksSinceL3] = useState(0);
  const [loadingHint, setLoadingHint] = useState(false);

  // Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [showL4Modal, setShowL4Modal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showButtonsGuide, setShowButtonsGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isDirtyHtml = codeHtml !== challenge.starter_html;
  const isDirtyCss = codeCss !== challenge.starter_css;
  const isDirtyJs = codeJs !== (challenge.starter_js || "");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const [isDark, setIsDark] = useState(themeManager.isDark());

  useEffect(() => {
    return themeManager.subscribe((t) => {
      setIsDark(t === "dark");
    });
  }, []);

  // Dynamic sync when challengeId in URL route changes
  useEffect(() => {
    const nextItem = appStore.getChallengeById(challengeId);
    setChallenge(nextItem);
    const draft = appStore.getDraft(nextItem.id);
    setCodeHtml(draft?.html || nextItem.starter_html);
    setCodeCss(draft?.css || nextItem.starter_css);
    setCodeJs(draft?.js || nextItem.starter_js || "");
    setHints([]);
    setTestResults([]);
    setShowPassModal(false);
    setMaxHintLevel(0);
    setFailedChecksSinceL3(0);
    setActiveCodeTab(nextItem.topics?.includes("javascript") ? "js" : "css");
    setLeftTab("task");
    setDebouncedDoc(
      buildSandboxedSrcDoc(
        draft?.html || nextItem.starter_html,
        draft?.css || nextItem.starter_css,
        nextItem.tests,
        draft?.js || nextItem.starter_js || ""
      )
    );
  }, [challengeId]);

  const handleNextChallenge = () => {
    sounds.playClick();
    setShowPassModal(false);
    if (isLiveRoom) {
      navigate("/app");
      return;
    }
    if (nextChallenge) {
      navigate(`/app/challenge/${nextChallenge.id}`);
    } else {
      showToast("Tabriklaymiz! Barcha mavzulardagi topshiriqlarni to'liq yakunladingiz!");
      navigate("/app");
    }
  };

  // Sync Room Updates
  useEffect(() => {
    if (!isLiveRoom) return;

    const unsub = appStore.subscribe(() => {
      const updated = appStore.getRoom(roomCode);
      setRoomState(updated);
      if (updated.latest_nudge && updated.latest_nudge !== activeNudge) {
        setActiveNudge(updated.latest_nudge);
        sounds.playHint();
      }
    });

    const channel = supabase.channel(`room:${roomCode}`);
    channel
      .on("broadcast", { event: "state" }, ({ payload }) => {
        appStore.updateRoom(roomCode, { status: payload.status, started_at: payload.started_at });
      })
      .on("broadcast", { event: "nudge" }, ({ payload }) => {
        setActiveNudge(payload.message);
        sounds.playHint();
      })
      .subscribe();

    return () => {
      unsub();
      supabase.removeChannel(channel);
    };
  }, [isLiveRoom, roomCode, activeNudge]);

  // 600ms Debounced Live Preview + Draft Save
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests, codeJs));
      appStore.saveDraft(challenge.id, codeHtml, codeCss, codeJs);
    }, 600);
    return () => clearTimeout(timer);
  }, [codeHtml, codeCss, codeJs, challenge]);

  // Handle Sandboxed Test Results from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "TEST_RESULTS") {
        const results: AssertionResult[] = e.data.results;
        setTestResults(results);
        const allPassed = results.length > 0 && results.every((r) => r.passed);
        if (allPassed) {
          sounds.playSuccess();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          appStore.markChallengeCompleted(challenge.id);
          appStore.addXp(currentScore);

          // If in live room, submit result to room leaderboard
          if (isLiveRoom) {
            const profile = appStore.getProfile();
            appStore.submitStudentSolution(
              roomCode,
              profile.id,
              profile.full_name,
              currentScore,
              maxHintLevel,
              codeCss
            );
          }

          setShowPassModal(true);
        } else {
          sounds.playError();
          if (maxHintLevel >= 3) {
            setFailedChecksSinceL3((prev) => prev + 1);
          }
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [challenge.id, maxHintLevel, isLiveRoom, roomCode, currentScore, codeCss]);

  const triggerCheckTests = useCallback(() => {
    sounds.playClick();
    iframeRef.current?.contentWindow?.postMessage({ type: "RUN_TESTS" }, "*");
  }, []);

  const handleFormatDocument = useCallback(() => {
    if (activeCodeTab === "html") {
      const formatted = formatHtml(codeHtml);
      setCodeHtml(formatted);
    } else if (activeCodeTab === "css") {
      const formatted = formatCss(codeCss);
      setCodeCss(formatted);
    } else {
      const formatted = formatJs(codeJs);
      setCodeJs(formatted);
    }
    showToast("Kod formatlandi (Shift+Alt+F)");
  }, [activeCodeTab, codeHtml, codeCss, codeJs]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        triggerCheckTests();
        showToast("Testlar tekshirilmoqda... (Ctrl+Enter)");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests, codeJs));
        showToast("Natija yangilandi (Ctrl+S)");
      } else if (e.shiftKey && e.altKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        handleFormatDocument();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerCheckTests, handleFormatDocument, codeHtml, codeCss, codeJs, challenge.tests]);

  const highlightEditorLine = (lineNum: number | null) => {
    if (!editorViewRef.current) return;
    editorViewRef.current.dispatch({
      effects: setHighlightLine.of(lineNum),
    });
    if (lineNum) {
      const linePos = editorViewRef.current.state.doc.line(lineNum).from;
      editorViewRef.current.dispatch({
        selection: { anchor: linePos },
        scrollIntoView: true,
      });
    }
  };

  const requestHint = async (targetLevel: number) => {
    if (targetLevel === 4 && failedChecksSinceL3 < 2) {
      sounds.playError();
      alert("4-darajani ochish uchun 3-darajadan keyin kamida 2 marta 'Tekshirish' tugmasini bosib sinab ko'ring.");
      return;
    }
    setLoadingHint(true);
    sounds.playClick();

    try {
      const failed = testResults.filter((t) => !t.passed).map((t) => t.label);
      const { data, error } = await supabase.functions.invoke("hint", {
        body: {
          attempt_id: "demo-attempt",
          level: targetLevel,
          html: codeHtml,
          css: codeCss,
          failed_tests: failed,
        },
      });

      if (error || !data?.hint) throw error || new Error("Fallback");

      sounds.playHint();
      setHints((prev) => [...prev, data]);
      setMaxHintLevel((prev) => Math.max(prev, targetLevel));
      if (data.line) highlightEditorLine(data.line);
    } catch {
      sounds.playHint();
      const fallbackMap: Record<number, { hint: string; line: number | null; concept: string }> = {
        1: {
          hint: challenge.fallback_hints["1"] || "Elementlarni markazga keltirish yoki xossa qiymatlarini yana bir bor tekshirib ko'ring.",
          line: null,
          concept: challenge.topics[0] || "css",
        },
        2: {
          hint: challenge.fallback_hints["2"] || `CSS 4-qatorda xossalarni to'g'ri joylashtirganingizga ishonch hosil qiling.`,
          line: 4,
          concept: challenge.topics[0] || "css",
        },
        3: {
          hint: challenge.fallback_hints["3"] || "Masalan: display: flex; va justify-content: center; asosiy o'q bo'ylab tartiblaydi.",
          line: 4,
          concept: challenge.topics[0] || "flexbox",
        },
        4: {
          hint: challenge.fallback_hints["4"] || challenge.solution_js || challenge.solution_css,
          line: 4,
          concept: challenge.topics[0] || "solution",
        },
      };

      const fb = fallbackMap[targetLevel] || fallbackMap[1];
      setHints((prev) => [
        ...prev,
        {
          level: targetLevel,
          hint: fb.hint,
          line: fb.line,
          concept: fb.concept,
          from_fallback: true,
        },
      ]);
      setMaxHintLevel((prev) => Math.max(prev, targetLevel));
      if (fb.line) highlightEditorLine(fb.line);
    } finally {
      setLoadingHint(false);
    }
  };

  const nextHintLevel = Math.min(4, maxHintLevel + 1);
  const passedTestsCount = testResults.filter((r) => r.passed).length;

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAFC] ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900/90 text-white text-xs font-mono px-4 py-2 rounded-xl backdrop-blur-md shadow-glass-lg animate-in slide-in-from-top-2 duration-150 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Competition Banner (if in Room mode) */}
      {isLiveRoom && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-lime-400">
              <span className="h-2.5 w-2.5 rounded-full bg-lime-400 animate-ping" />
              <span>🏆 JONLI MUSOBAQA: {roomCode}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Holat:</span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                  roomState?.status === "live"
                    ? "bg-lime-900/80 text-lime-300 border border-lime-700"
                    : roomState?.status === "paused"
                    ? "bg-amber-900/80 text-amber-300 border border-amber-700"
                    : roomState?.status === "ended"
                    ? "bg-rose-900/80 text-rose-300 border border-rose-700"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {roomState?.status === "live"
                  ? "⚡ Musobaqa ketmoqda"
                  : roomState?.status === "paused"
                  ? "⏸ Pauza"
                  : roomState?.status === "ended"
                  ? "🏁 Yakunlandi"
                  : "⏳ Ustoz boshlashini kuting"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <SyncedTimer
              durationSec={roomState?.duration_sec || 900}
              startedAt={roomState?.started_at}
              status={roomState?.status || "live"}
            />
            <button
              onClick={() => {
                sounds.playClick();
                navigate("/app");
              }}
              title="Musobaqadan chiqish"
              className="text-slate-400 hover:text-white underline text-[11px]"
            >
              Chiqish
            </button>
          </div>
        </div>
      )}

      {/* Live Teacher Nudge Alert */}
      {activeNudge && (
        <div className="bg-amber-500 text-slate-950 font-semibold px-4 py-2 flex items-center justify-between text-xs animate-in slide-in-from-top-1 shadow-sm">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Bell className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
            <span>
              <strong>Ustozdan ko'rsatma:</strong> {activeNudge}
            </span>
          </div>
          <button
            onClick={() => setActiveNudge(null)}
            className="text-slate-950/70 hover:text-slate-950 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Lesson Header */}
      <header className="glass-nav px-4 sm:px-6 py-2.5 flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              navigate(isLiveRoom ? "/app" : "/app/challenges");
            }}
            title="Ortga qaytish"
            className="w-10 h-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-black"
          >
            ✕
          </button>
          <BrandLogo size="md" />

          {/* Breadcrumb path */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-mono">
            <span>{isLiveRoom ? "musobaqa" : "mashqlar"}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="font-extrabold text-slate-900 dark:text-white">{challenge.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black border border-emerald-300 dark:border-emerald-700">
              {challenge.level}-daraja
            </span>
          </div>
        </div>

        {/* Lesson Progress Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-3 sm:mx-6 flex items-center gap-2.5">
          <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${challenge.tests.length > 0 ? (passedTestsCount / challenge.tests.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="font-black text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
            {passedTestsCount}/{challenge.tests.length}
          </span>
        </div>

        {/* Action Controls & Clear Tooltips */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SoundToggle />
          <ThemeToggle />

          {/* Help Button Guide */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowButtonsGuide(true);
            }}
            title="Tugmalar vazifasi va qoidalar"
            className="duo-btn-white text-xs sm:text-sm py-2 px-3 font-extrabold flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Qoidalar</span>
          </button>

          {/* Score Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9E6] dark:bg-amber-950/40 border-2 border-[#FFC800] dark:border-amber-700 border-b-4 border-b-[#E0A800] dark:border-b-amber-800 rounded-2xl font-black text-xs sm:text-sm text-[#B88700] dark:text-amber-400 select-none">
            <span>⚡</span>
            <span>+{currentScore} XP</span>
          </div>

          {/* Run Button (Ctrl+S) */}
          <button
            onClick={() => {
              sounds.playClick();
              setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests, codeJs));
              showToast("Natija yangilandi (Ctrl+S)");
            }}
            title="Yozgan kodingizni ekranda sinab ko'rish (Ctrl+S)"
            className="duo-btn-white text-xs sm:text-sm py-2 px-3.5 font-extrabold text-slate-700 dark:text-slate-200"
          >
            <Play className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="hidden md:inline">{UZ.cta.run}</span>
          </button>

          {/* Check Button (Ctrl+Enter) */}
          <button
            onClick={triggerCheckTests}
            title="Avtomatik testlar orqali tekshirish va ball olish (Ctrl+Enter)"
            className="duo-btn-green text-xs sm:text-sm py-2 px-4 sm:px-5 font-black shadow-sm"
          >
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            <span>{UZ.cta.check}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hidden xl:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main 3-Pane Desktop Workspace - 100% Full Width */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-3 sm:px-6 py-3 w-full">
        {/* LEFT PANE: Task, Requirements & Target Preview (3 Cols) */}
        <section
          className={`lg:col-span-3 glass-panel p-5 flex flex-col gap-4 overflow-hidden ${
            mobileTab !== "vazifa" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Sub-tabs: Vazifa vs Kutilayotgan Natija (Target) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl">
            <button
              onClick={() => {
                sounds.playClick();
                setLeftTab("task");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                leftTab === "task" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{UZ.workspace.taskTab}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setLeftTab("target");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                leftTab === "target" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{UZ.workspace.targetTab}</span>
            </button>
          </div>

          {leftTab === "task" ? (
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <div>
                <h2 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">{challenge.title}</h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line font-sans">
                  {challenge.description_md}
                </p>
              </div>

              {/* Checklist Requirements */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Talablar va Testlar
                  </h3>
                  <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
                    {passedTestsCount}/{challenge.tests.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {challenge.tests.map((t, idx) => (
                    <TestChecklistItem
                      key={idx}
                      label={t.label}
                      passed={testResults[idx]?.passed}
                    />
                  ))}
                </div>
              </div>

              {/* Live Room Guidance Banner */}
              {isLiveRoom && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-lime-50 dark:from-amber-950/40 dark:to-emerald-950/40 rounded-xl border border-amber-300/80 dark:border-amber-800 text-sm text-slate-800 dark:text-slate-200 space-y-1 shadow-sm">
                  <p className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                    <span>🏆 Jonli musobaqa: {roomCode}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Testlarni to'liq topshiring ("Tekshirish" yoki Ctrl+Enter). Har bir to'g'ri test balingizni oshiradi va natijangiz doskadagi proyektor reytingiga avtomatik uzatiladi!
                  </p>
                </div>
              )}

              {/* Step by step simple instruction for students */}
              <div className="p-4 bg-lime-50/70 dark:bg-emerald-950/30 rounded-xl border border-lime-200/80 dark:border-emerald-800 text-sm text-slate-700 dark:text-slate-300 space-y-2">
                <p className="font-bold text-lime-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Nima qilish kerak?</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <li>
                    O'rtada ochilgan{" "}
                    <strong>
                      {challenge.topics.includes("javascript")
                        ? "script.js"
                        : activeCodeTab === "html"
                        ? "index.html"
                        : "style.css"}
                    </strong>{" "}
                    faylida kod yozing.
                  </li>
                  <li><strong>"Ishga tushirish"</strong> (yoki Ctrl+S) orqali natijani ko'ring.</li>
                  <li><strong>"Tekshirish"</strong> (yoki Ctrl+Enter) orqali ball to'plang.</li>
                  <li>Qiynalsangiz, o'ng pastdagi <strong>"Maslahat so'rash"</strong> tugmasidan foydalaning.</li>
                </ol>
              </div>
            </div>
          ) : (
            /* Target Expected View */
            <div className="flex-1 flex flex-col glass-card p-5 text-center justify-between overflow-hidden">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Kutilayotgan dizayn (Maqsad):</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Siz yozgan kod aynan shu ko'rinishni hosil qilishi kerak.</p>
              </div>

              <div className="w-full my-auto p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white/90 dark:bg-slate-900 shadow-inner overflow-auto max-h-60">
                <div
                  dangerouslySetInnerHTML={{ __html: challenge.target_html }}
                />
              </div>

              <div className="text-xs text-slate-400 mt-2">
                O'ng tomondagi "Natija" ekrani bilan solishtiring.
              </div>
            </div>
          )}
        </section>

        {/* CENTER PANE: VS Code-like Code Editor (5 Cols) */}
        <section
          className={`lg:col-span-5 glass-panel flex flex-col overflow-hidden shadow-glass ${
            mobileTab !== "kod" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* VS Code Tab Bar */}
          <VsCodeTabs
            activeTab={activeCodeTab}
            onChangeTab={setActiveCodeTab}
            isDirtyHtml={isDirtyHtml}
            isDirtyCss={isDirtyCss}
            isDirtyJs={isDirtyJs}
            onFormat={handleFormatDocument}
            onReset={() => setShowResetModal(true)}
          />

          {/* Breadcrumb Path Bar */}
          <div className="px-3 py-1 bg-white/60 dark:bg-zinc-900 border-b border-slate-200/60 dark:border-zinc-800 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400 select-none">
            <span>ozing-yoz</span>
            <span>›</span>
            <span>src</span>
            <span>›</span>
            <span className="text-slate-800 dark:text-zinc-200 font-medium">
              {activeCodeTab === "html" ? "index.html" : activeCodeTab === "css" ? "style.css" : "script.js"}
            </span>
          </div>

          {/* CodeMirror 6 Editor with Dynamic Theme */}
          <div className="flex-1 overflow-auto bg-white/80 dark:bg-[#18181b] relative">
            <CodeMirror
              value={activeCodeTab === "html" ? codeHtml : activeCodeTab === "css" ? codeCss : codeJs}
              height="100%"
              minHeight="420px"
              extensions={[
                activeCodeTab === "html" ? langHtml() : activeCodeTab === "css" ? langCss() : langJs(),
                getVsCodeExtension(isDark),
                highlightLineField,
              ]}
              onCreateEditor={(view) => {
                editorViewRef.current = view;
              }}
              onUpdate={(viewUpdate) => {
                const pos = viewUpdate.state.selection.main.head;
                const line = viewUpdate.state.doc.lineAt(pos);
                setCursorPos({ line: line.number, col: pos - line.from + 1 });
              }}
              onChange={(val) => {
                if (activeCodeTab === "html") setCodeHtml(val);
                else if (activeCodeTab === "css") setCodeCss(val);
                else setCodeJs(val);
              }}
            />
          </div>

          {/* VS Code Bottom Status Bar */}
          <VsCodeStatusBar
            cursorPos={cursorPos}
            activeTab={activeCodeTab}
            testCount={challenge.tests.length}
            passedCount={passedTestsCount}
          />
        </section>

        {/* RIGHT PANE: Sandboxed Live Preview & Ustoz AI Assistant (4 Cols) */}
        <section
          className={`lg:col-span-4 flex flex-col gap-4 ${
            mobileTab !== "natija" && mobileTab !== "ustoz" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Top Half: Sandboxed Preview */}
          <div className="glass-panel flex flex-col h-76 overflow-hidden shadow-glass-sm">
            <div className="px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/90 select-none">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{UZ.workspace.resultTitle}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({viewportWidth})</span>
              </div>

              {/* Viewport Width Toggles */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("100%");
                  }}
                  title="Monitor / Desktop (100%)"
                  className={`p-1.5 rounded-md ${viewportWidth === "100%" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("768px");
                  }}
                  title="Planshet (768px)"
                  className={`p-1.5 rounded-md ${viewportWidth === "768px" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("375px");
                  }}
                  title="Telefon (375px)"
                  className={`p-1.5 rounded-md ${viewportWidth === "375px" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport with Realistic Frame for Mobile */}
            <div className="flex-1 bg-slate-100/50 dark:bg-slate-950/70 flex justify-center items-center overflow-auto p-2">
              <div
                style={{ width: viewportWidth }}
                className={`h-full transition-all duration-300 bg-white ${
                  viewportWidth !== "100%"
                    ? "border-4 border-slate-800 rounded-2xl shadow-xl overflow-hidden"
                    : "rounded-lg border border-slate-200/80 shadow-sm"
                }`}
              >
                <iframe
                  ref={iframeRef}
                  title="Preview"
                  sandbox="allow-scripts"
                  srcDoc={debouncedDoc}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>

          {/* Bottom Half: Ustoz AI Hint Ladder */}
          <div className="glass-panel flex-1 p-5 flex flex-col justify-between gap-3 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-100 dark:bg-emerald-950/60 border border-lime-300 dark:border-emerald-700 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{UZ.workspace.tutorTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{UZ.tagline}</p>
                </div>
              </div>
              <LevelDots currentLevel={maxHintLevel} />
            </div>

            {/* Hint Conversation History */}
            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-56 pr-1">
              {hints.length === 0 ? (
                <div className="text-center py-6 px-3 text-sm text-slate-600 dark:text-slate-300 space-y-2.5">
                  <p className="leading-relaxed">Ustoz AI tayyor javobni berib qo'ymaydi — 4 bosqichli maslahat zinapoyasi orqali fikrlashga undaydi.</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">1. Savol</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">2. Yo'nalish</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">3. Tushuntirish</span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">4. Qisman yechim</span>
                  </div>
                </div>
              ) : (
                hints.map((h, i) => (
                  <TypewriterHint
                    key={i}
                    level={h.level}
                    line={h.line}
                    concept={h.concept}
                    text={h.hint}
                    fromFallback={h.from_fallback}
                    onNavigateLine={(line) => highlightEditorLine(line)}
                  />
                ))
              )}
            </div>

            {/* Hint Action Bar */}
            <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-700 dark:text-slate-300 font-extrabold">
                Keyingi: <strong className="text-slate-900 dark:text-white">{UZ.hintLevels[nextHintLevel as 1 | 2 | 3 | 4]}</strong>
              </span>

              <button
                disabled={loadingHint || maxHintLevel >= 4}
                onClick={() => {
                  if (nextHintLevel === 4) setShowL4Modal(true);
                  else requestHint(nextHintLevel);
                }}
                className="duo-btn-blue text-sm py-2.5 px-4 shadow-sm font-extrabold"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{loadingHint ? "O'ylanmoqda..." : UZ.cta.askHint}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden glass-nav border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 py-2.5 text-center text-sm font-semibold select-none">
        {(["vazifa", "kod", "natija", "ustoz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sounds.playClick();
              setMobileTab(tab);
            }}
            className={`py-2 capitalize transition-all ${
              mobileTab === tab ? "text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-b-emerald-600" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Modal: Buttons Guide & Rules */}
      <GlassModal open={showButtonsGuide} onClose={() => setShowButtonsGuide(false)} title="Platforma Tugmalari va Qoidalari">
        <div className="space-y-4 text-sm">
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Ishga tushirish (Run) — [Ctrl+S]</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Yozgan kodingizni tekshirishdan oldin o'ng tomondagi ekranda ko'rish imkonini beradi.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tekshirish (Check) — [Ctrl+Enter]</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Kodingizni avtomatik testlar orqali tekshiradi va barcha shartlar bajarilganda ball qo'shadi.
              </p>
            </div>

            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800 space-y-1">
              <p className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Maslahat so'rash (Ustoz AI)</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                4 bosqichli maslahat zinapoyasi. 1-2 darajalar ozgina jarima bilan yo'naltiradi, 4-daraja qisman yechimni ko'rsatadi (-40 ball).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Formatlash — [Shift+Alt+F]</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Koddagi bo'shliqlar va xatoliklarni chiroyli tartiblab beradi (VS Code Prettier kabi).
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowButtonsGuide(false)} className="glass-btn-primary text-sm py-2.5 px-5 rounded-xl font-bold">
              Tushundim
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Reset Code Confirmation */}
      <GlassModal open={showResetModal} onClose={() => setShowResetModal(false)} title={UZ.cta.reset}>
        <div className="space-y-5">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{UZ.workspace.resetWarning}</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowResetModal(false)} className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl">
              Bekor qilish
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setCodeHtml(challenge.starter_html);
                setCodeCss(challenge.starter_css);
                setCodeJs(challenge.starter_js || "");
                setShowResetModal(false);
                showToast("Boshlang'ich holatga qaytarildi");
              }}
              className="glass-btn-primary text-sm py-2.5 px-4 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              Tiklash
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Level 4 Penalty Confirmation */}
      <GlassModal open={showL4Modal} onClose={() => setShowL4Modal(false)} title="4-daraja: Qisman yechim (-40 ball)">
        <div className="space-y-5">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{UZ.workspace.level4Warning}</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowL4Modal(false)} className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl">
              Yo'q, o'zim yozaman
            </button>
            <button
              onClick={() => {
                setShowL4Modal(false);
                requestHint(4);
              }}
              className="glass-btn-primary text-sm py-2.5 px-4 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
            >
              Ha, ko'rsatilsin
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Challenge Passed Celebration */}
      <GlassModal open={showPassModal} onClose={() => setShowPassModal(false)} title={UZ.workspace.passMessage}>
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-lime-100 border border-lime-300 flex items-center justify-center shadow-glass">
            <Check className="w-9 h-9 text-lime-700 stroke-[3]" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900">
              {isLiveRoom ? "Musobaqa topshirig'i bajarildi!" : "Ajoyib natija!"}
            </h4>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              {isLiveRoom
                ? "Natijangiz doskadagi proyektor reytingiga muvaffaqiyatli uzatildi."
                : "Siz topshiriqni muvaffaqiyatli bajardingiz."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="glass-card p-4">
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">To'plangan ball</p>
              <p className="font-mono text-3xl font-extrabold text-lime-700 mt-1">+{currentScore} XP</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">Maslahatlar</p>
              <p className="font-mono text-3xl font-extrabold text-slate-900 mt-1">{hints.length} ta</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowPassModal(false)} className="glass-btn-secondary text-sm py-2.5 px-4 font-semibold rounded-xl">
              Yopish
            </button>
            <button
              onClick={handleNextChallenge}
              className="glass-btn-brand text-sm py-2.5 px-5 font-bold rounded-xl active:scale-95 transition-transform inline-flex items-center gap-1.5"
            >
              <span>
                {isLiveRoom
                  ? "Darslarga qaytish"
                  : nextChallenge
                  ? `Keyingi mashqqa o'tish (${nextChallenge.title.split('.')[0]}-mashq) →`
                  : "Barcha mashqlar yakunlandi (Bosh sahifa) →"}
              </span>
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
