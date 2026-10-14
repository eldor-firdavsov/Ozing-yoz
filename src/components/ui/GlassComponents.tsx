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
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };
  return (
    <div
      onClick={() => sounds.playClick()}
      className={`inline-flex items-center gap-1.5 font-mono font-semibold tracking-tight text-slate-900 select-none cursor-pointer ${sizeClasses[size]}`}
    >
      <span className="bg-gradient-to-r from-slate-950 to-slate-700 bg-clip-text text-transparent">
        O'zing Yoz
      </span>
      <span className="text-[#65A30D] animate-pulse">▍</span>
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
    <div className="glass-card p-4 space-y-2.5 border-l-4 border-l-slate-800 shadow-sm transition-all hover:shadow-glass">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-md border font-medium ${badgeColors[level] || badgeColors[1]}`}>
            {level}-daraja
          </span>
          {concept && (
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
              #{concept}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {line && (
            <button
              onClick={() => onNavigateLine?.(line)}
              title="Koddagi ushbu qatorga o'tish"
              className="font-mono text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 transition-all"
            >
              <span>{line}-qator</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {level === 4 && (
            <button
              onClick={handleCopy}
              className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-xs"
            >
              {copied ? <Check className="w-3 h-3 text-lime-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Nusxalandi" : "Nusxa"}</span>
            </button>
          )}
          {fromFallback && <span className="text-slate-400 text-[10px]">Standart maslahat</span>}
        </div>
      </div>
      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans font-normal selection:bg-lime-200">
        {displayed}
      </p>
    </div>
  );
};

export const TestChecklistItem: React.FC<{ label: string; passed?: boolean }> = ({ label, passed }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
      passed === true
        ? "bg-lime-50/90 border-lime-300 text-slate-900 font-medium shadow-xs"
        : passed === false
        ? "bg-rose-50/80 border-rose-200 text-slate-800"
        : "bg-white/70 border-slate-200/80 text-slate-600"
    }`}
  >
    {passed === true ? (
      <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
    ) : passed === false ? (
      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
    ) : (
      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel max-w-md w-full p-6 space-y-4 shadow-glass-lg border border-white/90 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
          <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all"
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
    <div className="glass-panel p-6 flex flex-col items-center gap-4 text-center shadow-glass">
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <QRCodeSVG size={180} value={joinUrl} />
      </div>
      <div className="w-full">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Xona kodi</p>
        <p className="font-mono text-3xl font-bold tracking-widest text-slate-900 mt-0.5">{code}</p>
        <button
          onClick={copyLink}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:bg-white transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
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
    <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/60 px-2 pt-1.5 select-none">
      <div className="flex items-center gap-1">
        {/* index.html Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("html");
          }}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all ${
            activeTab === "html"
              ? "bg-white text-slate-900 font-semibold border-t-2 border-t-[#e44d26] border-x border-slate-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-800"
          }`}
        >
          <span className="text-[#e44d26] font-bold text-xs">‹›</span>
          <span>index.html</span>
          {isDirtyHtml && <span className="h-1.5 w-1.5 rounded-full bg-slate-400 ml-1" title="O'zgartirilgan" />}
        </button>

        {/* style.css Tab */}
        <button
          onClick={() => {
            sounds.playClick();
            onChangeTab("css");
          }}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all ${
            activeTab === "css"
              ? "bg-white text-slate-900 font-semibold border-t-2 border-t-[#264de4] border-x border-slate-200 shadow-xs"
              : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-800"
          }`}
        >
          <span className="text-[#264de4] font-bold text-xs">#</span>
          <span>style.css</span>
          {isDirtyCss && <span className="h-1.5 w-1.5 rounded-full bg-slate-400 ml-1" title="O'zgartirilgan" />}
        </button>
      </div>

      <div className="flex items-center gap-2 pb-1">
        {onFormat && (
          <button
            onClick={() => {
              sounds.playClick();
              onFormat();
            }}
            title="Kodni formatlash (Shift+Alt+F)"
            className="text-[11px] font-mono text-slate-500 hover:text-slate-900 hover:bg-white px-2 py-1 rounded border border-transparent hover:border-slate-200 transition-all inline-flex items-center gap-1"
          >
            <AlignLeft className="w-3.5 h-3.5 text-slate-500" />
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
            className="text-[11px] text-slate-500 hover:text-rose-600 px-2 py-1 rounded transition-all"
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
    <div className="flex items-center justify-between px-3 py-1 bg-slate-100/80 border-t border-slate-200/80 text-[11px] text-slate-600 font-mono select-none">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-slate-700">
          <Terminal className="w-3 h-3 text-lime-700" />
          <span>O'zing Yoz v2.6</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className={passedCount === testCount && testCount > 0 ? "text-lime-700 font-semibold" : ""}>
          Testlar: {passedCount}/{testCount} o'tdi
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span>
          Qat {cursorPos.line}, Ust {cursorPos.col}
        </span>
        <span className="text-slate-300">|</span>
        <span>Bo'shliq: 2</span>
        <span className="text-slate-300">|</span>
        <span>UTF-8</span>
        <span className="text-slate-300">|</span>
        <span className="font-semibold uppercase text-slate-800">{activeTab}</span>
      </div>
    </div>
  );
};
