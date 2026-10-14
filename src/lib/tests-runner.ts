export interface ChallengeAssertion {
  type: "exists" | "count" | "text" | "style" | "attr";
  selector: string;
  op?: "==" | "!=" | ">=" | "<=";
  value?: string | number;
  contains?: string;
  property?: string;
  name?: string;
  exists?: boolean;
  label: string;
}

export interface AssertionResult {
  label: string;
  passed: boolean;
}

export function buildSandboxedSrcDoc(html: string, css: string, tests: ChallengeAssertion[]): string {
  const serializedTests = JSON.stringify(tests || []);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    window.addEventListener("message", function(event) {
      if (!event.data || event.data.type !== "RUN_TESTS") return;
      const tests = ${serializedTests};
      const results = tests.map(function(t) {
        try {
          const els = document.querySelectorAll(t.selector);
          const el = els[0];
          let passed = false;

          if (t.type === "exists") {
            passed = els.length > 0;
          } else if (t.type === "count") {
            const count = els.length;
            const target = Number(t.value || 0);
            if (t.op === ">=") passed = count >= target;
            else if (t.op === "<=") passed = count <= target;
            else passed = count === target;
          } else if (t.type === "text") {
            const txt = el ? (el.textContent || "").toLowerCase() : "";
            passed = txt.includes(String(t.contains || "").toLowerCase());
          } else if (t.type === "style") {
            if (!el) passed = false;
            else {
              const comp = window.getComputedStyle(el).getPropertyValue(t.property || "").trim();
              if (t.op === "!=") passed = comp !== String(t.value) && comp !== "";
              else passed = comp === String(t.value);
            }
          } else if (t.type === "attr") {
            if (!el) passed = false;
            else {
              const hasAttr = el.hasAttribute(t.name || "") && (el.getAttribute(t.name || "") || "").trim().length > 0;
              passed = t.exists ? hasAttr : !hasAttr;
            }
          }
          return { label: t.label, passed: Boolean(passed) };
        } catch (err) {
          return { label: t.label, passed: false };
        }
      });
      parent.postMessage({ type: "TEST_RESULTS", results: results }, "*");
    });
  </script>
</body>
</html>`;
}
