import { ChallengeAssertion } from "./tests-runner";

export interface ChallengeItem {
  id: string;
  title: string;
  description_md: string;
  level: 1 | 2 | 3;
  topics: string[];
  starter_html: string;
  starter_css: string;
  solution_html: string;
  solution_css: string;
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
];
