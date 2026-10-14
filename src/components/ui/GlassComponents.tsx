import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Volume2,
  VolumeX,
  Copy,
  Check,
  FileCode2,
  AlignLeft,
  Terminal,
  ExternalLink,
  ChevronRight,
  Code
} from "lucide-react";
import { sounds } from "../../lib/audio";

export const BrandLogo: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
  };
  const iconSizes = {
    sm: "w-7 h-7 text-xs rounded-xl",
    md: "w-9 h-9 text-sm rounded-2xl",
    lg: "w-12 h-12 text-base rounded-2xl",
  };
  return (
    <div
      onClick={() => sounds.playClick()}
      className="inline-flex items-center gap-2.5 font-display font-black tracking-tight select-none cursor-pointer group"
    >
      <div className={`${iconSizes[size]} bg-[#58CC02] border-b-4 border-[#46A302] flex items-center justify-center text-white font-black shadow-xs group-hover:scale-105 group-active:translate-y-0.5 transition-all`}>
        OY
      </div>
      <span className={`${sizeClasses[size]} text-[#58CC02] font-black tracking-tight`}>
        O'zing Yoz
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
      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all"
    >
      {enabled ? <Volume2 className="w-4 h-4 text-lime-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
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
  const [displayed, setDisplayed] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayed("");
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
              className="text-xs text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-xs font-bold"
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
      <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center shrink-0 shadow-xs">
        <Check className="w-4 h-4 stroke-[3]" />
      </div>
    ) : passed === false ? (
      <div className="w-6 h-6 rounded-full bg-[#FF4B4B] text-white flex items-center justify-center shrink-0 shadow-xs">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel max-w-xl w-full p-7 space-y-5 shadow-glass-lg border border-white/90 rounded-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3.5">
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg transition-all"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
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
    <div className="glass-panel p-7 flex flex-col items-center gap-5 text-center shadow-glass">
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <QRCodeSVG size={200} value={joinUrl} />
      </div>
      <div className="w-full">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Xona kodi</p>
        <p className="font-mono text-4xl sm:text-5xl font-black tracking-widest text-slate-900 mt-1">{code}</p>
        <button
          onClick={copyLink}
          className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all font-medium"
        >
          {copied ? <Check className="w-4 h-4 text-lime-600" /> : <Copy className="w-4 h-4" />}
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
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => {
    if (!startedAt || status !== "live") {
      setRemaining(durationSec);
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
          ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
          : "bg-white/80 border-slate-200 text-slate-900 shadow-xs"
      }`}
    >
      <Clock className={`w-4 h-4 ${isUrgent ? "text-rose-600" : "text-lime-600"}`} />
      <span>
        {mins}:{secs}
      </span>
    </div>
  );
};

// VS Code Styled File Tab Bar
export const VsCodeTabs: React.FC<{
  activeTab: "html" | "css";
  onChangeTab: (tab: "html" | "css") => void;
  isDirtyHtml?: boolean;
  isDirtyCss?: boolean;
  onFormat?: () => void;
  onReset?: () => void;
}> = ({ activeTab, onChangeTab, isDirtyHtml, isDirtyCss, onFormat, onReset }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/60 px-3 pt-2 select-none">
      <div className="flex items-center gap-1.5">
        {/* index.html Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("html");
          }}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-mono rounded-t-xl transition-all ${
            activeTab === "html"
              ? "bg-white text-slate-900 font-bold border-t-2 border-t-[#e44d26] border-x border-slate-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
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
          className={`flex items-center gap-2 px-4 py-2 text-sm font-mono rounded-t-xl transition-all ${
            activeTab === "css"
              ? "bg-white text-slate-900 font-bold border-t-2 border-t-[#264de4] border-x border-slate-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
          }`}
        >
          <span className="text-[#264de4] font-bold text-sm">#</span>
          <span>style.css</span>
          {isDirtyCss && <span className="h-2 w-2 rounded-full bg-amber-500 ml-1" title="O'zgartirilgan" />}
        </button>
      </div>

      <div className="flex items-center gap-2 pb-1.5">
        {onFormat && (
          <button
            onClick={() => {
              sounds.playClick();
              onFormat();
            }}
            title="Kodni formatlash (Shift+Alt+F)"
            className="text-xs font-mono font-medium text-slate-600 hover:text-slate-900 hover:bg-white px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 shadow-xs transition-all inline-flex items-center gap-1.5"
          >
            <AlignLeft className="w-4 h-4 text-slate-500" />
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
            className="text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg transition-all"
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
  activeTab: "html" | "css";
  testCount?: number;
  passedCount?: number;
}> = ({ cursorPos = { line: 1, col: 1 }, activeTab, testCount = 0, passedCount = 0 }) => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-slate-100/90 border-t border-slate-200/80 text-xs text-slate-600 font-mono select-none">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-slate-800 font-medium">
          <Terminal className="w-3.5 h-3.5 text-lime-700" />
          <span>O'zing Yoz v2.6</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className={passedCount === testCount && testCount > 0 ? "text-lime-700 font-bold" : "font-medium"}>
          Testlar: {passedCount}/{testCount} o'tdi
        </span>
      </div>

      <div className="flex items-center gap-3 font-medium">
        <span>
          Qat {cursorPos.line}, Ust {cursorPos.col}
        </span>
        <span className="text-slate-300">|</span>
        <span>Bo'shliq: 2</span>
        <span className="text-slate-300">|</span>
        <span>UTF-8</span>
        <span className="text-slate-300">|</span>
        <span className="font-bold uppercase text-slate-900">{activeTab}</span>
      </div>
    </div>
  );
};
