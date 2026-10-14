import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html as langHtml } from "@codemirror/lang-html";
import { css as langCss } from "@codemirror/lang-css";
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
  Minimize2
} from "lucide-react";

import { UZ } from "../../lib/i18n/uz";
import { supabase } from "../../lib/supabase";
import { appStore } from "../../lib/store";
import { buildSandboxedSrcDoc, AssertionResult } from "../../lib/tests-runner";
import { calculateScore } from "../../lib/scoring";
import { formatHtml, formatCss } from "../../lib/formatter";
import { vsCodeExtension } from "../../lib/editor-theme";
import { sounds } from "../../lib/audio";
import {
  BrandLogo,
  LevelDots,
  TypewriterHint,
  TestChecklistItem,
  GlassModal,
  VsCodeTabs,
  VsCodeStatusBar,
  SoundToggle
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

export const Workspace: React.FC = () => {
  const { id = "22222222-2222-2222-2222-222222222222" } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  // Challenge State from Store
  const initialChallenge = useMemo(() => appStore.getChallengeById(id), [id]);
  const [challenge, setChallenge] = useState(initialChallenge);

  // Saved code draft or starter
  const savedDraft = appStore.getDraft(challenge.id);
  const [codeHtml, setCodeHtml] = useState(savedDraft?.html || challenge.starter_html);
  const [codeCss, setCodeCss] = useState(savedDraft?.css || challenge.starter_css);

  const [activeCodeTab, setActiveCodeTab] = useState<"html" | "css">("css");
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
  const [maxHintLevel, setMaxHintLevel] = useState(0);
  const [failedChecksSinceL3, setFailedChecksSinceL3] = useState(0);
  const [loadingHint, setLoadingHint] = useState(false);

  // Modals
  const [showResetModal, setShowResetModal] = useState(false);
  const [showL4Modal, setShowL4Modal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isDirtyHtml = codeHtml !== challenge.starter_html;
  const isDirtyCss = codeCss !== challenge.starter_css;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 600ms Debounced Live Preview + Draft Save
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests));
      appStore.saveDraft(challenge.id, codeHtml, codeCss);
    }, 600);
    return () => clearTimeout(timer);
  }, [codeHtml, codeCss, challenge]);

  // Handle Sandboxed Test Results from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "TEST_RESULTS") {
        const results: AssertionResult[] = e.data.results;
        setTestResults(results);
        const allPassed = results.length > 0 && results.every((r) => r.passed);
        if (allPassed) {
          sounds.playSuccess();
          confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
          appStore.markChallengeCompleted(challenge.id);
          appStore.addXp(currentScore);
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
  }, [challenge.id, maxHintLevel]);

  const triggerCheckTests = useCallback(() => {
    sounds.playClick();
    iframeRef.current?.contentWindow?.postMessage({ type: "RUN_TESTS" }, "*");
  }, []);

  const handleFormatDocument = useCallback(() => {
    if (activeCodeTab === "html") {
      const formatted = formatHtml(codeHtml);
      setCodeHtml(formatted);
    } else {
      const formatted = formatCss(codeCss);
      setCodeCss(formatted);
    }
    showToast("Kod formatlandi (Shift+Alt+F)");
  }, [activeCodeTab, codeHtml, codeCss]);

  // Keyboard Shortcuts (VS Code parity: Ctrl+Enter check, Ctrl+S run, Shift+Alt+F format)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        triggerCheckTests();
        showToast("Testlar tekshirilmoqda... (Ctrl+Enter)");
      } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests));
        showToast("Natija yangilandi (Ctrl+S)");
      } else if (e.shiftKey && e.altKey && (e.key === "F" || e.key === "f")) {
        e.preventDefault();
        handleFormatDocument();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerCheckTests, handleFormatDocument, codeHtml, codeCss, challenge.tests]);

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
      // Smart Context-Aware Local Fallback
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
          hint: challenge.fallback_hints["4"] || challenge.solution_css,
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
  const currentScore = useMemo(() => calculateScore(hints.map((h) => h.level)), [hints]);
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

      {/* Top VS Code-like Minimalist Header */}
      <header className="glass-nav px-4 py-2 flex items-center justify-between border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              navigate("/app");
            }}
            title="Mashqlar ro'yxatiga qaytish"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <BrandLogo size="sm" />
          <div className="h-4 w-[1px] bg-slate-200" />

          {/* Breadcrumb path */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>mashqlar</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-900">{challenge.title}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 font-medium">
              {challenge.level}-daraja
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <SoundToggle />
          <div className="glass-card px-3 py-1 text-xs font-mono font-semibold text-slate-700 shadow-xs">
            Ball: <span className="text-lime-700">+{currentScore} XP</span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setDebouncedDoc(buildSandboxedSrcDoc(codeHtml, codeCss, challenge.tests));
              showToast("Natija yangilandi (Ctrl+S)");
            }}
            title="Kodni ishga tushirish (Ctrl+S)"
            className="glass-btn-secondary text-xs py-1.5 px-3"
          >
            <Play className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{UZ.cta.run}</span>
          </button>

          <button
            onClick={triggerCheckTests}
            title="Avtomatik testlarni tekshirish (Ctrl+Enter)"
            className="glass-btn-brand text-xs py-1.5 px-3.5 shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{UZ.cta.check}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 hidden lg:block"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main 3-Pane Desktop Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 max-w-[1720px] w-full mx-auto">
        {/* LEFT PANE: Task, Requirements & Target Preview (3 Cols) */}
        <section
          className={`lg:col-span-3 glass-panel p-4 flex flex-col gap-4 overflow-hidden ${
            mobileTab !== "vazifa" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Sub-tabs: Vazifa vs Kutilayotgan Natija (Target) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
            <button
              onClick={() => {
                sounds.playClick();
                setLeftTab("task");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                leftTab === "task" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{UZ.workspace.taskTab}</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setLeftTab("target");
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                leftTab === "target" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-lime-600" />
              <span>{UZ.workspace.targetTab}</span>
            </button>
          </div>

          {leftTab === "task" ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div>
                <h2 className="font-bold text-base text-slate-900 leading-snug">{challenge.title}</h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line font-sans">
                  {challenge.description_md}
                </p>
              </div>

              {/* Checklist Requirements */}
              <div className="space-y-2 pt-2 border-t border-slate-200/70">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Talablar va Testlar
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-700">
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

              {/* Keyboard Shortcuts Hint */}
              <div className="pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-mono space-y-1">
                <p>• <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-600">Ctrl+Enter</kbd> Tekshirish</p>
                <p>• <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 text-slate-600">Shift+Alt+F</kbd> Formatlash</p>
              </div>
            </div>
          ) : (
            /* Target Expected View */
            <div className="flex-1 flex flex-col glass-card p-4 text-center justify-between overflow-hidden">
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Kutilayotgan dizayn (Maqsad):</p>
                <p className="text-[11px] text-slate-500 mb-3">Siz yozgan kod xuddi shu ko'rinishga mos kelishi kerak.</p>
              </div>

              <div className="w-full my-auto p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white/90 shadow-inner overflow-auto max-h-56">
                <div
                  dangerouslySetInnerHTML={{ __html: challenge.target_html }}
                />
              </div>

              <div className="text-[11px] text-slate-400 mt-2">
                O'ng tomondagi "Natija" bo'limi bilan taqqoslang.
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
            onFormat={handleFormatDocument}
            onReset={() => setShowResetModal(true)}
          />

          {/* Breadcrumb Path Bar */}
          <div className="px-3 py-1 bg-white/60 border-b border-slate-200/60 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 select-none">
            <span>ozing-yoz</span>
            <span>›</span>
            <span>src</span>
            <span>›</span>
            <span className="text-slate-800 font-medium">{activeCodeTab === "html" ? "index.html" : "style.css"}</span>
          </div>

          {/* CodeMirror 6 Editor with VS Code Light Theme */}
          <div className="flex-1 overflow-auto bg-white/80 relative">
            <CodeMirror
              value={activeCodeTab === "html" ? codeHtml : codeCss}
              height="100%"
              minHeight="420px"
              extensions={[
                activeCodeTab === "html" ? langHtml() : langCss(),
                vsCodeExtension,
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
                else setCodeCss(val);
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
          className={`lg:col-span-4 flex flex-col gap-3 ${
            mobileTab !== "natija" && mobileTab !== "ustoz" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Top Half: Sandboxed Preview */}
          <div className="glass-panel flex flex-col h-72 overflow-hidden shadow-glass-sm">
            <div className="px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between bg-white/80 select-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{UZ.workspace.resultTitle}</span>
                <span className="text-[11px] text-slate-400 font-mono">({viewportWidth})</span>
              </div>

              {/* Viewport Width Toggles */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("100%");
                  }}
                  title="Monitor / Desktop (100%)"
                  className={`p-1 rounded ${viewportWidth === "100%" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("768px");
                  }}
                  title="Planshet (768px)"
                  className={`p-1 rounded ${viewportWidth === "768px" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewportWidth("375px");
                  }}
                  title="Telefon (375px)"
                  className={`p-1 rounded ${viewportWidth === "375px" ? "bg-white shadow-xs text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport with Realistic Frame for Mobile */}
            <div className="flex-1 bg-slate-100/50 flex justify-center items-center overflow-auto p-2">
              <div
                style={{ width: viewportWidth }}
                className={`h-full transition-all duration-300 bg-white ${
                  viewportWidth !== "100%"
                    ? "border-4 border-slate-800 rounded-2xl shadow-xl overflow-hidden"
                    : "rounded-lg border border-slate-200/80 shadow-xs"
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
          <div className="glass-panel flex-1 p-4 flex flex-col justify-between gap-3 shadow-glass">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-lime-100 border border-lime-300 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-lime-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{UZ.workspace.tutorTitle}</h3>
                  <p className="text-[11px] text-slate-500">{UZ.tagline}</p>
                </div>
              </div>
              <LevelDots currentLevel={maxHintLevel} />
            </div>

            {/* Hint Conversation History */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-56 pr-1">
              {hints.length === 0 ? (
                <div className="text-center py-6 px-3 text-xs text-slate-500 space-y-2">
                  <p>Ustoz AI tayyor javobni berib qo'ymaydi — 4 bosqichli maslahat zinapoyasi orqali fikrlashga undaydi.</p>
                  <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">1. Savol</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">2. Yo'nalish</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">3. Tushuntirish</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">4. Qisman yechim</span>
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
            <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 font-medium">
                Keyingi: <strong className="text-slate-900">{UZ.hintLevels[nextHintLevel as 1 | 2 | 3 | 4]}</strong>
              </span>

              <button
                disabled={loadingHint || maxHintLevel >= 4}
                onClick={() => {
                  if (nextHintLevel === 4) setShowL4Modal(true);
                  else requestHint(nextHintLevel);
                }}
                className="glass-btn-primary text-xs py-2 px-3.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>{loadingHint ? "O'ylanmoqda..." : UZ.cta.askHint}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden glass-nav border-t border-slate-200 grid grid-cols-4 py-2 text-center text-xs font-semibold select-none">
        {(["vazifa", "kod", "natija", "ustoz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              sounds.playClick();
              setMobileTab(tab);
            }}
            className={`py-1.5 capitalize transition-all ${
              mobileTab === tab ? "text-lime-700 font-bold border-b-2 border-b-lime-600" : "text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Modal: Reset Code Confirmation */}
      <GlassModal open={showResetModal} onClose={() => setShowResetModal(false)} title={UZ.cta.reset}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">{UZ.workspace.resetWarning}</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowResetModal(false)} className="glass-btn-secondary text-xs">
              Bekor qilish
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setCodeHtml(challenge.starter_html);
                setCodeCss(challenge.starter_css);
                setShowResetModal(false);
                showToast("Boshlang'ich holatga qaytarildi");
              }}
              className="glass-btn-primary text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              Tiklash
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Level 4 Penalty Confirmation */}
      <GlassModal open={showL4Modal} onClose={() => setShowL4Modal(false)} title="4-daraja: Qisman yechim (-40 ball)">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">{UZ.workspace.level4Warning}</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowL4Modal(false)} className="glass-btn-secondary text-xs">
              Yo'q, o'zim yozaman
            </button>
            <button
              onClick={() => {
                setShowL4Modal(false);
                requestHint(4);
              }}
              className="glass-btn-primary text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              Ha, ko'rsatilsin
            </button>
          </div>
        </div>
      </GlassModal>

      {/* Modal: Challenge Passed Celebration */}
      <GlassModal open={showPassModal} onClose={() => setShowPassModal(false)} title={UZ.workspace.passMessage}>
        <div className="space-y-5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-lime-100 border border-lime-300 flex items-center justify-center shadow-glass">
            <Check className="w-8 h-8 text-lime-700 stroke-[3]" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">Ajoyib natija!</h4>
            <p className="text-xs text-slate-500 mt-1">Siz topshiriqni muvaffaqiyatli bajardingiz.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="glass-card p-3.5">
              <p className="text-xs text-slate-500 font-medium">To'plangan ball</p>
              <p className="font-mono text-2xl font-bold text-lime-700 mt-0.5">+{currentScore} XP</p>
            </div>
            <div className="glass-card p-3.5">
              <p className="text-xs text-slate-500 font-medium">Maslahatlar</p>
              <p className="font-mono text-2xl font-bold text-slate-900 mt-0.5">{hints.length} ta</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowPassModal(false)} className="glass-btn-secondary text-xs">
              Yopish
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                navigate("/app");
              }}
              className="glass-btn-brand text-xs font-semibold"
            >
              Keyingi mashqqa o'tish →
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
