import React, { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  XCircle,
  Clock,
  Volume2,
  VolumeX,
  Copy,
  Check,
  AlignLeft,
  Terminal,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { sounds } from "../../lib/audio";
import { themeManager } from "../../lib/theme";

export const BrandLogo: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
  };
  const iconSizes = {
    sm: "w-7 h-7 text-xs rounded-xl",
    md: "w-9 h-9 text-sm rounded-xl",
    lg: "w-12 h-12 text-base rounded-2xl",
  };
  return (
    <div
      onClick={() => sounds.playClick()}
      className="inline-flex items-center gap-2.5 font-display font-black tracking-tight select-none cursor-pointer group active:scale-95 transition-transform duration-100"
    >
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-all`}
        style={{
          boxShadow: "0 1px 0 0 rgba(255, 255, 255, 0.4) inset, 0 2px 8px rgba(16, 185, 129, 0.25)",
        }}
      >
        OY
      </div>
      <span className={`${sizeClasses[size]} text-slate-900 dark:text-white font-extrabold tracking-tight transition-colors`}>
        O'zing<span className="text-emerald-600 dark:text-emerald-400">Yoz</span>
      </span>
    </div>
  );
};

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(sounds.enabled);

  const toggle = () => {
    sounds.enabled = !sounds.enabled;
    setEnabled(sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] active:scale-[0.92] transition-all"
    >
      {enabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
    </button>
  );
};

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(themeManager.isDark());

  useEffect(() => {
    return themeManager.subscribe((theme) => {
      setIsDark(theme === "dark");
    });
  }, []);

  const toggle = () => {
    sounds.playClick();
    themeManager.toggle();
  };

  return (
    <button
      onClick={toggle}
      title={isDark ? "Yorug' rejim (Light Mode)" : "Qorong'i rejim (Dark Mode)"}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] active:scale-[0.92] transition-all flex items-center justify-center"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400 animate-in spin-in-90 duration-200" />
      )}
    </button>
  );
};

export const LevelDots: React.FC<{ currentLevel: number }> = ({ currentLevel }) => {
  const colors = [
    "bg-sky-500 border-sky-300 ring-2 ring-sky-200/50",
    "bg-amber-500 border-amber-300 ring-2 ring-amber-200/50",
    "bg-orange-500 border-orange-300 ring-2 ring-orange-200/50",
    "bg-rose-500 border-rose-300 ring-2 ring-rose-200/50",
  ];
  return (
    <div className="flex items-center gap-2" title={`Maslahat darajasi: ${currentLevel}/4`}>
      {[1, 2, 3, 4].map((lvl) => (
        <span
          key={lvl}
          className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
            currentLevel >= lvl ? colors[lvl - 1] : "bg-slate-200/80 border-slate-300"
          }`}
        />
      ))}
    </div>
  );
};

