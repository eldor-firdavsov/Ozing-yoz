export interface ChallengeAssertion {
  type: "exists" | "count" | "text" | "style" | "attr" | "click_text" | "click_class" | "js_eval";
  selector?: string;
  targetSelector?: string;
  op?: "==" | "!=" | ">=" | "<=" | "includes";
  value?: string | number | boolean;
  contains?: string;
  property?: string;
  className?: string;
  name?: string;
  exists?: boolean;
  expr?: string;
  label: string;
}

export interface AssertionResult {
  label: string;
  passed: boolean;
}

export function buildSandboxedSrcDoc(
  html: string,
  css: string,
  tests: ChallengeAssertion[],
  js: string = ""
): string {
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
    try {
      ${js}
    } catch (e) {
      console.warn("User JS error:", e);
    }
  </script>
  <script>
    window.addEventListener("message", function(event) {
      if (!event.data || event.data.type !== "RUN_TESTS") return;
      const tests = ${serializedTests};
      const results = tests.map(function(t) {
        try {
          const els = t.selector ? document.querySelectorAll(t.selector) : [];
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
              else if (t.op === "includes") passed = comp.includes(String(t.value));
              else passed = comp === String(t.value);
            }
          } else if (t.type === "attr") {
            if (!el) passed = false;
            else {
              const hasAttr = el.hasAttribute(t.name || "") && (el.getAttribute(t.name || "") || "").trim().length > 0;
              passed = t.exists ? hasAttr : !hasAttr;
            }
          } else if (t.type === "click_text") {
            if (el) {
              el.click();
            }
            const targetEl = t.targetSelector ? document.querySelector(t.targetSelector) : el;
            const txt = targetEl ? (targetEl.textContent || "").toLowerCase() : "";
            passed = txt.includes(String(t.contains || t.value || "").toLowerCase());
          } else if (t.type === "click_class") {
            if (el) {
              el.click();
            }
            const targetEl = t.targetSelector ? document.querySelector(t.targetSelector) : el;
            const cls = String(t.className || t.value || "");
            passed = targetEl ? targetEl.classList.contains(cls) : false;
          } else if (t.type === "js_eval") {
            passed = Boolean(eval(t.expr || "false"));
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
