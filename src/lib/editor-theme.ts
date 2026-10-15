import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// VS Code Light+ Syntax Highlight Styles
export const vsCodeLightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#0000ff", fontWeight: "600" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#001080" },
  { tag: [t.variableName, t.labelName], color: "#001080" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#0070c1" },
  { tag: [t.definition(t.name), t.separator], color: "#000000" },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: "#098658" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "#383838" },
  { tag: [t.meta, t.comment], color: "#008000", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#0000ff", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#0000ff" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#0000ff" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#a31515" },
  { tag: t.invalid, color: "#cd3131" },
  // HTML / CSS specific tags
  { tag: t.tagName, color: "#800000", fontWeight: "600" },
  { tag: t.attributeName, color: "#e50000" },
  { tag: t.attributeValue, color: "#0000ff" },
  { tag: t.angleBracket, color: "#800000" },
]);

// VS Code Light Glassmorphic Editor Theme
export const vsCodeTheme = EditorView.theme(
  {
    "&": {
      color: "#1e293b",
      backgroundColor: "transparent",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
      fontSize: "15px",
      letterSpacing: "0.2px",
      fontVariantLigatures: "contextual",
      fontFeatureSettings: "'liga' 1, 'calt' 1",
    },
    ".cm-content": {
      padding: "12px 0",
      caretColor: "#0f172a",
      lineHeight: "1.75",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#0f172a",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#b4d8fd !important",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#e0f2fe",
      outline: "1px solid #7dd3fc",
    },
    ".cm-gutters": {
      backgroundColor: "rgba(248, 250, 252, 0.65)",
      color: "#94a3b8",
      borderRight: "1px solid rgba(226, 232, 240, 0.8)",
      paddingRight: "6px",
      minWidth: "42px",
    },
    ".cm-gutterElement": {
      padding: "0 8px 0 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(241, 245, 249, 0.55)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(226, 232, 240, 0.6)",
      color: "#0f172a",
      fontWeight: "700",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(163, 230, 53, 0.25)",
      outline: "1px solid #84cc16",
      color: "#0f172a !important",
      fontWeight: "bold",
    },
    ".cm-nonmatchingBracket": {
      backgroundColor: "#fee2e2",
      outline: "1px solid #ef4444",
      color: "#b91c1c !important",
    },
    // Autocompletion Tooltip (VS Code IntelliSense style)
    ".cm-tooltip": {
      border: "1px solid rgba(203, 213, 225, 0.9)",
      borderRadius: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      overflow: "hidden",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul": {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        maxHeight: "220px",
      },
      "& > ul > li": {
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      "& > ul > li[aria-selected]": {
        backgroundColor: "#e0f2fe",
        color: "#0284c7",
        fontWeight: "600",
      },
    },
    ".cm-completionIcon": {
      width: "14px",
      height: "14px",
      opacity: "0.85",
      marginRight: "4px",
    },
    ".cm-completionLabel": {
      flex: 1,
    },
    ".cm-completionDetail": {
      fontSize: "11px",
      color: "#64748b",
      fontStyle: "italic",
    },
  },
  { dark: false }
);

// VS Code Dark+ Syntax Highlight Styles
export const vsCodeDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "#c586c0", fontWeight: "600" },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: "#9cdcfe" },
  { tag: [t.variableName, t.labelName], color: "#9cdcfe" },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: "#4fc1ff" },
  { tag: [t.definition(t.name), t.separator], color: "#d4d4d4" },
  { tag: [t.typeName, t.className, t.annotation, t.modifier, t.self, t.namespace], color: "#4ec9b0" },
  { tag: t.number, color: "#b5cea8" },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: "#d4d4d4" },
  { tag: [t.meta, t.comment], color: "#6a9955", fontStyle: "italic" },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: "#3794ff", textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: "#4fc1ff" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#569cd6" },
  { tag: [t.processingInstruction, t.string, t.inserted], color: "#ce9178" },
  { tag: t.invalid, color: "#f44747" },
  // HTML / CSS specific tags
  { tag: t.tagName, color: "#569cd6", fontWeight: "600" },
  { tag: t.attributeName, color: "#9cdcfe" },
  { tag: t.attributeValue, color: "#ce9178" },
  { tag: t.angleBracket, color: "#808080" },
]);

export const vsCodeDarkTheme = EditorView.theme(
  {
    "&": {
      color: "#d4d4d4",
      backgroundColor: "transparent",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: "15px",
      letterSpacing: "0.2px",
      fontVariantLigatures: "contextual",
    },
    ".cm-content": {
      padding: "12px 0",
      caretColor: "#ffffff",
      lineHeight: "1.75",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#ffffff",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#264f78 !important",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#3a3d41",
      outline: "1px solid #515c6a",
    },
    ".cm-gutters": {
      backgroundColor: "#18181b",
      color: "#71717a",
      borderRight: "1px solid #27272a",
      paddingRight: "6px",
      minWidth: "42px",
    },
    ".cm-gutterElement": {
      padding: "0 8px 0 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(255, 255, 255, 0.04)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      color: "#ffffff",
      fontWeight: "700",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(16, 185, 129, 0.25)",
      outline: "1px solid #10b981",
      color: "#ffffff !important",
      fontWeight: "bold",
    },
  },
  { dark: true }
);

export const vsCodeExtension: Extension = [
  vsCodeTheme,
  syntaxHighlighting(vsCodeLightHighlightStyle),
];

export const vsCodeDarkExtension: Extension = [
  vsCodeDarkTheme,
  syntaxHighlighting(vsCodeDarkHighlightStyle),
];

export const getVsCodeExtension = (isDark: boolean): Extension => {
  return isDark ? vsCodeDarkExtension : vsCodeExtension;
};