export const TypewriterHint: React.FC<{
  text: string;
  level: number;
  line?: number | null;
  concept?: string;
  fromFallback?: boolean;
  onNavigateLine?: (line: number) => void;
}> = ({ text, level, line, concept, fromFallback, onNavigateLine }) => {
  const [displayed, setDisplayed] = useState(() => text.slice(0, 1));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [text]);

  const badgeColors: Record<number, string> = {
    1: "bg-sky-50 text-sky-700 border-sky-200",
    2: "bg-amber-50 text-amber-700 border-amber-200",
    3: "bg-orange-50 text-orange-700 border-orange-200",
    4: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="duo-speech-bubble space-y-3 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#1CB0F6] text-white flex items-center justify-center text-xs font-black">
            💡
          </span>
          <span className={`px-2.5 py-0.5 rounded-xl border-2 font-extrabold ${badgeColors[level] || badgeColors[1]}`}>
            {level}-daraja maslahat
          </span>
          {concept && (
            <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 font-bold">
              #{concept}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {line && (
            <button
              onClick={() => onNavigateLine?.(line)}
              title="Koddagi ushbu qatorga o'tish"
              className="font-mono text-xs text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1 transition-all"
            >
              <span>{line}-qator</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          {level === 4 && (
            <button
              onClick={handleCopy}
              className="text-xs text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Nusxalandi" : "Nusxalash"}</span>
            </button>
          )}
          {fromFallback && <span className="text-slate-400 text-xs font-semibold">Standart</span>}
        </div>
      </div>
      <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-wrap font-sans font-medium selection:bg-[#D7FFB8]">
        {displayed}
      </p>
    </div>
  );
};

export const TestChecklistItem: React.FC<{ label: string; passed?: boolean }> = ({ label, passed }) => (
  <div
    className={`duo-choice-card text-sm sm:text-base ${
      passed === true
        ? "duo-choice-passed"
        : passed === false
        ? "duo-choice-failed"
        : "hover:border-slate-300"
    }`}
  >
    {passed === true ? (
      <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center shrink-0 shadow-sm">
        <Check className="w-4 h-4 stroke-[3]" />
      </div>
    ) : passed === false ? (
      <div className="w-6 h-6 rounded-full bg-[#FF4B4B] text-white flex items-center justify-center shrink-0 shadow-sm">
        <XCircle className="w-4 h-4 stroke-[3]" />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
    )}
    <span className="flex-1 leading-snug">{label}</span>
  </div>
);

export const GlassModal: React.FC<{
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-4 transition-all"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] max-w-xl w-full p-7 space-y-5 rounded-3xl shadow-2xl"
        style={{
          boxShadow: "0 1px 0 0 rgba(255, 255, 255, 0.9) inset, 0 24px 48px -12px rgba(0, 0, 0, 0.18)",
          animation: "appleModalIn 220ms cubic-bezier(0.32, 0.72, 0, 1) forwards",
        }}
      >
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3.5">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">{title}</h3>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 h-8 w-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.15] flex items-center justify-center text-sm font-semibold transition-all active:scale-95"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

export const QRCard: React.FC<{ code: string }> = ({ code }) => {
  const joinUrl = `${window.location.origin}/join/${code}`;
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel dark:bg-[#0F172A] dark:border-slate-800 p-7 flex flex-col items-center gap-5 text-center shadow-glass">
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <QRCodeSVG size={200} value={joinUrl} />
      </div>
      <div className="w-full">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Xona kodi</p>
        <p className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-slate-900 dark:text-white mt-1">{code}</p>
        <button
          onClick={copyLink}
          className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-[0.97] transition-all font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Havola nusxalandi!" : "Havolani nusxalash"}</span>
        </button>
      </div>
    </div>
  );
};

export const SyncedTimer: React.FC<{ startedAt?: string | null; durationSec: number; status: string }> = ({
  startedAt,
  durationSec,
  status,
}) => {
  const calculateRemaining = useCallback(() => {
    if (!startedAt || status !== "live") return durationSec;
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, durationSec - elapsed);
  }, [startedAt, durationSec, status]);

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    if (!startedAt || status !== "live") {
      return;
    }
    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      setRemaining(Math.max(0, durationSec - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, durationSec, status]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const isUrgent = remaining <= 60 && status === "live";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-sm font-semibold transition-all ${
        isUrgent
          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 animate-pulse"
          : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 shadow-sm"
      }`}
    >
      <Clock className={`w-4 h-4 ${isUrgent ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`} />
      <span>
        {mins}:{secs}
      </span>
    </div>
  );
};

// VS Code Styled File Tab Bar
export const VsCodeTabs: React.FC<{
  activeTab: "html" | "css" | "js";
  onChangeTab: (tab: "html" | "css" | "js") => void;
  isDirtyHtml?: boolean;
  isDirtyCss?: boolean;
  isDirtyJs?: boolean;
  onFormat?: () => void;
  onReset?: () => void;
}> = ({ activeTab, onChangeTab, isDirtyHtml, isDirtyCss, isDirtyJs, onFormat, onReset }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 bg-slate-100/60 dark:bg-zinc-900/90 px-3 pt-2 select-none overflow-x-auto">
      <div className="flex items-center gap-1.5 shrink-0">
        {/* index.html Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("html");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-sm font-mono rounded-t-xl transition-all active:scale-[0.98] ${
            activeTab === "html"
              ? "bg-white dark:bg-[#18181b] text-slate-900 dark:text-white font-bold border-t-2 border-t-[#e44d26] border-x border-slate-200 dark:border-zinc-700 shadow-sm"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="text-[#e44d26] font-bold text-sm">‹›</span>
          <span>index.html</span>
          {isDirtyHtml && <span className="h-2 w-2 rounded-full bg-amber-500 ml-1" title="O'zgartirilgan" />}
        </button>

        {/* style.css Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("css");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-sm font-mono rounded-t-xl transition-all active:scale-[0.98] ${
            activeTab === "css"
              ? "bg-white dark:bg-[#18181b] text-slate-900 dark:text-white font-bold border-t-2 border-t-[#264de4] border-x border-slate-200 dark:border-zinc-700 shadow-sm"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="text-[#264de4] font-bold text-sm">#</span>
          <span>style.css</span>
          {isDirtyCss && <span className="h-2 w-2 rounded-full bg-amber-500 ml-1" title="O'zgartirilgan" />}
        </button>

        {/* script.js Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("js");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 text-sm font-mono rounded-t-xl transition-all active:scale-[0.98] ${
            activeTab === "js"
              ? "bg-white dark:bg-[#18181b] text-slate-900 dark:text-white font-bold border-t-2 border-t-[#f7df1e] border-x border-slate-200 dark:border-zinc-700 shadow-sm"
              : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="text-[#eab308] font-black text-xs px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700">JS</span>
          <span>script.js</span>
          {isDirtyJs && <span className="h-2 w-2 rounded-full bg-amber-500 ml-1" title="O'zgartirilgan" />}
        </button>
      </div>

      <div className="flex items-center gap-2 pb-1.5 shrink-0">
        {onFormat && (
          <button
            onClick={() => {
              sounds.playClick();
              onFormat();
            }}
            title="Kodni formatlash (Shift+Alt+F)"
            className="text-xs font-mono font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 shadow-sm active:scale-[0.96] transition-all inline-flex items-center gap-1.5"
          >
            <AlignLeft className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            <span>Formatlash</span>
          </button>
        )}
        {onReset && (
          <button
            onClick={() => {
              sounds.playClick();
              onReset();
            }}
            title="Kodni boshlang'ich holatga qaytarish"
            className="text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1.5 rounded-lg transition-all"
          >
            Qaytarish
          </button>
        )}
      </div>
    </div>
  );
};

// VS Code Styled Status Bar
export const VsCodeStatusBar: React.FC<{
  cursorPos?: { line: number; col: number };
  activeTab: "html" | "css" | "js";
  testCount?: number;
  passedCount?: number;
}> = ({ cursorPos = { line: 1, col: 1 }, activeTab, testCount = 0, passedCount = 0 }) => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-100/90 dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 font-mono select-none">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-medium">
          <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>O'zing Yoz v2.6</span>
        </span>
        <span className="text-slate-300 dark:text-zinc-700">|</span>
        <span className={passedCount === testCount && testCount > 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "font-medium"}>
          Testlar: {passedCount}/{testCount} o'tdi
        </span>
      </div>

      <div className="flex items-center gap-3 font-medium">
        <span>
          Qat {cursorPos.line}, Ust {cursorPos.col}
        </span>
        <span className="text-slate-300 dark:text-zinc-700">|</span>
        <span>Bo'shliq: 2</span>
        <span className="text-slate-300 dark:text-zinc-700">|</span>
        <span>UTF-8</span>
        <span className="text-slate-300 dark:text-zinc-700">|</span>
        <span className="font-bold uppercase text-slate-900 dark:text-white">
          {activeTab === "html" ? "HTML" : activeTab === "css" ? "CSS" : "JavaScript"}
        </span>
      </div>
    </div>
  );
};
