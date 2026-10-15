import { ChallengeAssertion } from "./tests-runner";

export interface ChallengeItem {
  id: string;
  title: string;
  description_md: string;
  level: 1 | 2 | 3;
  topics: string[];
  starter_html: string;
  starter_css: string;
  starter_js?: string;
  solution_html: string;
  solution_css: string;
  solution_js?: string;
  target_html: string;
  target_css: string;
  tests: ChallengeAssertion[];
  fallback_hints: Record<string, string>;
  is_public: boolean;
}

export const COURSE_CHALLENGES: ChallengeItem[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "1. Sarlavha va paragraf",
    description_md:
      "Sahifaga asosiy `h1` sarlavha ichida **\"Salom Dunyo\"** matnini va uning ostiga `p` tegi ichida o'zingiz haqingizda qisqa gap yozing.",
    level: 1,
    topics: ["semantic-html", "typography"],
    starter_html: "<!-- Kodingizni shu yerga yozing -->\n<div>\n  \n</div>",
    starter_css: "body {\n  font-family: sans-serif;\n  padding: 24px;\n  color: #1e293b;\n}",
    solution_html: "<div>\n  <h1>Salom Dunyo</h1>\n  <p>Men O'zing Yoz platformasida o'qiyapman.</p>\n</div>",
    solution_css: "body {\n  font-family: sans-serif;\n  padding: 24px;\n  color: #1e293b;\n}",
    target_html: "<div>\n  <h1 style=\"font-size: 28px; font-weight: bold; margin-bottom: 8px;\">Salom Dunyo</h1>\n  <p style=\"color: #64748b;\">Men O'zing Yoz platformasida o'qiyapman.</p>\n</div>",
    target_css: "body { font-family: sans-serif; padding: 24px; }",
    tests: [
      { type: "exists", selector: "h1", label: "Sarlavha (h1) tegi mavjud" },
      { type: "text", selector: "h1", contains: "Salom", label: "h1 ichida 'Salom' so'zi bor" },
      { type: "exists", selector: "p", label: "Paragraf (p) tegi mavjud" },
    ],
    fallback_hints: {
      "1": "Sahifada eng katta sarlavha hosil qilish uchun qaysi HTML tegidan foydalanamiz?",
      "2": "2-qatordagi div ichiga <h1>Salom Dunyo</h1> va <p> matnini joylashtiring.",
      "3": "Masalan: <h1>Salom Dunyo</h1> va <p>Men dasturchiman.</p> ko'rinishida bo'ladi.",
      "4": "<h1>Salom Dunyo</h1>\n<p>Men O'zing Yoz o'quvchisiman.</p>",
    },
    is_public: true,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "2. Flexbox bilan markazlash",
    description_md:
      "`.container` blokining ichidagi `.card` elementini `flexbox` yordamida ham gorizontal, ham vertikal markazga keltiring.",
    level: 2,
    topics: ["flexbox", "box-model"],
    starter_html: '<div class="container">\n  <div class="card">Markazdagi karta</div>\n</div>',
    starter_css:
      ".container {\n  height: 240px;\n  border: 2px dashed #cbd5e1;\n  /* Shu yerga flex xossalarini yozing */\n}\n\n.card {\n  padding: 16px 28px;\n  background: #84cc16;\n  color: #0f172a;\n  border-radius: 12px;\n  font-weight: 600;\n  box-shadow: 0 4px 12px rgba(132, 204, 22, 0.25);\n}",
    solution_html: '<div class="container">\n  <div class="card">Markazdagi karta</div>\n</div>',
    solution_css:
      ".container {\n  height: 240px;\n  border: 2px dashed #cbd5e1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.card {\n  padding: 16px 28px;\n  background: #84cc16;\n  color: #0f172a;\n  border-radius: 12px;\n  font-weight: 600;\n}",
    target_html: '<div style="height: 240px; border: 2px dashed #cbd5e1; display: flex; justify-content: center; align-items: center;"><div style="padding: 16px 28px; background: #84cc16; color: #0f172a; border-radius: 12px; font-weight: 600;">Markazdagi karta</div></div>',
    target_css: "",
    tests: [
      { type: "style", selector: ".container", property: "display", op: "==", value: "flex", label: ".container display: flex bo'lishi kerak" },
      { type: "style", selector: ".container", property: "justify-content", op: "==", value: "center", label: "Gorizontal markazlash (justify-content: center)" },
      { type: "style", selector: ".container", property: "align-items", op: "==", value: "center", label: "Vertikal markazlash (align-items: center)" },
    ],
    fallback_hints: {
      "1": "Flexbox-da elementlarni ikkala o'q bo'yicha markazlash uchun qaysi uchta CSS xossasi birga ishlatiladi?",
      "2": "CSS 4-qatordagi .container ichida display, justify-content va align-items xossalarini yozing.",
      "3": "Flex konteynerda justify-content asosiy o'qni, align-items esa kesishuvchi o'qni boshqaradi.",
      "4": "display: flex;\njustify-content: center;\nalign-items: center;",
    },
    is_public: true,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    title: "3. Rasmlar galereyasi (CSS Grid)",
    description_md:
      "`.gallery` konteynerini CSS Grid-ga o'tkazing va `gap` ni `16px` qilib belgilang. Kamida 3 ta `.item` bloki bo'lsin.",
    level: 2,
    topics: ["grid", "box-model"],
    starter_html: '<div class="gallery">\n  <div class="item">1</div>\n  <div class="item">2</div>\n</div>',
    starter_css:
      ".gallery {\n  /* Grid xossalarini qo'shing */\n}\n\n.item {\n  background: #e2e8f0;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}",
    solution_html: '<div class="gallery">\n  <div class="item">1</div>\n  <div class="item">2</div>\n  <div class="item">3</div>\n</div>',
    solution_css:
      ".gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n.item {\n  background: #e2e8f0;\n  padding: 24px;\n  border-radius: 8px;\n  text-align: center;\n  font-weight: bold;\n}",
    target_html: '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;"><div style="background: #e2e8f0; padding: 24px; border-radius: 8px; text-align: center; font-weight: bold;">1</div><div style="background: #e2e8f0; padding: 24px; border-radius: 8px; text-align: center; font-weight: bold;">2</div><div style="background: #e2e8f0; padding: 24px; border-radius: 8px; text-align: center; font-weight: bold;">3</div></div>',
    target_css: "",
    tests: [
      { type: "count", selector: ".item", op: ">=", value: 3, label: "Kamida 3 ta .item bloki bor" },
      { type: "style", selector: ".gallery", property: "display", op: "==", value: "grid", label: ".gallery display: grid bo'lishi kerak" },
      { type: "style", selector: ".gallery", property: "gap", op: "==", value: "16px", label: "Oraliq masofa (gap) 16px" },
    ],
    fallback_hints: {
      "1": "HTML-da nechta .item borligini va CSS-da jadval (grid) tartibini qanday yoqishni tekshirdingizmi?",
      "2": "HTML-ga 3-chi .item qo'shing va CSS 2-qatorda .gallery uchun display hamda gap yozing.",
      "3": "CSS Grid yoqish uchun display: grid; va kataklar orasini ochish uchun gap: 16px; ishlatiladi.",
      "4": "display: grid;\ngap: 16px;",
    },
    is_public: true,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    title: "4. Havola va Tugma (Button)",
    description_md:
      "`.action-btn` tugmasini yarating. Tugmaga yashil fon (`background: #65a30d`), oq matn (`color: #ffffff`), va `10px` burchak radiusi (`border-radius: 10px`) bering.",
    level: 1,
    topics: ["semantic-html", "buttons", "colors"],
    starter_html: '<button class="action-btn">Boshlash</button>',
    starter_css:
      ".action-btn {\n  padding: 12px 24px;\n  border: none;\n  font-size: 15px;\n  cursor: pointer;\n  /* Stil xossalarini shu yerga yozing */\n}",
    solution_html: '<button class="action-btn">Boshlash</button>',
    solution_css:
      ".action-btn {\n  padding: 12px 24px;\n  border: none;\n  font-size: 15px;\n  cursor: pointer;\n  background: #65a30d;\n  color: #ffffff;\n  border-radius: 10px;\n}",
    target_html: '<button style="padding: 12px 24px; border: none; font-size: 15px; background: #65a30d; color: #ffffff; border-radius: 10px; font-weight: 600;">Boshlash</button>',
    target_css: "",
    tests: [
      { type: "exists", selector: "button.action-btn", label: ".action-btn nomli tugma mavjud" },
      { type: "style", selector: ".action-btn", property: "color", op: "==", value: "rgb(255, 255, 255)", label: "Matn rangi oq (color: #ffffff)" },
      { type: "style", selector: ".action-btn", property: "border-radius", op: "==", value: "10px", label: "Burchak radiusi 10px (border-radius: 10px)" },
    ],
    fallback_hints: {
      "1": "Tugmaning matn rangini va burchak yumaloqligini qaysi CSS xossalari o'zgartiradi?",
      "2": ".action-btn selektori ichiga background, color va border-radius qiymatlarini yozing.",
      "3": "Masalan: color: #ffffff; va border-radius: 10px; tugmani chiroyli qiladi.",
      "4": "background: #65a30d;\ncolor: #ffffff;\nborder-radius: 10px;",
    },
    is_public: true,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    title: "5. Flexbox Navigatsiya menyusi",
    description_md:
      "`.navbar` konteyneridagi logo va menyu bandlarini ikki chetga suring (`justify-content: space-between`) va vertikal markazlang (`align-items: center`).",
    level: 2,
    topics: ["flexbox", "responsive"],
    starter_html:
      '<nav class="navbar">\n  <div class="logo">O\'zing Yoz</div>\n  <ul class="nav-links">\n    <li>Bosh sahifa</li>\n    <li>Mashqlar</li>\n  </ul>\n</nav>',
    starter_css:
      ".navbar {\n  padding: 16px 24px;\n  background: #ffffff;\n  border-bottom: 1px solid #e2e8f0;\n  /* Flex xossalarini kiriting */\n}\n\n.logo {\n  font-weight: bold;\n  color: #0f172a;\n}\n\n.nav-links {\n  display: flex;\n  gap: 20px;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  color: #64748b;\n}",
    solution_html:
      '<nav class="navbar">\n  <div class="logo">O\'zing Yoz</div>\n  <ul class="nav-links">\n    <li>Bosh sahifa</li>\n    <li>Mashqlar</li>\n  </ul>\n</nav>',
    solution_css:
      ".navbar {\n  padding: 16px 24px;\n  background: #ffffff;\n  border-bottom: 1px solid #e2e8f0;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo {\n  font-weight: bold;\n  color: #0f172a;\n}\n\n.nav-links {\n  display: flex;\n  gap: 20px;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  color: #64748b;\n}",
    target_html: '<nav style="padding: 16px 24px; background: #ffffff; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;"><div style="font-weight: bold; color: #0f172a;">O\'zing Yoz</div><ul style="display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; color: #64748b;"><li>Bosh sahifa</li><li>Mashqlar</li></ul></nav>',
    target_css: "",
    tests: [
      { type: "style", selector: ".navbar", property: "display", op: "==", value: "flex", label: ".navbar display: flex bo'lishi kerak" },
      { type: "style", selector: ".navbar", property: "justify-content", op: "==", value: "space-between", label: "Elementlar ikki chetga surilgan (justify-content: space-between)" },
      { type: "style", selector: ".navbar", property: "align-items", op: "==", value: "center", label: "Vertikal markazlangan (align-items: center)" },
    ],
    fallback_hints: {
      "1": "Ikki elementni konteynerning ikki chetiga itarish uchun qaysi justify-content qiymati ishlatiladi?",
      "2": ".navbar selektorida display: flex va justify-content: space-between yozing.",
      "3": "justify-content: space-between birinchi elementni chapga, ikkinchisini esa o'ngga suradi.",
      "4": "display: flex;\njustify-content: space-between;\nalign-items: center;",
    },
    is_public: true,
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    title: "6. Hover effekti va Tranzitsiya",
    description_md:
      "`.card` elementi ustiga sichqoncha kelganda (`:hover`) fon rangi `#ecfccb` ga o'zgarishi va silliq `0.3s` o'tishi (`transition`) kerak.",
    level: 2,
    topics: ["transitions", "selectors"],
    starter_html: '<div class="card">\n  Ustiga keling\n</div>',
    starter_css:
      ".card {\n  padding: 32px;\n  background: #f8fafc;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  text-align: center;\n  cursor: pointer;\n  /* Tranzitsiya qo'shing */\n}\n\n.card:hover {\n  /* Hover rangini kiriting */\n}",
    solution_html: '<div class="card">\n  Ustiga keling\n</div>',
    solution_css:
      ".card {\n  padding: 32px;\n  background: #f8fafc;\n  border: 1px solid #cbd5e1;\n  border-radius: 12px;\n  text-align: center;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n\n.card:hover {\n  background: #ecfccb;\n}",
    target_html: '<div style="padding: 32px; background: #ecfccb; border: 1px solid #84cc16; border-radius: 12px; text-align: center; font-weight: bold;">Hover holati</div>',
    target_css: "",
    tests: [
      { type: "exists", selector: ".card", label: ".card mavjud" },
      { type: "style", selector: ".card", property: "transition-duration", op: "!=", value: "0s", label: ".card uchun transition (o'tish vaqti) belgilangan" },
    ],
    fallback_hints: {
      "1": "Element o'zgarishini sakrab qolmay, silliq qilish uchun qaysi CSS xossasi kerak?",
      "2": ".card ichiga transition: all 0.3s ease; va .card:hover ichiga background: #ecfccb; yozing.",
      "3": "transition xossasi o'zgarish vaqtini sekundlarda belgilaydi (masalan 0.3s).",
      "4": "transition: all 0.3s ease;\n\n.card:hover {\n  background: #ecfccb;\n}",
    },
    is_public: true,
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    title: "7. Zamonaviy Forma Inputi",
    description_md:
      "`.input-field` kiritish maydoniga `border: 1px solid #cbd5e1`, `padding: 10px 14px` va fokus bo'lganda (`:focus`) `outline: none` bering.",
    level: 1,
    topics: ["forms", "selectors"],
    starter_html: '<input type="text" class="input-field" placeholder="Ismingizni yozing..." />',
    starter_css:
      ".input-field {\n  width: 100%;\n  border-radius: 8px;\n  font-size: 14px;\n  /* Stil xossalarini yozing */\n}\n\n.input-field:focus {\n  /* Fokus holati */\n}",
    solution_html: '<input type="text" class="input-field" placeholder="Ismingizni yozing..." />',
    solution_css:
      ".input-field {\n  width: 100%;\n  border-radius: 8px;\n  font-size: 14px;\n  border: 1px solid #cbd5e1;\n  padding: 10px 14px;\n}\n\n.input-field:focus {\n  outline: none;\n  border-color: #65a30d;\n}",
    target_html: '<input type="text" style="width: 100%; border-radius: 8px; font-size: 14px; border: 1px solid #65a30d; padding: 10px 14px; outline: none; box-shadow: 0 0 0 3px rgba(101, 163, 13, 0.2);" placeholder="Ismingizni yozing..." />',
    target_css: "",
    tests: [
      { type: "exists", selector: "input.input-field", label: ".input-field mavjud" },
      { type: "style", selector: ".input-field", property: "border-radius", op: "==", value: "8px", label: "Border-radius 8px" },
    ],
    fallback_hints: {
      "1": "Input maydoniga ichki bo'shliq va hoshiya berish uchun qaysi CSS xossalarini qo'llaymiz?",
      "2": "padding: 10px 14px; va border: 1px solid #cbd5e1; xossalarini yozing.",
      "3": "Fokus bo'lgandagi ko'k ramkani yo'qotish uchun outline: none; qo'llaniladi.",
      "4": "border: 1px solid #cbd5e1;\npadding: 10px 14px;\n\n.input-field:focus {\n  outline: none;\n}",
    },
    is_public: true,
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    title: "8. Responsive Media Query",
    description_md:
      "Katta ekranda `.grid-layout` 2 ustunli (`grid-template-columns: 1fr 1fr`), lekin `@media (max-width: 600px)` da 1 ustunli (`1fr`) bo'lsin.",
    level: 3,
    topics: ["responsive", "grid"],
    starter_html: '<div class="grid-layout">\n  <div class="col">1-ustun</div>\n  <div class="col">2-ustun</div>\n</div>',
    starter_css:
      ".grid-layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n\n.col {\n  background: #f1f5f9;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n}\n\n/* @media query yozing */",
    solution_html: '<div class="grid-layout">\n  <div class="col">1-ustun</div>\n  <div class="col">2-ustun</div>\n</div>',
    solution_css:
      ".grid-layout {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n\n.col {\n  background: #f1f5f9;\n  padding: 20px;\n  border-radius: 8px;\n  text-align: center;\n}\n\n@media (max-width: 600px) {\n  .grid-layout {\n    grid-template-columns: 1fr;\n  }\n}",
    target_html: '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;"><div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center;">1-ustun</div><div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center;">2-ustun</div></div>',
    target_css: "",
    tests: [
      { type: "style", selector: ".grid-layout", property: "display", op: "==", value: "grid", label: ".grid-layout display: grid bo'lishi kerak" },
      { type: "count", selector: ".col", op: "==", value: 2, label: "2 ta .col bloki mavjud" },
    ],
    fallback_hints: {
      "1": "Telefon ekranlari uchun alohida stil yozishda CSS-da qaysi qoidadan foydalanamiz?",
      "2": "@media (max-width: 600px) bloki ichida .grid-layout ning grid-template-columns xossasini o'zgartiring.",
      "3": "@media (max-width: 600px) { .grid-layout { grid-template-columns: 1fr; } } deb yoziladi.",
      "4": "@media (max-width: 600px) {\n  .grid-layout {\n    grid-template-columns: 1fr;\n  }\n}",
    },
    is_public: true,
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    title: "9. JavaScript: DOM elementini o'zgartirish",
    description_md:
      "JavaScript orqali sahifadagi `#title` sarlavha matnini **\"Salom, JavaScript!\"** ga o'zgartiring va uning matn rangini `style.color = \"#10b981\"` (yashil) qilib belgilang.",
    level: 1,
    topics: ["javascript", "dom"],
    starter_html: '<h1 id="title">Eski sarlavha</h1>\n<p>JavaScript orqali sarlavha matnini va rangini yangilang.</p>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  text-align: center;\n  background: #f8fafc;\n}\n\n#title {\n  font-size: 28px;\n  font-weight: 800;\n  color: #1e293b;\n  transition: all 0.3s ease;\n}",
    starter_js:
      "// 1. Elementni id orqali toping\nconst title = document.getElementById(\"title\");\n\n// 2. Sarlavha matnini va rangini o'zgartiring\n",
    solution_html: '<h1 id="title">Salom, JavaScript!</h1>\n<p>JavaScript orqali sarlavha matnini va rangini yangilang.</p>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  text-align: center;\n  background: #f8fafc;\n}\n\n#title {\n  font-size: 28px;\n  font-weight: 800;\n  color: #10b981;\n  transition: all 0.3s ease;\n}",
    solution_js:
      'const title = document.getElementById("title");\ntitle.textContent = "Salom, JavaScript!";\ntitle.style.color = "#10b981";',
    target_html:
      '<div style="font-family: sans-serif; padding: 30px; text-align: center; background: #f8fafc;"><h1 style="font-size: 28px; font-weight: 800; color: #10b981; margin-bottom: 8px;">Salom, JavaScript!</h1><p style="color: #64748b; margin: 0;">JavaScript orqali sarlavha matnini va rangini yangilang.</p></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#title", label: "#title sarlavha elementi mavjud" },
      { type: "text", selector: "#title", contains: "Salom, JavaScript!", label: "Sarlavha matni 'Salom, JavaScript!' ga o'zgargan" },
      { type: "style", selector: "#title", property: "color", op: "==", value: "rgb(16, 185, 129)", label: "Sarlavha matn rangi #10b981 (yashil) qilingan" },
    ],
    fallback_hints: {
      "1": "DOM element matnini o'zgartirish uchun textContent, uslubini o'zgartirish uchun esa style.color ishlatiladi.",
      "2": 'script.js faylida: title.textContent = "Salom, JavaScript!"; deb yozing.',
      "3": 'Rangni o\'zgartirish uchun: title.style.color = "#10b981"; deb qo\'shing.',
      "4": 'const title = document.getElementById("title");\ntitle.textContent = "Salom, JavaScript!";\ntitle.style.color = "#10b981";',
    },
    is_public: true,
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "10. JavaScript: Hisoblagich (Counter)",
    description_md:
      "`#btn-increment` tugmasi bosilganda (`click`), `#counter` ichidagi raqam **1 taga oshsin** (`0 -> 1 -> 2 ...`). Hodisalarni eshitish uchun `addEventListener` dan foydalaning.",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="counter-container">\n  <div id="counter">0</div>\n  <button id="btn-increment">+1 Qo\'shish</button>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #f1f5f9;\n}\n\n.counter-container {\n  text-align: center;\n  padding: 32px;\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.06);\n}\n\n#counter {\n  font-size: 54px;\n  font-weight: 900;\n  color: #2563eb;\n  margin-bottom: 16px;\n}\n\n#btn-increment {\n  padding: 12px 28px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  font-size: 16px;\n}",
    starter_js:
      'let count = 0;\nconst counter = document.getElementById("counter");\nconst btn = document.getElementById("btn-increment");\n\n// btn tugmasiga "click" hodisasini bog\'lang va count ni 1 ga oshiring\n',
    solution_html:
      '<div class="counter-container">\n  <div id="counter">0</div>\n  <button id="btn-increment">+1 Qo\'shish</button>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #f1f5f9;\n}\n\n.counter-container {\n  text-align: center;\n  padding: 32px;\n  background: white;\n  border-radius: 16px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.06);\n}\n\n#counter {\n  font-size: 54px;\n  font-weight: 900;\n  color: #2563eb;\n  margin-bottom: 16px;\n}\n\n#btn-increment {\n  padding: 12px 28px;\n  background: #2563eb;\n  color: white;\n  border: none;\n  border-radius: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  font-size: 16px;\n}",
    solution_js:
      'let count = 0;\nconst counter = document.getElementById("counter");\nconst btn = document.getElementById("btn-increment");\n\nbtn.addEventListener("click", () => {\n  count++;\n  counter.textContent = count;\n});',
    target_html:
      '<div style="text-align: center; padding: 32px; background: white; border-radius: 16px; font-family: sans-serif;"><div style="font-size: 54px; font-weight: 900; color: #2563eb; margin-bottom: 16px;">1</div><button style="padding: 12px 28px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 16px;">+1 Qo\'shish</button></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#btn-increment", label: "+1 Qo'shish tugmasi mavjud" },
      { type: "click_text", selector: "#btn-increment", targetSelector: "#counter", value: "1", label: "Tugma bosilganda raqam 1 ga oshadi" },
    ],
    fallback_hints: {
      "1": "Tugmani bosganda funksiya bajarilishi uchun addEventListener('click', ...) qo'llaniladi.",
      "2": 'btn.addEventListener("click", function() { count++; counter.textContent = count; });',
      "3": "counter.textContent = count orqali ekrandagi matn yangi son bilan almashtiriladi.",
      "4": 'let count = 0;\nconst counter = document.getElementById("counter");\nconst btn = document.getElementById("btn-increment");\n\nbtn.addEventListener("click", () => {\n  count++;\n  counter.textContent = count;\n});',
    },
    is_public: true,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "11. JavaScript: Tun rejimini almashtirish (Dark Mode)",
    description_md:
      "`#toggle-theme` tugmasi bosilganda `#card` elementiga `dark` klassini qo'shing yoki olib tashlang (`classList.toggle(\"dark\")`). CSS-da `.dark` uchun qorong'u fon ko'rsatilgan.",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div id="card" class="card-theme">\n  <h3>Tizim sozlamalari</h3>\n  <p id="theme-status">Hozirgi holat: Kunduzgi rejim</p>\n  <button id="toggle-theme">Rejimni o\'zgartirish 🌙</button>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.card-theme {\n  padding: 28px;\n  border-radius: 16px;\n  background: white;\n  color: #1e293b;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n  text-align: center;\n  transition: all 0.3s ease;\n}\n\n.card-theme.dark {\n  background: #0f172a;\n  color: #f8fafc;\n  border-color: #334155;\n}\n\n#toggle-theme {\n  padding: 10px 20px;\n  border-radius: 10px;\n  background: #6366f1;\n  color: white;\n  border: none;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 14px;\n}",
    starter_js:
      'const toggleBtn = document.getElementById("toggle-theme");\nconst card = document.getElementById("card");\n\n// toggleBtn bosilganda card elementiga "dark" klassini toggle qiling\n',
    solution_html:
      '<div id="card" class="card-theme dark">\n  <h3>Tizim sozlamalari</h3>\n  <p id="theme-status">Hozirgi holat: Tun rejimi</p>\n  <button id="toggle-theme">Rejimni o\'zgartirish 🌙</button>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.card-theme {\n  padding: 28px;\n  border-radius: 16px;\n  background: white;\n  color: #1e293b;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n  text-align: center;\n  transition: all 0.3s ease;\n}\n\n.card-theme.dark {\n  background: #0f172a;\n  color: #f8fafc;\n  border-color: #334155;\n}\n\n#toggle-theme {\n  padding: 10px 20px;\n  border-radius: 10px;\n  background: #6366f1;\n  color: white;\n  border: none;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 14px;\n}",
    solution_js:
      'const toggleBtn = document.getElementById("toggle-theme");\nconst card = document.getElementById("card");\n\ntoggleBtn.addEventListener("click", () => {\n  card.classList.toggle("dark");\n});',
    target_html:
      '<div style="font-family: sans-serif; padding: 28px; border-radius: 16px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; text-align: center; max-width: 380px;"><h3 style="margin-top:0;">Tizim sozlamalari</h3><p style="color: #94a3b8;">Hozirgi holat: Tun rejimi</p><button style="padding: 10px 20px; border-radius: 10px; background: #6366f1; color: white; border: none; font-weight: 600;">Rejimni o\'zgartirish 🌙</button></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#toggle-theme", label: "Rejim tugmasi mavjud" },
      { type: "click_class", selector: "#toggle-theme", targetSelector: "#card", className: "dark", label: "Tugma bosilganda #card ga 'dark' klassi ulanadi" },
    ],
    fallback_hints: {
      "1": "DOM elementiga klass qo'shish va olib tashlash uchun element.classList.toggle(\"klass_nomi\") ishlatiladi.",
      "2": 'toggleBtn ga "click" hodisasini qo\'shing va card.classList.toggle("dark") ni chaqiring.',
      "3": 'toggleBtn.addEventListener("click", () => { card.classList.toggle("dark"); });',
      "4": 'const toggleBtn = document.getElementById("toggle-theme");\nconst card = document.getElementById("card");\n\ntoggleBtn.addEventListener("click", () => {\n  card.classList.toggle("dark");\n});',
    },
    is_public: true,
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    title: "12. JavaScript: Ro'yxatga element qo'shish (To-Do)",
    description_md:
      "`#add-btn` tugmasi bosilganda, `#item-input` maydonidagi matnni olib, `#todo-list` ichiga yangi `<li>` tegi yaratib (`document.createElement(\"li\")`) qo'shing va input maydonini tozalang.",
    level: 3,
    topics: ["javascript", "dom", "forms"],
    starter_html:
      '<div class="todo-box">\n  <h3>Rejalar ro\'yxati</h3>\n  <div class="input-row">\n    <input id="item-input" type="text" placeholder="Yangi vazifa..." />\n    <button id="add-btn">Qo\'shish</button>\n  </div>\n  <ul id="todo-list">\n    <li>HTML asoslarini o\'rganish</li>\n  </ul>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.todo-box {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 4px 16px rgba(0,0,0,0.06);\n  width: 100%;\n  max-width: 360px;\n}\n\n.input-row {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n}\n\n#item-input {\n  flex: 1;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n}\n\n#add-btn {\n  padding: 10px 16px;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\nul {\n  margin: 0;\n  padding-left: 20px;\n  color: #334155;\n}\n\nli {\n  padding: 6px 0;\n}",
    starter_js:
      'const input = document.getElementById("item-input");\nconst addBtn = document.getElementById("add-btn");\nconst list = document.getElementById("todo-list");\n\n// addBtn bosilganda:\n// 1. input.value dagi matnni tekshiring\n// 2. document.createElement("li") yarating\n// 3. li.textContent ga matnni yozib list.appendChild(li) qiling\n// 4. input.value = "" qilib tozalang\n',
    solution_html:
      '<div class="todo-box">\n  <h3>Rejalar ro\'yxati</h3>\n  <div class="input-row">\n    <input id="item-input" type="text" placeholder="Yangi vazifa..." />\n    <button id="add-btn">Qo\'shish</button>\n  </div>\n  <ul id="todo-list">\n    <li>HTML asoslarini o\'rganish</li>\n    <li>CSS Grid bilan ishlash</li>\n  </ul>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.todo-box {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 4px 16px rgba(0,0,0,0.06);\n  width: 100%;\n  max-width: 360px;\n}\n\n.input-row {\n  display: flex;\n  gap: 8px;\n  margin-bottom: 16px;\n}\n\n#item-input {\n  flex: 1;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n}\n\n#add-btn {\n  padding: 10px 16px;\n  background: #10b981;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\nul {\n  margin: 0;\n  padding-left: 20px;\n  color: #334155;\n}\n\nli {\n  padding: 6px 0;\n}",
    solution_js:
      'const input = document.getElementById("item-input");\nconst addBtn = document.getElementById("add-btn");\nconst list = document.getElementById("todo-list");\n\naddBtn.addEventListener("click", () => {\n  const val = input.value.trim();\n  if (val) {\n    const li = document.createElement("li");\n    li.textContent = val;\n    list.appendChild(li);\n    input.value = "";\n  }\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 360px;"><h3 style="margin-top:0;">Rejalar ro\'yxati</h3><ul style="margin: 0; padding-left: 20px;"><li style="padding: 4px 0;">HTML asoslarini o\'rganish</li><li style="padding: 4px 0; color: #10b981; font-weight: bold;">JavaScript bilan yangi element</li></ul></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#item-input", label: "#item-input maydoni mavjud" },
      { type: "exists", selector: "#add-btn", label: "#add-btn tugmasi mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const inp = document.getElementById('item-input'); const btn = document.getElementById('add-btn'); const list = document.getElementById('todo-list'); const before = list.querySelectorAll('li').length; inp.value = 'CSS Grid'; btn.click(); const after = list.querySelectorAll('li').length; return after > before && list.textContent.includes('CSS Grid') && inp.value === ''; })()",
        label: "Tugma bosilganda yangi li qo'shiladi va input tozalanadi",
      },
    ],
    fallback_hints: {
      "1": "Yangi element yaratish uchun document.createElement(\"li\"), qo'shish uchun esa list.appendChild(li) ishlatiladi.",
      "2": 'addBtn.addEventListener("click", () => { const li = document.createElement("li"); li.textContent = input.value; list.appendChild(li); input.value = ""; });',
      "3": 'input.value = ""; orqali kiritish maydonini qayta bo\'shatib qo\'yamiz.',
      "4": 'const input = document.getElementById("item-input");\nconst addBtn = document.getElementById("add-btn");\nconst list = document.getElementById("todo-list");\n\naddBtn.addEventListener("click", () => {\n  const val = input.value.trim();\n  if (val) {\n    const li = document.createElement("li");\n    li.textContent = val;\n    list.appendChild(li);\n    input.value = "";\n  }\n});',
    },
    is_public: true,
  },
  {
    id: "d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1",
    title: "13. JavaScript: Ro'yxatdan element o'chirish (Delete Todo)",
    description_md:
      "`#todo-list` ichidagi har bir `.remove-btn` tugmasi bosilganda mos keluvchi `<li>` elementi o'chirilsin (`btn.parentElement.remove()`). Har bir tugmaga `addEventListener('click', ...)` ni bog'lang.",
    level: 3,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="todo-box">\n  <h3>Rejalar ro\'yxati</h3>\n  <ul id="todo-list">\n    <li>HTML asoslarini o\'rganish <button class="remove-btn">O\'chirish</button></li>\n    <li>CSS Grid bilan ishlash <button class="remove-btn">O\'chirish</button></li>\n  </ul>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.todo-box {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 4px 16px rgba(0,0,0,0.06);\n  width: 100%;\n  max-width: 380px;\n}\n\nul {\n  margin: 0;\n  padding-left: 20px;\n  color: #334155;\n}\n\nli {\n  padding: 8px 0;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.remove-btn {\n  padding: 4px 10px;\n  background: #ef4444;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: bold;\n  cursor: pointer;\n}",
    starter_js:
      '// 1. Barcha .remove-btn tugmalarini toping (document.querySelectorAll)\nconst removeBtns = document.querySelectorAll(".remove-btn");\n\n// 2. Har bir tugmaga click hodisasini bog\'lab, uning ota elementi (li) ni o\'chiring\n',
    solution_html:
      '<div class="todo-box">\n  <h3>Rejalar ro\'yxati</h3>\n  <ul id="todo-list">\n    <li>HTML asoslarini o\'rganish <button class="remove-btn">O\'chirish</button></li>\n  </ul>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.todo-box {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 4px 16px rgba(0,0,0,0.06);\n  width: 100%;\n  max-width: 380px;\n}\n\nul {\n  margin: 0;\n  padding-left: 20px;\n  color: #334155;\n}\n\nli {\n  padding: 8px 0;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.remove-btn {\n  padding: 4px 10px;\n  background: #ef4444;\n  color: white;\n  border: none;\n  border-radius: 6px;\n  font-size: 12px;\n  font-weight: bold;\n  cursor: pointer;\n}",
    solution_js:
      'const removeBtns = document.querySelectorAll(".remove-btn");\n\nremoveBtns.forEach(function(btn) {\n  btn.addEventListener("click", function() {\n    btn.parentElement.remove();\n  });\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 380px;"><h3 style="margin-top:0;">Rejalar ro\'yxati</h3><ul style="margin: 0; padding-left: 20px;"><li style="padding: 6px 0;">HTML asoslarini o\'rganish</li></ul><p style="color: #64748b; font-size: 12px; margin-top: 10px;">Bir element o\'chirilgandagi holat</p></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: ".remove-btn", label: ".remove-btn tugmalari mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const btn = document.querySelector('.remove-btn'); if (!btn) return false; const liCountBefore = document.querySelectorAll('#todo-list li').length; btn.click(); const liCountAfter = document.querySelectorAll('#todo-list li').length; return liCountAfter === liCountBefore - 1; })()",
        label: "Tugma bosilganda mos <li> elementi o'chadi",
      },
    ],
    fallback_hints: {
      "1": "Har bir tugmani topish uchun document.querySelectorAll('.remove-btn') dan foydalaning va forEach orqali aylanib chiqing.",
      "2": "Tugmani bosganda uning ota elementi (li) ni o'chirish uchun: btn.parentElement.remove(); ishlatiladi.",
      "3": "removeBtns.forEach((btn) => { btn.addEventListener('click', () => { btn.parentElement.remove(); }); });",
      "4": 'const removeBtns = document.querySelectorAll(".remove-btn");\n\nremoveBtns.forEach(function(btn) {\n  btn.addEventListener("click", function() {\n    btn.parentElement.remove();\n  });\n});',
    },
    is_public: true,
  },
  {
    id: "e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1",
    title: "14. JavaScript: Parol ko'rsatish va yashirish",
    description_md:
      "`#toggle-btn` tugmasi bosilganda `#password-input` maydonining `type` atributini almashtiring: agar `password` bo'lsa `text` ga o'zgartirilsin va tugma matni `Yashirish` bo'lsin, aks holda yana `password` ga qaytarilib tugma matni `Ko'rsatish` bo'lsin.",
    level: 1,
    topics: ["javascript", "dom", "forms"],
    starter_html:
      '<div class="auth-card">\n  <h3>Tizimga kirish</h3>\n  <div class="field-row">\n    <input id="password-input" type="password" value="MaxfiyParol123" />\n    <button id="toggle-btn">Ko\'rsatish</button>\n  </div>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.auth-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 360px;\n}\n\n.field-row {\n  display: flex;\n  gap: 8px;\n  margin-top: 12px;\n}\n\n#password-input {\n  flex: 1;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n}\n\n#toggle-btn {\n  padding: 10px 16px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 600;\n  cursor: pointer;\n}",
    starter_js:
      'const input = document.getElementById("password-input");\nconst toggleBtn = document.getElementById("toggle-btn");\n\n// toggleBtn bosilganda input.type ni va tugma matnini almashtiring\n',
    solution_html:
      '<div class="auth-card">\n  <h3>Tizimga kirish</h3>\n  <div class="field-row">\n    <input id="password-input" type="text" value="MaxfiyParol123" />\n    <button id="toggle-btn">Yashirish</button>\n  </div>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.auth-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 360px;\n}\n\n.field-row {\n  display: flex;\n  gap: 8px;\n  margin-top: 12px;\n}\n\n#password-input {\n  flex: 1;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n}\n\n#toggle-btn {\n  padding: 10px 16px;\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 600;\n  cursor: pointer;\n}",
    solution_js:
      'const input = document.getElementById("password-input");\nconst toggleBtn = document.getElementById("toggle-btn");\n\ntoggleBtn.addEventListener("click", () => {\n  if (input.type === "password") {\n    input.type = "text";\n    toggleBtn.textContent = "Yashirish";\n  } else {\n    input.type = "password";\n    toggleBtn.textContent = "Ko\'rsatish";\n  }\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 360px;"><h3 style="margin-top:0;">Tizimga kirish</h3><div style="display:flex;gap:8px;"><input type="text" value="MaxfiyParol123" style="flex:1;padding:10px;border:1px solid #cbd5e1;border-radius:10px;" /><button style="padding:10px 16px;background:#3b82f6;color:white;border:none;border-radius:10px;font-weight:600;">Yashirish</button></div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#toggle-btn", label: "#toggle-btn tugmasi mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const inp = document.getElementById('password-input'); const btn = document.getElementById('toggle-btn'); if (!inp || !btn) return false; btn.click(); const isText = inp.type === 'text' && btn.textContent.toLowerCase().includes('yashir'); btn.click(); const isPass = inp.type === 'password' && btn.textContent.toLowerCase().includes('ko'); return isText && isPass; })()",
        label: "Tugma bosilganda input turi 'text' va 'password' ga almashadi",
      },
    ],
    fallback_hints: {
      "1": "Input turini o'zgartirish uchun: input.type = (input.type === 'password' ? 'text' : 'password'); ishlatiladi.",
      "2": "Tugma matnini o'zgartirish uchun esa: toggleBtn.textContent = 'Yashirish'; yoki 'Ko\\'rsatish';",
      "3": "toggleBtn.addEventListener('click', () => { if (input.type === 'password') { input.type = 'text'; toggleBtn.textContent = 'Yashirish'; } else { input.type = 'password'; toggleBtn.textContent = 'Ko\\'rsatish'; } });",
      "4": 'const input = document.getElementById("password-input");\nconst toggleBtn = document.getElementById("toggle-btn");\n\ntoggleBtn.addEventListener("click", () => {\n  if (input.type === "password") {\n    input.type = "text";\n    toggleBtn.textContent = "Yashirish";\n  } else {\n    input.type = "password";\n    toggleBtn.textContent = "Ko\'rsatish";\n  }\n});',
    },
    is_public: true,
  },
  {
    id: "f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1",
    title: "15. JavaScript: Belgilar hisoblagichi (Char Counter)",
    description_md:
      "`#msg-input` matn maydoniga har safar yangi belgi yozilganda yoki o'chirilganda (`input` hodisasi), `#char-count` elementi ichidagi raqamni kiritilgan belgilar soniga (`input.value.length`) tenglab yangilang.",
    level: 1,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="counter-card">\n  <h3>Izoh qoldirish</h3>\n  <textarea id="msg-input" placeholder="Xabaringizni yozing..."></textarea>\n  <div class="counter-info">Belgilar soni: <span id="char-count">0</span> / 100</div>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.counter-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n}\n\n#msg-input {\n  width: 100%;\n  box-sizing: border-box;\n  height: 100px;\n  padding: 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  resize: none;\n  outline: none;\n  font-family: inherit;\n}\n\n.counter-info {\n  margin-top: 10px;\n  font-size: 13px;\n  color: #64748b;\n  text-align: right;\n}\n\n#char-count {\n  font-weight: bold;\n  color: #0284c7;\n}",
    starter_js:
      'const input = document.getElementById("msg-input");\nconst counter = document.getElementById("char-count");\n\n// input ga "input" hodisasini qo\'shing va counter.textContent ni yangilang\n',
    solution_html:
      '<div class="counter-card">\n  <h3>Izoh qoldirish</h3>\n  <textarea id="msg-input" placeholder="Xabaringizni yozing...">Salom dunyo!</textarea>\n  <div class="counter-info">Belgilar soni: <span id="char-count">12</span> / 100</div>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.counter-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n}\n\n#msg-input {\n  width: 100%;\n  box-sizing: border-box;\n  height: 100px;\n  padding: 12px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  resize: none;\n  outline: none;\n  font-family: inherit;\n}\n\n.counter-info {\n  margin-top: 10px;\n  font-size: 13px;\n  color: #64748b;\n  text-align: right;\n}\n\n#char-count {\n  font-weight: bold;\n  color: #0284c7;\n}",
    solution_js:
      'const input = document.getElementById("msg-input");\nconst counter = document.getElementById("char-count");\n\ninput.addEventListener("input", () => {\n  counter.textContent = String(input.value.length);\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 380px;"><h3 style="margin-top:0;">Izoh qoldirish</h3><div style="border:1px solid #cbd5e1;padding:12px;border-radius:10px;height:70px;color:#334155;">Salom dunyo!</div><div style="margin-top:10px;font-size:13px;color:#64748b;text-align:right;">Belgilar soni: <span style="font-weight:bold;color:#0284c7;">12</span> / 100</div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#msg-input", label: "#msg-input maydoni mavjud" },
      { type: "exists", selector: "#char-count", label: "#char-count elementi mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const inp = document.getElementById('msg-input'); const counter = document.getElementById('char-count'); if (!inp || !counter) return false; inp.value = 'Frontend Dasturchi'; inp.dispatchEvent(new Event('input')); return counter.textContent.trim() === '18'; })()",
        label: "Matn kiritilganda belgilar soni avtomatik sanaladi",
      },
    ],
    fallback_hints: {
      "1": "Foydalanuvchi har safar tugma bosganda qiymatni kuzatish uchun 'input' hodisasi (event) ishlatiladi.",
      "2": "Kiritilgan belgilar sonini input.value.length orqali aniqlash mumkin.",
      "3": "input.addEventListener('input', () => { counter.textContent = input.value.length; });",
      "4": 'const input = document.getElementById("msg-input");\nconst counter = document.getElementById("char-count");\n\ninput.addEventListener("input", () => {\n  counter.textContent = String(input.value.length);\n});',
    },
    is_public: true,
  },
  {
    id: "a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2",
    title: "16. JavaScript: Modal oynani ochish va yopish",
    description_md:
      "`#open-modal` tugmasi bosilganda `#modal-overlay` elementidan `hidden` klassini olib tashlang (`classList.remove('hidden')`). `#close-modal` tugmasi bosilganda esa yana `hidden` klassini qo'shing (`classList.add('hidden')`).",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="page-container">\n  <button id="open-modal">Modalni ochish 🚀</button>\n  <div id="modal-overlay" class="modal-backdrop hidden">\n    <div class="modal-card">\n      <h3>Tabriklaymiz! 🎉</h3>\n      <p>Siz yangi bilim va ko\'nikmalarni muvaffaqiyatli o\'zlashtiryapsiz.</p>\n      <button id="close-modal">Yopish</button>\n    </div>\n  </div>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n#open-modal {\n  padding: 12px 24px;\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  border-radius: 12px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(15, 23, 42, 0.6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  backdrop-filter: blur(4px);\n}\n\n.modal-backdrop.hidden {\n  display: none !important;\n}\n\n.modal-card {\n  background: white;\n  padding: 28px;\n  border-radius: 16px;\n  width: 90%;\n  max-width: 360px;\n  text-align: center;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n}\n\n#close-modal {\n  margin-top: 16px;\n  padding: 10px 20px;\n  background: #ef4444;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 600;\n  cursor: pointer;\n}",
    starter_js:
      'const openBtn = document.getElementById("open-modal");\nconst closeBtn = document.getElementById("close-modal");\nconst modal = document.getElementById("modal-overlay");\n\n// 1. openBtn bosilganda modal dan "hidden" klassini olib tashlang\n// 2. closeBtn bosilganda modal ga "hidden" klassini qo\'shing\n',
    solution_html:
      '<div class="page-container">\n  <button id="open-modal">Modalni ochish 🚀</button>\n  <div id="modal-overlay" class="modal-backdrop">\n    <div class="modal-card">\n      <h3>Tabriklaymiz! 🎉</h3>\n      <p>Siz yangi bilim va ko\'nikmalarni muvaffaqiyatli o\'zlashtiryapsiz.</p>\n      <button id="close-modal">Yopish</button>\n    </div>\n  </div>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n#open-modal {\n  padding: 12px 24px;\n  background: #8b5cf6;\n  color: white;\n  border: none;\n  border-radius: 12px;\n  font-weight: 700;\n  cursor: pointer;\n}\n\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(15, 23, 42, 0.6);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  backdrop-filter: blur(4px);\n}\n\n.modal-backdrop.hidden {\n  display: none !important;\n}\n\n.modal-card {\n  background: white;\n  padding: 28px;\n  border-radius: 16px;\n  width: 90%;\n  max-width: 360px;\n  text-align: center;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);\n}\n\n#close-modal {\n  margin-top: 16px;\n  padding: 10px 20px;\n  background: #ef4444;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 600;\n  cursor: pointer;\n}",
    solution_js:
      'const openBtn = document.getElementById("open-modal");\nconst closeBtn = document.getElementById("close-modal");\nconst modal = document.getElementById("modal-overlay");\n\nopenBtn.addEventListener("click", () => {\n  modal.classList.remove("hidden");\n});\n\ncloseBtn.addEventListener("click", () => {\n  modal.classList.add("hidden");\n});',
    target_html:
      '<div style="font-family: sans-serif; padding: 24px; text-align: center;"><div style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; max-width: 340px; margin: 0 auto; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);"><h3 style="margin-top:0;">Tabriklaymiz! 🎉</h3><p style="color: #64748b;">Modal oyna ko\'rinishi</p><button style="padding: 8px 18px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600;">Yopish</button></div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#open-modal", label: "#open-modal tugmasi mavjud" },
      { type: "exists", selector: "#close-modal", label: "#close-modal tugmasi mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const open = document.getElementById('open-modal'); const close = document.getElementById('close-modal'); const modal = document.getElementById('modal-overlay'); if (!open || !close || !modal) return false; open.click(); const opened = !modal.classList.contains('hidden'); close.click(); const closed = modal.classList.contains('hidden'); return opened && closed; })()",
        label: "Modal oynani ochish va yopish tugmalari to'g'ri ishlaydi",
      },
    ],
    fallback_hints: {
      "1": "Element klassini olib tashlash uchun element.classList.remove('hidden'), qo'shish uchun esa element.classList.add('hidden') ishlatiladi.",
      "2": "openBtn ga 'click' hodisasida modal.classList.remove('hidden') ni bajaring.",
      "3": "closeBtn ga 'click' hodisasida modal.classList.add('hidden') ni bajaring.",
      "4": 'const openBtn = document.getElementById("open-modal");\nconst closeBtn = document.getElementById("close-modal");\nconst modal = document.getElementById("modal-overlay");\n\nopenBtn.addEventListener("click", () => {\n  modal.classList.remove("hidden");\n});\n\ncloseBtn.addEventListener("click", () => {\n  modal.classList.add("hidden");\n});',
    },
    is_public: true,
  },
  {
    id: "b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2",
    title: "17. JavaScript: Jonli qidiruv filtri (Live Search)",
    description_md:
      "`#search-input` ga matn yozilganda (`input` hodisasi orqali), `#skills-list li` elementlarini aylanib chiqing. Agar element matni kiritilgan so'zni o'z ichiga olsa `li.style.display = ''` qilib ko'rsating, aks holda `li.style.display = 'none'` qilib yashiring.",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="filter-card">\n  <h3>Texnologiyalar qidiruvi</h3>\n  <input id="search-input" type="text" placeholder="Qidirish (masalan: React)..." />\n  <ul id="skills-list">\n    <li>JavaScript</li>\n    <li>React</li>\n    <li>TypeScript</li>\n    <li>Node.js</li>\n  </ul>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.filter-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 360px;\n}\n\n#search-input {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n  margin-bottom: 14px;\n}\n\nul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\nli {\n  padding: 10px 14px;\n  border-radius: 8px;\n  margin-bottom: 6px;\n  background: #f1f5f9;\n  color: #334155;\n  font-weight: 600;\n}",
    starter_js:
      'const searchInput = document.getElementById("search-input");\nconst items = document.querySelectorAll("#skills-list li");\n\n// searchInput ga "input" hodisasini qo\'shing\n// Har bir element matnini searchInput.value bilan solishtirib, mos kelmasa yashiring\n',
    solution_html:
      '<div class="filter-card">\n  <h3>Texnologiyalar qidiruvi</h3>\n  <input id="search-input" type="text" placeholder="Qidirish (masalan: React)..." value="React" />\n  <ul id="skills-list">\n    <li style="display: none;">JavaScript</li>\n    <li>React</li>\n    <li style="display: none;">TypeScript</li>\n    <li style="display: none;">Node.js</li>\n  </ul>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.filter-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 360px;\n}\n\n#search-input {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 10px 14px;\n  border: 1px solid #cbd5e1;\n  border-radius: 10px;\n  outline: none;\n  margin-bottom: 14px;\n}\n\nul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\nli {\n  padding: 10px 14px;\n  border-radius: 8px;\n  margin-bottom: 6px;\n  background: #f1f5f9;\n  color: #334155;\n  font-weight: 600;\n}",
    solution_js:
      'const searchInput = document.getElementById("search-input");\nconst items = document.querySelectorAll("#skills-list li");\n\nsearchInput.addEventListener("input", () => {\n  const query = searchInput.value.toLowerCase().trim();\n  items.forEach((item) => {\n    const text = item.textContent.toLowerCase();\n    if (text.includes(query)) {\n      item.style.display = "";\n    } else {\n      item.style.display = "none";\n    }\n  });\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 360px;"><h3 style="margin-top:0;">Texnologiyalar qidiruvi</h3><input type="text" value="React" style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #cbd5e1;border-radius:8px;margin-bottom:12px;" /><div style="padding:10px;border-radius:8px;background:#e0e7ff;color:#4338ca;font-weight:bold;">React</div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#search-input", label: "#search-input qidiruv maydoni mavjud" },
      { type: "exists", selector: "#skills-list li", label: "#skills-list ichida ro'yxat elementlari mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const inp = document.getElementById('search-input'); const items = document.querySelectorAll('#skills-list li'); if (!inp || items.length === 0) return false; inp.value = 'Type'; inp.dispatchEvent(new Event('input')); const tsItem = Array.from(items).find(li => li.textContent.includes('TypeScript')); const jsItem = Array.from(items).find(li => li.textContent.includes('JavaScript')); const correct = tsItem.style.display !== 'none' && jsItem.style.display === 'none'; inp.value = ''; inp.dispatchEvent(new Event('input')); const allVisible = Array.from(items).every(li => li.style.display !== 'none'); return correct && allVisible; })()",
        label: "Kiritilgan so'z bo'yicha mos elementlar ko'rinadi va mos bo'lmaganlari yashiriladi",
      },
    ],
    fallback_hints: {
      "1": "Matn kiritishda harflar registrini (katta-kichikligini) inobatga olmaslik uchun .toLowerCase() metodidan foydalaning.",
      "2": "Elementni yashirish uchun: item.style.display = 'none'; qayta ko'rsatish uchun esa: item.style.display = '';",
      "3": "items.forEach(li => { li.style.display = li.textContent.toLowerCase().includes(query) ? '' : 'none'; });",
      "4": 'const searchInput = document.getElementById("search-input");\nconst items = document.querySelectorAll("#skills-list li");\n\nsearchInput.addEventListener("input", () => {\n  const query = searchInput.value.toLowerCase().trim();\n  items.forEach((item) => {\n    const text = item.textContent.toLowerCase();\n    if (text.includes(query)) {\n      item.style.display = "";\n    } else {\n      item.style.display = "none";\n    }\n  });\n});',
    },
    is_public: true,
  },
  {
    id: "c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2",
    title: "18. JavaScript: Savol-Javob paneli (Accordion)",
    description_md:
      "Har bir `.accordion-btn` tugmasi bosilganda, uning pastidagi javob bloki bo'lgan `.accordion-content` elementiga `open` klassini toggle qiling (`btn.nextElementSibling.classList.toggle('open')`).",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="faq-container">\n  <div class="faq-item">\n    <button class="accordion-btn">HTML nima?</button>\n    <div class="accordion-content">\n      <p>HTML — bu veb-sahifalarning tuzilishini belgilovchi belgilash tili.</p>\n    </div>\n  </div>\n  <div class="faq-item">\n    <button class="accordion-btn">CSS nima?</button>\n    <div class="accordion-content">\n      <p>CSS — bu veb-sahifa elementlarining ko\'rinishi va dizaynini belgilovchi uslublar jadvali.</p>\n    </div>\n  </div>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.faq-container {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.faq-item {\n  background: white;\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n}\n\n.accordion-btn {\n  width: 100%;\n  text-align: left;\n  padding: 14px 18px;\n  background: none;\n  border: none;\n  font-size: 15px;\n  font-weight: 700;\n  color: #1e293b;\n  cursor: pointer;\n  display: flex;\n  justify-content: space-between;\n}\n\n.accordion-content {\n  display: none;\n  padding: 0 18px 14px;\n  color: #64748b;\n  font-size: 14px;\n  line-height: 1.5;\n}\n\n.accordion-content.open {\n  display: block;\n}",
    starter_js:
      'const buttons = document.querySelectorAll(".accordion-btn");\n\n// Har bir tugmaga click hodisasi bog\'lang\n// Tugma bosilganda uning yonidagi (nextElementSibling) elementga "open" klassini toggle qiling\n',
    solution_html:
      '<div class="faq-container">\n  <div class="faq-item">\n    <button class="accordion-btn">HTML nima?</button>\n    <div class="accordion-content open">\n      <p>HTML — bu veb-sahifalarning tuzilishini belgilovchi belgilash tili.</p>\n    </div>\n  </div>\n  <div class="faq-item">\n    <button class="accordion-btn">CSS nima?</button>\n    <div class="accordion-content">\n      <p>CSS — bu veb-sahifa elementlarining ko\'rinishi va dizaynini belgilovchi uslublar jadvali.</p>\n    </div>\n  </div>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.faq-container {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.faq-item {\n  background: white;\n  border-radius: 12px;\n  border: 1px solid #e2e8f0;\n  overflow: hidden;\n}\n\n.accordion-btn {\n  width: 100%;\n  text-align: left;\n  padding: 14px 18px;\n  background: none;\n  border: none;\n  font-size: 15px;\n  font-weight: 700;\n  color: #1e293b;\n  cursor: pointer;\n  display: flex;\n  justify-content: space-between;\n}\n\n.accordion-content {\n  display: none;\n  padding: 0 18px 14px;\n  color: #64748b;\n  font-size: 14px;\n  line-height: 1.5;\n}\n\n.accordion-content.open {\n  display: block;\n}",
    solution_js:
      'const buttons = document.querySelectorAll(".accordion-btn");\n\nbuttons.forEach((btn) => {\n  btn.addEventListener("click", () => {\n    btn.nextElementSibling.classList.toggle("open");\n  });\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; max-width: 380px;"><div style="font-weight: bold; color: #1e293b;">HTML nima?</div><p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">HTML — bu veb-sahifalarning tuzilishini belgilovchi belgilash tili.</p></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: ".accordion-btn", label: ".accordion-btn tugmalari mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const btns = document.querySelectorAll('.accordion-btn'); if (btns.length === 0) return false; const firstBtn = btns[0]; const content = firstBtn.nextElementSibling; if (!content) return false; firstBtn.click(); const isOpen = content.classList.contains('open'); firstBtn.click(); const isClosed = !content.classList.contains('open'); return isOpen && isClosed; })()",
        label: "Tugma bosilganda content bloki 'open' klassi bilan ochiladi va yopiladi",
      },
    ],
    fallback_hints: {
      "1": "Tugmaning bevosita keyingi elementi btn.nextElementSibling orqali olinadi.",
      "2": "Klassni bor bo'lsa o'chirish, yo'q bo'lsa qo'shish uchun: element.classList.toggle('open'); ishlatiladi.",
      "3": "buttons.forEach(btn => btn.addEventListener('click', () => btn.nextElementSibling.classList.toggle('open')));",
      "4": 'const buttons = document.querySelectorAll(".accordion-btn");\n\nbuttons.forEach((btn) => {\n  btn.addEventListener("click", () => {\n    btn.nextElementSibling.classList.toggle("open");\n  });\n});',
    },
    is_public: true,
  },
  {
    id: "d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2",
    title: "19. JavaScript: Tasodifiy rang generatori",
    description_md:
      "`#generate-btn` tugmasi bosilganda tasodifiy HEX rang kodi hosil qiling (masalan `#3B82F6`), `#color-box` elementining fon rangini (`backgroundColor`) shu rangga o'zgartiring va `#color-code` elementi ichiga rang kodini yozing.",
    level: 2,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="color-card">\n  <div id="color-box" class="preview-box"></div>\n  <div class="color-text">Tanlangan rang: <span id="color-code">#6366F1</span></div>\n  <button id="generate-btn">Yangi rang tanlash 🎨</button>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.color-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 340px;\n  text-align: center;\n}\n\n.preview-box {\n  width: 100%;\n  height: 120px;\n  background-color: #6366f1;\n  border-radius: 12px;\n  margin-bottom: 16px;\n  transition: background-color 0.3s ease;\n}\n\n.color-text {\n  font-weight: 600;\n  color: #334155;\n  margin-bottom: 16px;\n}\n\n#color-code {\n  font-family: monospace;\n  color: #6366f1;\n}\n\n#generate-btn {\n  padding: 10px 20px;\n  background: #0f172a;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 700;\n  cursor: pointer;\n}",
    starter_js:
      'const btn = document.getElementById("generate-btn");\nconst box = document.getElementById("color-box");\nconst code = document.getElementById("color-code");\n\n// btn bosilganda:\n// 1. Tasodifiy HEX rang yarating (masalan, "#" + Math.floor(Math.random()*16777215).toString(16))\n// 2. box.style.backgroundColor ni shu rangga tenglang\n// 3. code.textContent ga rang kodini yozing\n',
    solution_html:
      '<div class="color-card">\n  <div id="color-box" class="preview-box" style="background-color: #10b981;"></div>\n  <div class="color-text">Tanlangan rang: <span id="color-code">#10B981</span></div>\n  <button id="generate-btn">Yangi rang tanlash 🎨</button>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.color-card {\n  background: white;\n  padding: 24px;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 340px;\n  text-align: center;\n}\n\n.preview-box {\n  width: 100%;\n  height: 120px;\n  background-color: #6366f1;\n  border-radius: 12px;\n  margin-bottom: 16px;\n  transition: background-color 0.3s ease;\n}\n\n.color-text {\n  font-weight: 600;\n  color: #334155;\n  margin-bottom: 16px;\n}\n\n#color-code {\n  font-family: monospace;\n  color: #6366f1;\n}\n\n#generate-btn {\n  padding: 10px 20px;\n  background: #0f172a;\n  color: white;\n  border: none;\n  border-radius: 10px;\n  font-weight: 700;\n  cursor: pointer;\n}",
    solution_js:
      'const btn = document.getElementById("generate-btn");\nconst box = document.getElementById("color-box");\nconst code = document.getElementById("color-code");\n\nbtn.addEventListener("click", () => {\n  const chars = "0123456789ABCDEF";\n  let hex = "#";\n  for (let i = 0; i < 6; i++) {\n    hex += chars[Math.floor(Math.random() * 16)];\n  }\n  box.style.backgroundColor = hex;\n  code.textContent = hex;\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; max-width: 340px; text-align: center;"><div style="width: 100%; height: 100px; background-color: #10b981; border-radius: 12px; margin-bottom: 12px;"></div><div style="font-weight: 600; color: #334155;">Tanlangan rang: <span style="font-family: monospace; color: #10b981;">#10B981</span></div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: "#generate-btn", label: "#generate-btn tugmasi mavjud" },
      { type: "exists", selector: "#color-box", label: "#color-box preview mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const btn = document.getElementById('generate-btn'); const box = document.getElementById('color-box'); const code = document.getElementById('color-code'); if (!btn || !box || !code) return false; const oldCode = code.textContent.trim(); btn.click(); const newCode = code.textContent.trim(); return newCode !== oldCode && newCode.startsWith('#') && box.style.backgroundColor !== ''; })()",
        label: "Tugma bosilganda yangi HEX rang yaratiladi va fon yangilanadi",
      },
    ],
    fallback_hints: {
      "1": "HEX rang kodlari '#' bilan boshlanib 6 ta 0-9 va A-F belgilaridan iborat bo'ladi.",
      "2": "Tasodifiy butun son olish uchun: Math.floor(Math.random() * 16); ishlatiladi.",
      "3": "box.style.backgroundColor = hex; va code.textContent = hex; qilib qiymatlarni bering.",
      "4": 'const btn = document.getElementById("generate-btn");\nconst box = document.getElementById("color-box");\nconst code = document.getElementById("color-code");\n\nbtn.addEventListener("click", () => {\n  const chars = "0123456789ABCDEF";\n  let hex = "#";\n  for (let i = 0; i < 6; i++) {\n    hex += chars[Math.floor(Math.random() * 16)];\n  }\n  box.style.backgroundColor = hex;\n  code.textContent = hex;\n});',
    },
    is_public: true,
  },
  {
    id: "e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2",
    title: "20. JavaScript: Tabs (Vkladkalar) almashinuvi",
    description_md:
      "Har bir `.tab-btn` tugmasi bosilganda:\n1. Barcha `.tab-btn` lardagi `active` klassini olib tashlang va bosilganiga `active` bering.\n2. Barcha `.tab-content` lardagi `active` klassini olib tashlang.\n3. Bosilgan tugmaning `dataset.tab` atributidagi ID bo'yicha mos `.tab-content` elementini topib unga `active` klassini qo'shing.",
    level: 3,
    topics: ["javascript", "dom", "events"],
    starter_html:
      '<div class="tabs-card">\n  <div class="tabs-header">\n    <button class="tab-btn active" data-tab="tab-html">HTML</button>\n    <button class="tab-btn" data-tab="tab-css">CSS</button>\n    <button class="tab-btn" data-tab="tab-js">JS</button>\n  </div>\n  <div class="tabs-body">\n    <div id="tab-html" class="tab-content active">HTML — bu veb-sahifaning asosi va skeletidir.</div>\n    <div id="tab-css" class="tab-content">CSS — bu uslublar orqali ko\'rinishni go\'zallashtiradi.</div>\n    <div id="tab-js" class="tab-content">JavaScript — veb-sahifani jonli va interaktiv qiladi.</div>\n  </div>\n</div>',
    starter_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.tabs-card {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n  overflow: hidden;\n}\n\n.tabs-header {\n  display: flex;\n  background: #f1f5f9;\n  border-bottom: 1px solid #e2e8f0;\n}\n\n.tab-btn {\n  flex: 1;\n  padding: 12px;\n  background: none;\n  border: none;\n  font-weight: 700;\n  color: #64748b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.tab-btn.active {\n  background: white;\n  color: #0284c7;\n  border-bottom: 2px solid #0284c7;\n}\n\n.tabs-body {\n  padding: 20px;\n}\n\n.tab-content {\n  display: none;\n  color: #334155;\n  line-height: 1.5;\n}\n\n.tab-content.active {\n  display: block;\n}",
    starter_js:
      'const tabBtns = document.querySelectorAll(".tab-btn");\nconst tabContents = document.querySelectorAll(".tab-content");\n\n// Har bir tabBtn bosilganda:\n// 1. Barcha tugmalardan va tabContents lardan "active" klassini o\'chiring\n// 2. Bosilgan tugmaga "active" bering\n// 3. document.getElementById(btn.dataset.tab) ga "active" qo\'shing\n',
    solution_html:
      '<div class="tabs-card">\n  <div class="tabs-header">\n    <button class="tab-btn" data-tab="tab-html">HTML</button>\n    <button class="tab-btn" data-tab="tab-css">CSS</button>\n    <button class="tab-btn active" data-tab="tab-js">JS</button>\n  </div>\n  <div class="tabs-body">\n    <div id="tab-html" class="tab-content">HTML — bu veb-sahifaning asosi va skeletidir.</div>\n    <div id="tab-css" class="tab-content">CSS — bu uslublar orqali ko\'rinishni go\'zallashtiradi.</div>\n    <div id="tab-js" class="tab-content active">JavaScript — veb-sahifani jonli va interaktiv qiladi.</div>\n  </div>\n</div>',
    solution_css:
      "body {\n  font-family: sans-serif;\n  padding: 30px;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n}\n\n.tabs-card {\n  background: white;\n  border-radius: 16px;\n  border: 1px solid #e2e8f0;\n  width: 100%;\n  max-width: 380px;\n  overflow: hidden;\n}\n\n.tabs-header {\n  display: flex;\n  background: #f1f5f9;\n  border-bottom: 1px solid #e2e8f0;\n}\n\n.tab-btn {\n  flex: 1;\n  padding: 12px;\n  background: none;\n  border: none;\n  font-weight: 700;\n  color: #64748b;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.tab-btn.active {\n  background: white;\n  color: #0284c7;\n  border-bottom: 2px solid #0284c7;\n}\n\n.tabs-body {\n  padding: 20px;\n}\n\n.tab-content {\n  display: none;\n  color: #334155;\n  line-height: 1.5;\n}\n\n.tab-content.active {\n  display: block;\n}",
    solution_js:
      'const tabBtns = document.querySelectorAll(".tab-btn");\nconst tabContents = document.querySelectorAll(".tab-content");\n\ntabBtns.forEach((btn) => {\n  btn.addEventListener("click", () => {\n    tabBtns.forEach((b) => b.classList.remove("active"));\n    tabContents.forEach((c) => c.classList.remove("active"));\n    btn.classList.add("active");\n    const target = document.getElementById(btn.dataset.tab);\n    if (target) {\n      target.classList.add("active");\n    }\n  });\n});',
    target_html:
      '<div style="font-family: sans-serif; background: white; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 380px; overflow: hidden;"><div style="display: flex; background: #f1f5f9;"><div style="flex:1;padding:10px;text-align:center;font-weight:bold;color:#64748b;">HTML</div><div style="flex:1;padding:10px;text-align:center;font-weight:bold;color:#64748b;">CSS</div><div style="flex:1;padding:10px;text-align:center;font-weight:bold;background:white;color:#0284c7;border-bottom:2px solid #0284c7;">JS</div></div><div style="padding:18px;color:#334155;">JavaScript — veb-sahifani jonli va interaktiv qiladi.</div></div>',
    target_css: "",
    tests: [
      { type: "exists", selector: ".tab-btn", label: "Tab tugmalari mavjud" },
      { type: "exists", selector: ".tab-content", label: "Tab kontentlari mavjud" },
      {
        type: "js_eval",
        expr: "(() => { const btns = document.querySelectorAll('.tab-btn'); const jsBtn = Array.from(btns).find(b => b.dataset.tab === 'tab-js'); if (!jsBtn) return false; jsBtn.click(); const jsTab = document.getElementById('tab-js'); const htmlTab = document.getElementById('tab-html'); return jsBtn.classList.contains('active') && jsTab.classList.contains('active') && !htmlTab.classList.contains('active'); })()",
        label: "Tab bosilganda mos kontent faollashadi va qolganlari yashiriladi",
      },
    ],
    fallback_hints: {
      "1": "data-tab atributidagi qiymatni btn.dataset.tab orqali olish mumkin.",
      "2": "Barcha tugmalardan 'active' ni o'chirish uchun: tabBtns.forEach(b => b.classList.remove('active'));",
      "3": "Topilgan kontent elementiga: document.getElementById(btn.dataset.tab).classList.add('active');",
      "4": 'const tabBtns = document.querySelectorAll(".tab-btn");\nconst tabContents = document.querySelectorAll(".tab-content");\n\ntabBtns.forEach((btn) => {\n  btn.addEventListener("click", () => {\n    tabBtns.forEach((b) => b.classList.remove("active"));\n    tabContents.forEach((c) => c.classList.remove("active"));\n    btn.classList.add("active");\n    const target = document.getElementById(btn.dataset.tab);\n    if (target) {\n      target.classList.add("active");\n    }\n  });\n});',
    },
    is_public: true,
  },
];
