import {
  autocompletion,
  completeAnyWord,
  snippetCompletion,
  CompletionContext,
  CompletionResult,
  Completion,
} from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";

// 1. JAVASCRIPT COMPLETIONS
// Member completions triggered after dot (e.g. document., el., btn., list.)
const jsMemberCompletions: Completion[] = [
  // Document members
  snippetCompletion('getElementById("${1:id}")', {
    label: "getElementById",
    detail: "ID orqali element olish",
    type: "method",
    boost: 10,
  }),
  snippetCompletion('querySelector("${1:selector}")', {
    label: "querySelector",
    detail: "CSS selektor orqali bitta element",
    type: "method",
    boost: 9,
  }),
  snippetCompletion('querySelectorAll("${1:selector}")', {
    label: "querySelectorAll",
    detail: "CSS selektor orqali barcha elementlar",
    type: "method",
    boost: 8,
  }),
  snippetCompletion('createElement("${1:tag}")', {
    label: "createElement",
    detail: "Yangi HTML element yaratish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("body", {
    label: "body",
    detail: "Hujjatning body elementi",
    type: "property",
    boost: 6,
  }),

  // Element Events & Listeners
  snippetCompletion('addEventListener("${1:click}", (e) => {\n  ${2}\n});', {
    label: "addEventListener",
    detail: "Hodisa tinglovchi qo'shish (click, submit, input)",
    type: "method",
    boost: 10,
  }),
  snippetCompletion('removeEventListener("${1:click}", ${2:handler});', {
    label: "removeEventListener",
    detail: "Hodisa tinglovchini o'chirish",
    type: "method",
    boost: 4,
  }),

  // ClassList manipulation
  snippetCompletion('classList.add("${1:className}")', {
    label: "classList.add",
    detail: "CSS klass qo'shish",
    type: "method",
    boost: 9,
  }),
  snippetCompletion('classList.remove("${1:className}")', {
    label: "classList.remove",
    detail: "CSS klassni o'chirish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion('classList.toggle("${1:className}")', {
    label: "classList.toggle",
    detail: "CSS klassni almashtirish (toggle)",
    type: "method",
    boost: 8,
  }),
  snippetCompletion('classList.contains("${1:className}")', {
    label: "classList.contains",
    detail: "CSS klass borligini tekshirish (true/false)",
    type: "method",
    boost: 7,
  }),

  // Content & Values
  snippetCompletion('textContent = ${1:""};', {
    label: "textContent",
    detail: "Element matnini o'qish yoki o'zgartirish",
    type: "property",
    boost: 9,
  }),
  snippetCompletion('innerText = ${1:""};', {
    label: "innerText",
    detail: "Element ichidagi ko'rinuvchi matn",
    type: "property",
    boost: 7,
  }),
  snippetCompletion('innerHTML = ${1:""};', {
    label: "innerHTML",
    detail: "Element ichiga HTML qo'yish",
    type: "property",
    boost: 7,
  }),
  snippetCompletion("value", {
    label: "value",
    detail: "Input, select yoki forma maydoni qiymati",
    type: "property",
    boost: 9,
  }),

  // Styles
  snippetCompletion('style.color = "${1:red}";', {
    label: "style.color",
    detail: "Matn rangini o'zgartirish",
    type: "property",
    boost: 8,
  }),
  snippetCompletion('style.backgroundColor = "${1:#38bdf8}";', {
    label: "style.backgroundColor",
    detail: "Fon rangini o'zgartirish",
    type: "property",
    boost: 8,
  }),
  snippetCompletion('style.display = "${1:flex}";', {
    label: "style.display",
    detail: "Ko'rinish turini o'zgartirish (flex, grid, block, none)",
    type: "property",
    boost: 8,
  }),
  snippetCompletion('style.fontSize = "${1:16px}";', {
    label: "style.fontSize",
    detail: "Shrift hajmini o'zgartirish",
    type: "property",
    boost: 7,
  }),
  snippetCompletion('style.borderColor = "${1:#10b981}";', {
    label: "style.borderColor",
    detail: "Chegara rangini o'zgartirish",
    type: "property",
    boost: 7,
  }),

  // DOM node methods
  snippetCompletion('setAttribute("${1:name}", "${2:value}")', {
    label: "setAttribute",
    detail: "Atribut qiymatini belgilash",
    type: "method",
    boost: 6,
  }),
  snippetCompletion('getAttribute("${1:name}")', {
    label: "getAttribute",
    detail: "Atribut qiymatini olish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion('removeAttribute("${1:name}")', {
    label: "removeAttribute",
    detail: "Atributni olib tashlash",
    type: "method",
    boost: 5,
  }),
  snippetCompletion("appendChild(${1:child})", {
    label: "appendChild",
    detail: "Ichiga yangi element qo'shish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("remove()", {
    label: "remove",
    detail: "Elementni DOMdan o'chirish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("focus()", {
    label: "focus",
    detail: "Elementga fokus berish",
    type: "method",
    boost: 5,
  }),
  snippetCompletion("blur()", {
    label: "blur",
    detail: "Elementdan fokusni olish",
    type: "method",
    boost: 4,
  }),

  // Event object
  snippetCompletion("preventDefault()", {
    label: "preventDefault",
    detail: "Standart brauzer xatti-harakatini to'xtatish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("stopPropagation()", {
    label: "stopPropagation",
    detail: "Hodisa ko'tarilishini to'xtatish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("target", {
    label: "target",
    detail: "Hodisa sodir bo'lgan element",
    type: "property",
    boost: 8,
  }),
  snippetCompletion("target.value", {
    label: "target.value",
    detail: "Hodisa sodir bo'lgan input qiymati",
    type: "property",
    boost: 8,
  }),

  // Console members
  snippetCompletion("log(${1:value});", {
    label: "log",
    detail: "Konsolga xabar chiqarish",
    type: "method",
    boost: 9,
  }),
  snippetCompletion("error(${1:error});", {
    label: "error",
    detail: "Konsolga xatolik chiqarish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("warn(${1:warning});", {
    label: "warn",
    detail: "Konsolga ogohlantirish chiqarish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("table(${1:data});", {
    label: "table",
    detail: "Konsolda jadval ko'rinishida chiqarish",
    type: "method",
    boost: 6,
  }),

  // Math members
  snippetCompletion("floor(${1:val})", {
    label: "floor",
    detail: "Sonni pastga qarab yaxlitlash",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("random()", {
    label: "random",
    detail: "0 dan 1 gacha tasodifiy son hosil qilish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("round(${1:val})", {
    label: "round",
    detail: "Sonni eng yaqin butun songa yaxlitlash",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("ceil(${1:val})", {
    label: "ceil",
    detail: "Sonni yuqoriga qarab yaxlitlash",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("max(${1:a}, ${2:b})", {
    label: "max",
    detail: "Berilgan sonlardan eng kattasini topish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("min(${1:a}, ${2:b})", {
    label: "min",
    detail: "Berilgan sonlardan eng kichigini topish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("abs(${1:val})", {
    label: "abs",
    detail: "Sonning mutlaq qiymati (modul)",
    type: "method",
    boost: 5,
  }),

  // Array & String methods
  snippetCompletion("push(${1:item});", {
    label: "push",
    detail: "Massiv oxiriga element qo'shish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("pop()", {
    label: "pop",
    detail: "Massiv oxirgi elementini sug'urib olish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("shift()", {
    label: "shift",
    detail: "Massiv birinchi elementini sug'urib olish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("unshift(${1:item});", {
    label: "unshift",
    detail: "Massiv boshiga element qo'shish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("map((${1:item}) => ${2:item});", {
    label: "map",
    detail: "Har bir elementni o'zgartirib yangi massiv qaytaradi",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("filter((${1:item}) => ${2:condition});", {
    label: "filter",
    detail: "Shartga mos elementlardan yangi massiv tuzadi",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("forEach((${1:item}) => {\n  ${2}\n});", {
    label: "forEach",
    detail: "Har bir element bo'yicha sikl bilan aylanish",
    type: "method",
    boost: 8,
  }),
  snippetCompletion("find((${1:item}) => ${2:condition});", {
    label: "find",
    detail: "Shartga mos birinchi elementni topadi",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("includes(${1:item})", {
    label: "includes",
    detail: "Massivda yoki matnda element borligini tekshirish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion('join("${1:, }")', {
    label: "join",
    detail: "Massiv elementlarini matnga birlashtiradi",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("length", {
    label: "length",
    detail: "Massiv yoki matn uzunligi",
    type: "property",
    boost: 8,
  }),
  snippetCompletion("trim()", {
    label: "trim",
    detail: "Matn boshi va oxiridagi bo'shliqlarni tozalash",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("toLowerCase()", {
    label: "toLowerCase",
    detail: "Kichik harflarga o'tkazish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion("toUpperCase()", {
    label: "toUpperCase",
    detail: "Katta harflarga o'tkazish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion('split("${1: }")', {
    label: "split",
    detail: "Matnni bo'laklarga ajratib massiv hosil qilish",
    type: "method",
    boost: 7,
  }),
  snippetCompletion('replace("${1:from}", "${2:to}")', {
    label: "replace",
    detail: "Matnning birinchi mos qismini almashtirish",
    type: "method",
    boost: 6,
  }),
  snippetCompletion("toString()", {
    label: "toString",
    detail: "Qiymatni matnga (string) aylantirish",
    type: "method",
    boost: 6,
  }),
];

// Root JavaScript globals, keywords, and statements
const jsRootCompletions: Completion[] = [
  // Document globals
  snippetCompletion('document.getElementById("${1:id}")', {
    label: "document.getElementById",
    detail: "ID orqali elementni topish",
    type: "function",
    boost: 10,
  }),
  snippetCompletion('document.querySelector("${1:selector}")', {
    label: "document.querySelector",
    detail: "CSS selektor orqali birinchi elementni topish",
    type: "function",
    boost: 9,
  }),
  snippetCompletion('document.querySelectorAll("${1:selector}")', {
    label: "document.querySelectorAll",
    detail: "CSS selektor orqali barcha elementlarni topish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion('document.createElement("${1:tag}")', {
    label: "document.createElement",
    detail: "Yangi HTML element yaratish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("document.body", {
    label: "document.body",
    detail: "HTML body elementi",
    type: "variable",
    boost: 7,
  }),

  // Console
  snippetCompletion("console.log(${1:value});", {
    label: "console.log",
    detail: "Konsolga xabar chiqarish",
    type: "function",
    boost: 10,
  }),
  snippetCompletion("console.error(${1:error});", {
    label: "console.error",
    detail: "Konsolga xatolik chiqarish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("console.warn(${1:warning});", {
    label: "console.warn",
    detail: "Konsolga ogohlantirish chiqarish",
    type: "function",
    boost: 7,
  }),
  snippetCompletion("console.table(${1:data});", {
    label: "console.table",
    detail: "Konsolda jadval ko'rinishida chiqarish",
    type: "function",
    boost: 6,
  }),

  // Dialogs & I/O
  snippetCompletion('prompt("${1:Savolni kiriting:}")', {
    label: "prompt",
    detail: "Foydalanuvchidan matn so'rash dialog oynasi",
    type: "function",
    boost: 10,
  }),
  snippetCompletion('confirm("${1:Ishonchingiz komilmi?}")', {
    label: "confirm",
    detail: "Tasdiqlash oynasi (Ha / Yo'q -> true/false)",
    type: "function",
    boost: 9,
  }),
  snippetCompletion('alert("${1:Xabar}")', {
    label: "alert",
    detail: "Ogohlantirish dialog oynasi",
    type: "function",
    boost: 8,
  }),

  // Type Conversions
  snippetCompletion("Number(${1:val})", {
    label: "Number",
    detail: "Son turiga o'tkazish",
    type: "function",
    boost: 9,
  }),
  snippetCompletion("parseInt(${1:str}, 10)", {
    label: "parseInt",
    detail: "Butun songa o'tkazish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("parseFloat(${1:str})", {
    label: "parseFloat",
    detail: "O'nlik kasr songa o'tkazish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("String(${1:val})", {
    label: "String",
    detail: "Matn turiga o'tkazish",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("Boolean(${1:val})", {
    label: "Boolean",
    detail: "Mantiqiy turga (true/false) o'tkazish",
    type: "function",
    boost: 7,
  }),

  // Math methods
  snippetCompletion("Math.floor(${1:val})", {
    label: "Math.floor",
    detail: "Pastga yaxlitlash",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("Math.random()", {
    label: "Math.random",
    detail: "0 dan 1 gacha tasodifiy son",
    type: "function",
    boost: 8,
  }),
  snippetCompletion("Math.round(${1:val})", {
    label: "Math.round",
    detail: "Eng yaqin songa yaxlitlash",
    type: "function",
    boost: 7,
  }),
  snippetCompletion("Math.ceil(${1:val})", {
    label: "Math.ceil",
    detail: "Yuqoriga yaxlitlash",
    type: "function",
    boost: 7,
  }),
  snippetCompletion("Math.max(${1:a}, ${2:b})", {
    label: "Math.max",
    detail: "Eng katta son",
    type: "function",
    boost: 7,
  }),
  snippetCompletion("Math.min(${1:a}, ${2:b})", {
    label: "Math.min",
    detail: "Eng kichik son",
    type: "function",
    boost: 7,
  }),

  // Variable Declarations
  snippetCompletion("const ${1:name} = ${2:value};", {
    label: "const",
    detail: "O'zgarmas o'zgaruvchi e'lon qilish",
    type: "keyword",
    boost: 10,
  }),
  snippetCompletion("let ${1:name} = ${2:value};", {
    label: "let",
    detail: "Qiymati o'zgaruvchi e'lon qilish",
    type: "keyword",
    boost: 9,
  }),
  snippetCompletion("var ${1:name} = ${2:value};", {
    label: "var",
    detail: "Eski uslubdagi o'zgaruvchi e'lon qilish",
    type: "keyword",
    boost: 4,
  }),

  // Functions
  snippetCompletion("function ${1:name}(${2:params}) {\n  ${3}\n}", {
    label: "function",
    detail: "Funksiya yaratish",
    type: "keyword",
    boost: 9,
  }),
  snippetCompletion("const ${1:name} = (${2:params}) => {\n  ${3}\n};", {
    label: "arrow function",
    detail: "Strelkali funksiya yaratish",
    type: "keyword",
    boost: 8,
  }),
  snippetCompletion("return ${1};", {
    label: "return",
    detail: "Funksiyadan natija qaytarish",
    type: "keyword",
    boost: 8,
  }),

  // Conditionals & Loops
  snippetCompletion("if (${1:condition}) {\n  ${2}\n}", {
    label: "if",
    detail: "Shart operatori",
    type: "keyword",
    boost: 9,
  }),
  snippetCompletion("if (${1:condition}) {\n  ${2}\n} else {\n  ${3}\n}", {
    label: "if-else",
    detail: "Shart va aks holda operatori",
    type: "keyword",
    boost: 9,
  }),
  snippetCompletion("else if (${1:condition}) {\n  ${2}\n}", {
    label: "else if",
    detail: "Qo'shimcha shart tekshirish",
    type: "keyword",
    boost: 8,
  }),
  snippetCompletion("else {\n  ${1}\n}", {
    label: "else",
    detail: "Aks holda bloki",
    type: "keyword",
    boost: 8,
  }),
  snippetCompletion("for (let i = 0; i < ${1:10}; i++) {\n  ${2}\n}", {
    label: "for loop",
    detail: "Sanoqli takrorlanish sikli",
    type: "keyword",
    boost: 8,
  }),
  snippetCompletion("for (const ${1:item} of ${2:items}) {\n  ${3}\n}", {
    label: "for-of loop",
    detail: "Massiv elementlari bo'yicha sikl",
    type: "keyword",
    boost: 8,
  }),
  snippetCompletion("while (${1:condition}) {\n  ${2}\n}", {
    label: "while loop",
    detail: "Shart bajarilguncha takrorlanish sikli",
    type: "keyword",
    boost: 7,
  }),
  snippetCompletion(
    "switch (${1:expr}) {\n  case ${2:value}:\n    ${3}\n    break;\n  default:\n    ${4}\n}",
    {
      label: "switch-case",
      detail: "Ko'p variantli tanlov operatori",
      type: "keyword",
      boost: 6,
    }
  ),

  // Timers
  snippetCompletion("setTimeout(() => {\n  ${1}\n}, ${2:1000});", {
    label: "setTimeout",
    detail: "Kechiktirib bir marta ishga tushirish",
    type: "function",
    boost: 7,
  }),
  snippetCompletion("setInterval(() => {\n  ${1}\n}, ${2:1000});", {
    label: "setInterval",
    detail: "Vaqt oralig'ida muntazam takrorlash",
    type: "function",
    boost: 7,
  }),

  // Globals
  snippetCompletion("window", { label: "window", detail: "Global oyna obyekti", type: "variable", boost: 5 }),
  snippetCompletion("document", { label: "document", detail: "DOM hujjat obyekti", type: "variable", boost: 9 }),
  snippetCompletion("event", { label: "event", detail: "Hodisa obyekti", type: "variable", boost: 6 }),
];

export function jsCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w$.]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const dotIdx = word.text.lastIndexOf(".");
  if (dotIdx >= 0) {
    const from = word.from + dotIdx + 1;
    return {
      from,
      options: jsMemberCompletions,
      validFor: /^[\w$]*$/,
    };
  }

  return {
    from: word.from,
    options: [...jsRootCompletions, ...jsMemberCompletions],
    validFor: /^[\w$]*$/,
  };
}

// 2. HTML COMPLETIONS
interface TagSpec {
  name: string;
  detail: string;
  snippet: string;
}

const htmlTags: TagSpec[] = [
  { name: "div", detail: "Blok konteyner elementi", snippet: '<div class="${1}">${2}</div>' },
  { name: "button", detail: "Bosiladigan tugma", snippet: '<button class="${1}">${2}</button>' },
  { name: "input", detail: "Kiritish maydoni", snippet: '<input type="${1:text}" placeholder="${2}" />' },
  { name: "p", detail: "Matn paragrafi", snippet: '<p class="${1}">${2}</p>' },
  { name: "span", detail: "Satr ichi (inline) matn konteyneri", snippet: '<span class="${1}">${2}</span>' },
  { name: "h1", detail: "Bosh sarlavha (daraja 1)", snippet: '<h1 class="${1}">${2}</h1>' },
  { name: "h2", detail: "Kichik sarlavha (daraja 2)", snippet: '<h2 class="${1}">${2}</h2>' },
  { name: "h3", detail: "Ichki sarlavha (daraja 3)", snippet: '<h3 class="${1}">${2}</h3>' },
  { name: "h4", detail: "Sarlavha (daraja 4)", snippet: '<h4 class="${1}">${2}</h4>' },
  { name: "form", detail: "Ma'lumot yuborish formasi", snippet: '<form class="${1}">\n  ${2}\n</form>' },
  { name: "ul", detail: "Tartibsiz ro'yxat (nuqtali)", snippet: '<ul class="${1}">\n  <li>${2}</li>\n</ul>' },
  { name: "ol", detail: "Tartibli ro'yxat (raqamli)", snippet: '<ol class="${1}">\n  <li>${2}</li>\n</ol>' },
  { name: "li", detail: "Ro'yxat elementi", snippet: "<li>${1}</li>" },
  { name: "a", detail: "Giperhavola (link)", snippet: '<a href="${1:#}">${2}</a>' },
  { name: "img", detail: "Rasm joylash", snippet: '<img src="${1}" alt="${2}" />' },
  { name: "label", detail: "Forma maydoni yorlig'i", snippet: '<label for="${1}">${2}</label>' },
  { name: "select", detail: "Ochiladigan tanlov ro'yxati", snippet: '<select class="${1}">\n  <option value="${2}">${3}</option>\n</select>' },
  { name: "option", detail: "Tanlov varianti", snippet: '<option value="${1}">${2}</option>' },
  { name: "textarea", detail: "Ko'p qatorli matn maydoni", snippet: '<textarea placeholder="${1}" rows="${2:4}"></textarea>' },
  { name: "section", detail: "Semantik bo'lim", snippet: '<section class="${1}">\n  ${2}\n</section>' },
  { name: "article", detail: "Mustaqil maqola bloki", snippet: '<article class="${1}">\n  ${2}\n</article>' },
  { name: "header", detail: "Sayt yoki bo'lim bosh qismi", snippet: '<header class="${1}">\n  ${2}\n</header>' },
  { name: "footer", detail: "Sayt yoki bo'lim quyi qismi", snippet: '<footer class="${1}">\n  ${2}\n</footer>' },
  { name: "nav", detail: "Navigatsiya havolalari bloki", snippet: '<nav class="${1}">\n  ${2}\n</nav>' },
  { name: "main", detail: "Sahifaning asosiy mazmuni", snippet: '<main class="${1}">\n  ${2}\n</main>' },
  { name: "table", detail: "Jadval", snippet: '<table class="${1}">\n  <tr>\n    <th>${2}</th>\n  </tr>\n  <tr>\n    <td>${3}</td>\n  </tr>\n</table>' },
  { name: "tr", detail: "Jadval qatori", snippet: "<tr>\n  <td>${1}</td>\n</tr>" },
  { name: "td", detail: "Jadval katakchasi", snippet: "<td>${1}</td>" },
  { name: "th", detail: "Jadval sarlavha katakchasi", snippet: "<th>${1}</th>" },
  { name: "strong", detail: "Qalin matn", snippet: "<strong>${1}</strong>" },
  { name: "em", detail: "Kursiv urg'uli matn", snippet: "<em>${1}</em>" },
];

const htmlAttributes: Completion[] = [
  snippetCompletion('class="${1}"', { label: "class", detail: "CSS klass atributi", type: "property", boost: 10 }),
  snippetCompletion('id="${1}"', { label: "id", detail: "Unikal element identifikatori", type: "property", boost: 10 }),
  snippetCompletion('type="${1:text}"', { label: "type", detail: "Input turi (text, number, email, button)", type: "property", boost: 9 }),
  snippetCompletion('placeholder="${1}"', { label: "placeholder", detail: "Kiritish uchun maslahat matni", type: "property", boost: 9 }),
  snippetCompletion('value="${1}"', { label: "value", detail: "Boshlang'ich qiymat", type: "property", boost: 9 }),
  snippetCompletion('name="${1}"', { label: "name", detail: "Forma maydoni nomi", type: "property", boost: 8 }),
  snippetCompletion('href="${1:#}"', { label: "href", detail: "Havola manzili URL", type: "property", boost: 9 }),
  snippetCompletion('src="${1}"', { label: "src", detail: "Rasm yoki fayl manbasi", type: "property", boost: 9 }),
  snippetCompletion('alt="${1}"', { label: "alt", detail: "Rasmning muqobil matni", type: "property", boost: 8 }),
  snippetCompletion('style="${1}"', { label: "style", detail: "Inline CSS stili", type: "property", boost: 7 }),
  snippetCompletion('onclick="${1}"', { label: "onclick", detail: "Bosganda ishlaydigan JS kodi", type: "property", boost: 7 }),
  snippetCompletion("required", { label: "required", detail: "To'ldirilishi majburiy maydon", type: "property", boost: 8 }),
  snippetCompletion("disabled", { label: "disabled", detail: "Nofaol holatga keltirish", type: "property", boost: 7 }),
  snippetCompletion("checked", { label: "checked", detail: "Belgilangan holat (checkbox/radio)", type: "property", boost: 6 }),
  snippetCompletion('target="_blank"', { label: "target", detail: "Yangi oynada ochish", type: "property", boost: 6 }),
];

export function htmlCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/<[\w-]*|[\w-]+/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const startsWithBracket = word.text.startsWith("<");

  if (startsWithBracket) {
    const options = htmlTags.map((t) =>
      snippetCompletion(t.snippet, {
        label: "<" + t.name,
        detail: t.detail,
        type: "type",
        boost: 10,
      })
    );
    return { from: word.from, options, validFor: /^<[\w-]*$/ };
  }

  const options = [
    ...htmlTags.map((t) =>
      snippetCompletion(t.snippet, {
        label: t.name,
        detail: t.detail,
        type: "type",
        boost: 8,
      })
    ),
    ...htmlAttributes,
  ];

  return { from: word.from, options, validFor: /^[\w-]*$/ };
}

// 3. CSS COMPLETIONS
const cssSnippets: Completion[] = [
  // Display & Flexbox
  snippetCompletion("display: flex;", { label: "display: flex", detail: "Flexbox konteyner qilish", type: "property", boost: 10 }),
  snippetCompletion("display: grid;", { label: "display: grid", detail: "CSS Grid konteyner qilish", type: "property", boost: 10 }),
  snippetCompletion("display: block;", { label: "display: block", detail: "Blok ko'rinish", type: "property", boost: 8 }),
  snippetCompletion("display: inline-block;", { label: "display: inline-block", detail: "Satrli blok ko'rinish", type: "property", boost: 7 }),
  snippetCompletion("display: none;", { label: "display: none", detail: "Elementni butunlay yashirish", type: "property", boost: 8 }),

  snippetCompletion("flex-direction: column;", { label: "flex-direction: column", detail: "Elementlarni ustun qilib terish", type: "property", boost: 9 }),
  snippetCompletion("flex-direction: row;", { label: "flex-direction: row", detail: "Elementlarni qator qilib terish", type: "property", boost: 9 }),
  snippetCompletion("flex-wrap: wrap;", { label: "flex-wrap: wrap", detail: "Sig'magan elementlarni yangi qatorga ko'chirish", type: "property", boost: 8 }),

  snippetCompletion("justify-content: center;", { label: "justify-content: center", detail: "Asosiy o'q bo'ylab markazlashtirish", type: "property", boost: 10 }),
  snippetCompletion("justify-content: space-between;", { label: "justify-content: space-between", detail: "Chekkalarga yoyib, oraliqni teng bo'lish", type: "property", boost: 9 }),
  snippetCompletion("justify-content: space-around;", { label: "justify-content: space-around", detail: "Har bir element atrofida teng bo'shliq", type: "property", boost: 8 }),
  snippetCompletion("justify-content: space-evenly;", { label: "justify-content: space-evenly", detail: "Barcha oraliqlar mutlaqo teng", type: "property", boost: 8 }),
  snippetCompletion("justify-content: flex-start;", { label: "justify-content: flex-start", detail: "Boshiga taxlash", type: "property", boost: 7 }),
  snippetCompletion("justify-content: flex-end;", { label: "justify-content: flex-end", detail: "Oxiriga taxlash", type: "property", boost: 7 }),

  snippetCompletion("align-items: center;", { label: "align-items: center", detail: "Ko'ndalang o'q bo'ylab markazlashtirish", type: "property", boost: 10 }),
  snippetCompletion("align-items: flex-start;", { label: "align-items: flex-start", detail: "Ko'ndalang o'q boshiga tekislash", type: "property", boost: 8 }),
  snippetCompletion("align-items: flex-end;", { label: "align-items: flex-end", detail: "Ko'ndalang o'q oxiriga tekislash", type: "property", boost: 8 }),
  snippetCompletion("align-items: stretch;", { label: "align-items: stretch", detail: "To'liq balandlikka cho'zish", type: "property", boost: 7 }),

  snippetCompletion("gap: ${1:16px};", { label: "gap", detail: "Flex va Grid elementlar orasidagi masofa", type: "property", boost: 9 }),
  snippetCompletion("flex: ${1:1};", { label: "flex: 1", detail: "Qolgan bo'shliqni to'liq egallash", type: "property", boost: 8 }),

  // CSS Grid
  snippetCompletion("grid-template-columns: repeat(${1:3}, 1fr);", { label: "grid-template-columns: repeat", detail: "Teng ustunlar soni", type: "property", boost: 9 }),
  snippetCompletion("grid-template-columns: ${1:1fr 1fr};", { label: "grid-template-columns", detail: "Ustunlar nisbati", type: "property", boost: 8 }),
  snippetCompletion("grid-gap: ${1:16px};", { label: "grid-gap", detail: "Grid kataklari orasidagi bo'shliq", type: "property", boost: 8 }),

  // Spacing & Box Model
  snippetCompletion("padding: ${1:16px};", { label: "padding", detail: "Ichki masofa (hamma tomondan)", type: "property", boost: 9 }),
  snippetCompletion("padding: ${1:8px} ${2:16px};", { label: "padding: vert horiz", detail: "Ichki masofa (tepa-past / o'ng-chap)", type: "property", boost: 8 }),
  snippetCompletion("margin: ${1:16px};", { label: "margin", detail: "Tashqi masofa", type: "property", boost: 9 }),
  snippetCompletion("margin: 0 auto;", { label: "margin: 0 auto", detail: "Blokni gorizontal markazlashtirish", type: "property", boost: 9 }),
  snippetCompletion("box-sizing: border-box;", { label: "box-sizing: border-box", detail: "Border va paddingni hajm ichiga kiritish", type: "property", boost: 8 }),

  // Sizing
  snippetCompletion("width: ${1:100%};", { label: "width", detail: "Kenglik", type: "property", boost: 9 }),
  snippetCompletion("max-width: ${1:1200px};", { label: "max-width", detail: "Maksimal kenglik", type: "property", boost: 8 }),
  snippetCompletion("min-width: ${1:300px};", { label: "min-width", detail: "Minimal kenglik", type: "property", boost: 7 }),
  snippetCompletion("height: ${1:100%};", { label: "height", detail: "Balandlik", type: "property", boost: 9 }),
  snippetCompletion("min-height: ${1:100vh};", { label: "min-height: 100vh", detail: "Ekran bo'yi to'liq balandlik", type: "property", boost: 8 }),

  // Colors & Backgrounds
  snippetCompletion("background-color: ${1:#ffffff};", { label: "background-color", detail: "Fon rangi", type: "property", boost: 9 }),
  snippetCompletion("background: ${1:#ffffff};", { label: "background", detail: "Fon rangi yoki rasmi", type: "property", boost: 8 }),
  snippetCompletion("color: ${1:#000000};", { label: "color", detail: "Matn rangi", type: "property", boost: 9 }),
  snippetCompletion("opacity: ${1:1};", { label: "opacity", detail: "Shaffoflik darajasi (0 dan 1 gacha)", type: "property", boost: 7 }),

  // Borders & Outlines
  snippetCompletion("border: ${1:1px solid #e2e8f0};", { label: "border", detail: "Chegara chizig'i", type: "property", boost: 9 }),
  snippetCompletion("border-radius: ${1:8px};", { label: "border-radius", detail: "Burchaklarni yumaloqlash", type: "property", boost: 9 }),
  snippetCompletion("border-radius: 9999px;", { label: "border-radius: pill", detail: "Dumaloq tabletka ko'rinishi", type: "property", boost: 8 }),
  snippetCompletion("outline: none;", { label: "outline: none", detail: "Tashqi chiziqni olib tashlash", type: "property", boost: 8 }),
  snippetCompletion("box-shadow: ${1:0 4px 6px -1px rgba(0, 0, 0, 0.1)};", { label: "box-shadow", detail: "Soya effekti", type: "property", boost: 8 }),

  // Typography
  snippetCompletion("font-size: ${1:16px};", { label: "font-size", detail: "Shrift o'lchami", type: "property", boost: 9 }),
  snippetCompletion("font-weight: ${1:bold};", { label: "font-weight", detail: "Shrift qalinligi (bold, 600, normal)", type: "property", boost: 9 }),
  snippetCompletion("font-family: ${1:sans-serif};", { label: "font-family", detail: "Shrift oilasi", type: "property", boost: 8 }),
  snippetCompletion("text-align: center;", { label: "text-align: center", detail: "Matnni o'rtaga tekislash", type: "property", boost: 9 }),
  snippetCompletion("text-align: left;", { label: "text-align: left", detail: "Matnni chapga tekislash", type: "property", boost: 8 }),
  snippetCompletion("text-align: right;", { label: "text-align: right", detail: "Matnni o'ngga tekislash", type: "property", boost: 8 }),
  snippetCompletion("line-height: ${1:1.5};", { label: "line-height", detail: "Satrlar oralig'i balandligi", type: "property", boost: 8 }),
  snippetCompletion("text-decoration: none;", { label: "text-decoration: none", detail: "Tagidagi chiziqni olib tashlash", type: "property", boost: 8 }),
  snippetCompletion("text-transform: uppercase;", { label: "text-transform: uppercase", detail: "Barcha harflarni katta qilish", type: "property", boost: 7 }),

  // Positioning
  snippetCompletion("position: relative;", { label: "position: relative", detail: "Nisbiy joylashuv", type: "property", boost: 9 }),
  snippetCompletion("position: absolute;", { label: "position: absolute", detail: "Mutlaq joylashuv", type: "property", boost: 9 }),
  snippetCompletion("position: fixed;", { label: "position: fixed", detail: "Ekranga mahkamlangan joylashuv", type: "property", boost: 8 }),
  snippetCompletion("position: sticky;", { label: "position: sticky", detail: "Skroll paytida yopishuvchi joylashuv", type: "property", boost: 8 }),
  snippetCompletion("top: ${1:0};", { label: "top", detail: "Yuqoridan masofa", type: "property", boost: 8 }),
  snippetCompletion("left: ${1:0};", { label: "left", detail: "Chapdan masofa", type: "property", boost: 8 }),
  snippetCompletion("right: ${1:0};", { label: "right", detail: "O'ngdan masofa", type: "property", boost: 8 }),
  snippetCompletion("bottom: ${1:0};", { label: "bottom", detail: "Pastdan masofa", type: "property", boost: 8 }),
  snippetCompletion("z-index: ${1:10};", { label: "z-index", detail: "Qatlamlar tartibi chuqurligi", type: "property", boost: 8 }),

  // Effects & Interactions
  snippetCompletion("cursor: pointer;", { label: "cursor: pointer", detail: "Kursor ko'rsatkich qo'l shakliga o'tishi", type: "property", boost: 9 }),
  snippetCompletion("transition: all ${1:0.3s ease};", { label: "transition", detail: "O'zgarishlar animatsiya davomiyligi", type: "property", boost: 9 }),
  snippetCompletion("transform: scale(${1:1.05});", { label: "transform: scale", detail: "Kattalashtirish/kichraytirish", type: "property", boost: 8 }),
  snippetCompletion("overflow: hidden;", { label: "overflow: hidden", detail: "Tashqariga chiqqan qismni qirqib yashirish", type: "property", boost: 8 }),
  snippetCompletion("overflow-y: auto;", { label: "overflow-y: auto", detail: "Faqat vertikal skroll hosil qilish", type: "property", boost: 8 }),
];

export function cssCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w-]+/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  return {
    from: word.from,
    options: cssSnippets,
    validFor: /^[\w-]*$/,
  };
}

// 4. FACTORY FOR AUTOCOMPLETE EXTENSION
export function getAutocompleteExtension(activeTab: "html" | "css" | "js"): Extension {
  const languageSource =
    activeTab === "html"
      ? htmlCompletionSource
      : activeTab === "css"
      ? cssCompletionSource
      : jsCompletionSource;

  return autocompletion({
    override: [languageSource, completeAnyWord],
    activateOnTyping: true,
    maxRenderedOptions: 30,
    defaultKeymap: true,
    closeOnBlur: false,
  });
}
