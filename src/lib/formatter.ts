// Lightweight, pure TypeScript HTML & CSS Beautifier for VS Code-like Format Document

export function formatHtml(html: string): string {
  const tab = "  ";
  let result = "";
  let indent = 0;

  // Normalize spaces between tags
  const tokens = html
    .replace(/>\s*</g, "><")
    .replace(/</g, "~#~<")
    .replace(/>/g, ">~#~")
    .split("~#~")
    .map((s) => s.trim())
    .filter(Boolean);

  const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr"
  ]);

  for (const token of tokens) {
    if (token.startsWith("</")) {
      indent = Math.max(0, indent - 1);
      result += tab.repeat(indent) + token + "\n";
    } else if (token.startsWith("<") && !token.startsWith("<!") && !token.endsWith("/>")) {
      const tagNameMatch = token.match(/<([a-zA-Z0-9-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";
      const isSelfClosing = voidTags.has(tagName) || token.endsWith("/>");

      result += tab.repeat(indent) + token + "\n";
      if (!isSelfClosing) {
        indent += 1;
      }
    } else if (token.startsWith("<!--")) {
      result += tab.repeat(indent) + token + "\n";
    } else {
      result += tab.repeat(indent) + token + "\n";
    }
  }

  return result.trim();
}

export function formatCss(css: string): string {
  const tab = "  ";
  let result = "";
  let indent = 0;

  // Clean extra spaces around braces and semicolons
  let cleaned = css
    .replace(/\s*\{\s*/g, " {\n")
    .replace(/\s*;\s*/g, ";\n")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/\n{2,}/g, "\n");

  const lines = cleaned.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const rawLine of lines) {
    let line = rawLine;
    if (line.includes(":") && !line.includes("{") && !line.includes("url(")) {
      const colonIdx = line.indexOf(":");
      const prop = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 1).trim();
      line = `${prop}: ${val}`;
    }
    if (line.includes("}")) {
      indent = Math.max(0, indent - 1);
    }
    result += tab.repeat(indent) + line + "\n";
    if (line.includes("{")) {
      indent += 1;
    }
  }

  return result.trim();
}
