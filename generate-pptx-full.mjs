import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FONT = "맑은 고딕";
const SERIF = "Cormorant Garamond";
const GREEN = "6B9A6B";
const ROSE = "B07A6E";
const BLUE = "7A8FAB";
const TAN = "A08060";
const PURPLE = "8A7AB0";
const DARK = "2C2820";
const BODY = "5A5850";
const GREY = "AAA8A0";
const SIDEBAR_BG = "F7F4F0";
const BOX_BG = "F7F4F0";

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";

/* ══════════════ 공용 헬퍼 ══════════════ */

function estLines(text, w, fontSize, cpi = 85) {
  const charsPerLine = Math.max(8, Math.floor((w * cpi) / fontSize));
  return Math.max(1, Math.ceil(text.length / charsPerLine));
}
function lineH(fontSize, mult = 1.3) {
  return (fontSize / 72) * mult;
}

function addSidebar(slide, color, title, subtitle) {
  slide.addShape("rect", { x: 0, y: 0, w: 2.6, h: 7.5, fill: { color: SIDEBAR_BG }, line: { type: "none" } });
  slide.addShape("rect", { x: 0.5, y: 0.55, w: 0.04, h: 0.5, fill: { color }, line: { type: "none" } });
  if (title) {
    slide.addText(title, {
      x: 0.5, y: 1.15, w: 1.9, h: 1.1,
      fontFace: FONT, fontSize: 11, color, charSpacing: 2, bold: true,
      align: "left", valign: "top", lineSpacingMultiple: 1.5,
    });
  }
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 2.5, w: 1.9, h: 1.3,
      fontFace: FONT, fontSize: 10.5, color: GREY,
      align: "left", valign: "top", lineSpacingMultiple: 1.3,
    });
  }
}

function sectionHeader(slide, text, color) {
  slide.addText(text, {
    x: 2.95, y: 0.45, w: 9.8, h: 0.4,
    fontFace: FONT, fontSize: 12, color, bold: true, charSpacing: 1,
    align: "left", valign: "bottom",
  });
  slide.addShape("line", {
    x: 2.95, y: 0.85, w: 9.8, h: 0,
    line: { color, width: 0.75, transparency: 70 },
  });
}

// ◆ task / ✦ highlight 리스트, 위에서 아래로 쌓으며 다음 y 반환
function addItemsBlock(slide, items, x, y, w, color, opts = {}) {
  const taskFS = opts.taskFS || 9;
  const hlFS = opts.hlFS || 8.5;
  const taskColor = opts.taskColor || BODY;
  let cy = y;
  items.forEach((it) => {
    if (it.task) {
      const text = it.task.replace(/<br \/>/g, "\n");
      const linesEst = text.split("\n").reduce((a, l) => a + estLines(l, w - 0.22, taskFS), 0);
      const h = linesEst * lineH(taskFS) + 0.05;
      slide.addText(
        [{ text: "◆  ", options: { color, bold: true } }, { text, options: { color: taskColor } }],
        { x, y: cy, w, h, fontFace: FONT, fontSize: taskFS, align: "left", valign: "top", lineSpacingMultiple: 1.25 }
      );
      cy += h + 0.03;
    }
    if (it.highlight) {
      const indent = it.task ? 0.2 : 0;
      const w2 = w - indent;
      const linesEst = estLines(it.highlight, w2 - 0.2, hlFS);
      const h = linesEst * lineH(hlFS) + 0.05;
      slide.addText(
        [{ text: "✦  ", options: { color, bold: true } }, { text: it.highlight, options: { color, bold: true } }],
        { x: x + indent, y: cy, w: w2, h, fontFace: FONT, fontSize: hlFS, align: "left", valign: "top", lineSpacingMultiple: 1.2 }
      );
      cy += h + 0.06;
    }
  });
  return cy;
}

function addCategoryHeader(slide, label, periodText, x, y, w, color) {
  slide.addText(label, {
    x, y, w, h: 0.26,
    fontFace: FONT, fontSize: 10.5, bold: true, color, align: "left", valign: "top",
  });
  let by = y + 0.24;
  if (periodText) {
    slide.addText(periodText, {
      x, y: by, w, h: 0.18,
      fontFace: FONT, fontSize: 7.5, color: GREY, align: "left", valign: "top",
    });
    by += 0.2;
  }
  slide.addShape("line", { x, y: by + 0.02, w, h: 0, line: { color, width: 0.75, transparency: 60 } });
  return by + 0.12;
}

function addCategoryCell(slide, label, periodText, items, x, y, w, color) {
  const headerBottom = addCategoryHeader(slide, label, periodText, x, y, w, color);
  return addItemsBlock(slide, items, x, headerBottom, w, color, { taskFS: 8.5, hlFS: 8 });
}

function addCompanyBar(slide, company, role, period, years, color, y = 0.42, h = 0.55) {
  const x = 2.95, w = 9.8;
  slide.addShape("rect", { x, y, w, h, fill: { color, transparency: 90 }, line: { color, width: 0.75, transparency: 78 } });
  slide.addText(
    [
      { text: company + "   ", options: { fontSize: 15, color: DARK, fontFace: SERIF } },
      { text: role, options: { fontSize: 9, color, fontFace: FONT, charSpacing: 1 } },
    ],
    { x: x + 0.2, y, w: 6.6, h, align: "left", valign: "middle" }
  );
  slide.addText(
    [
      { text: (Array.isArray(period) ? period.join("  /  ") : period) + "\n", options: { fontSize: 8.5, color: GREY } },
      { text: years, options: { fontSize: 12, color, fontFace: SERIF } },
    ],
    { x: x + 6.8, y, w: 2.8, h, align: "right", valign: "middle", lineSpacingMultiple: 1.3 }
  );
  return y + h + 0.15;
}

function addPillRow(slide, items, x0, y0, maxW, color, bg, opts = {}) {
  const fs = opts.fs || 9;
  const h = opts.h || 0.3;
  const charW = opts.charW || fs * 0.0105;
  const padX = 0.16, gapX = 0.1, gapY = 0.12;
  let x = x0, y = y0;
  items.forEach((label) => {
    const w = Math.min(maxW, label.length * charW + padX * 2);
    if (x !== x0 && x + w > x0 + maxW) {
      x = x0;
      y += h + gapY;
    }
    slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.05, fill: { color: bg }, line: { color, width: 0.75 } });
    slide.addText(label, { x, y, w, h, fontFace: FONT, fontSize: fs, color, align: "center", valign: "middle" });
    x += w + gapX;
  });
  return y + h;
}

function addLabelDescList(slide, items, x, y, w, color, opts = {}) {
  const fs = opts.fs || 9;
  const labelW = opts.labelW || 1.5;
  let cy = y;
  items.forEach((it) => {
    const sep = it.indexOf(" — ");
    if (sep !== -1) {
      const label = it.slice(0, sep), desc = it.slice(sep + 3);
      const lines = estLines(desc, w - labelW - 0.1, fs);
      const h = lines * lineH(fs) + 0.05;
      slide.addText(label, { x, y: cy, w: labelW, h, fontFace: FONT, fontSize: fs, bold: true, color, align: "left", valign: "top" });
      slide.addText(desc, { x: x + labelW + 0.1, y: cy, w: w - labelW - 0.1, h, fontFace: FONT, fontSize: fs, color: BODY, align: "left", valign: "top", lineSpacingMultiple: 1.2 });
      cy += h + 0.08;
    } else {
      const lines = estLines(it, w, fs);
      const h = lines * lineH(fs) + 0.05;
      slide.addText(it, { x, y: cy, w, h, fontFace: FONT, fontSize: fs, color: BODY, align: "left", valign: "top" });
      cy += h + 0.08;
    }
  });
  return cy;
}

/* ══════════════════════════════════════════════════════════
   SLIDE 1 · RESUME (s0)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };

  // 좌측 패널
  s.addShape("rect", { x: 0, y: 0, w: 4.0, h: 7.5, fill: { color: SIDEBAR_BG }, line: { type: "none" } });

  s.addShape("rect", { x: 1.6, y: 0.5, w: 0.8, h: 0.8, fill: { color: "E0DDD8" }, line: { color: "D4C9BD", width: 1.5 }, rectRadius: 0.4, shape: "ellipse" });
  s.addText("PHOTO", { x: 1.6, y: 0.5, w: 0.8, h: 0.8, fontFace: FONT, fontSize: 7, color: GREY, align: "center", valign: "middle" });

  s.addText("박세형", { x: 0.3, y: 1.45, w: 3.4, h: 0.4, fontFace: "Noto Serif KR", fontSize: 20, bold: true, color: DARK, align: "center", valign: "top" });
  s.addText("총무·경영지원 · 오피스 운영", { x: 0.3, y: 1.85, w: 3.4, h: 0.3, fontFace: FONT, fontSize: 10, color: "7A6E62", align: "center", valign: "top" });

  s.addText(
    [
      { text: "📞  010-8036-9958\n", options: {} },
      { text: "✉️  se7en3333@naver.com\n", options: {} },
      { text: "📍  서울특별시 강동구\n", options: {} },
      { text: "🌐  www.ai-hr.kr", options: {} },
    ],
    { x: 0.4, y: 2.35, w: 3.2, h: 0.95, fontFace: FONT, fontSize: 9.5, color: "5A5248", align: "left", valign: "top", lineSpacingMultiple: 1.6 }
  );

  let ly = 3.5;
  s.addText("학력", { x: 0.4, y: ly, w: 3.2, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addShape("line", { x: 0.4, y: ly + 0.24, w: 3.2, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  ly += 0.34;
  [
    { school: "서울문화예술대학교", major: "실용음악학 학사", year: "2017.2 졸업" },
    { school: "영파여자고등학교", major: "", year: "2009.2 졸업" },
  ].forEach((e) => {
    s.addText(
      [
        { text: e.school + "\n", options: { fontSize: 9.5, bold: true, color: "3A3428" } },
        ...(e.major ? [{ text: e.major + "\n", options: { fontSize: 8.5, color: "7A6E62" } }] : []),
        { text: e.year, options: { fontSize: 8, color: GREY } },
      ],
      { x: 0.4, y: ly, w: 3.2, h: 0.55, fontFace: FONT, align: "left", valign: "top", lineSpacingMultiple: 1.3 }
    );
    ly += e.major ? 0.65 : 0.48;
  });

  ly += 0.05;
  s.addText("교육", { x: 0.4, y: ly, w: 3.2, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addShape("line", { x: 0.4, y: ly + 0.24, w: 3.2, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  ly += 0.34;
  s.addText(
    [
      "AI Agent · RAG 개발자 양성과정 수료 (2026)",
      "그룹사 승격(대리) 교육 수료 (2022.01)",
      "컬러리스트 실기 과정 수료 (2020.05)",
      "AFPK 교육과정 수료 (2013.05)",
      "Google Analytics 수료 (2020.12)",
    ].map((t) => "·  " + t).join("\n"),
    { x: 0.4, y: ly, w: 3.2, h: 0.95, fontFace: FONT, fontSize: 8.5, color: "5A5248", align: "left", valign: "top", lineSpacingMultiple: 1.5 }
  );
  ly += 1.05;

  s.addText("취미", { x: 0.4, y: ly, w: 3.2, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addShape("line", { x: 0.4, y: ly + 0.24, w: 3.2, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  ly += 0.34;
  s.addText("🧳 여행      📖 트렌드 읽기      🎵 음악감상", { x: 0.4, y: ly, w: 3.2, h: 0.3, fontFace: FONT, fontSize: 9, color: "7A6E62", align: "center", valign: "top" });

  // 우측 본문
  const rx = 4.4, rw = 8.55;
  s.addText(
    [
      { text: "경력  ", options: { fontSize: 9, bold: true, color: GREEN, charSpacing: 1.5 } },
      { text: "총 경력 12년 5개월", options: { fontSize: 9, color: GREY, fontFace: SERIF } },
    ],
    { x: rx, y: 0.45, w: rw, h: 0.26, align: "left", valign: "bottom" }
  );
  s.addShape("line", { x: rx, y: 0.74, w: rw, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });

  let jy = 0.88;
  [
    { company: "신성통상(주)", role: "대리 · 임원비서 / 인사·총무·경영지원", period: "2016.07 — 2025.12", desc: "전사 운영 지원 / 출장·해외주재원·복리후생 / 수출본부 오피스 운영 / 업무 효율화" },
    { company: "포에버21코리아리테일(유)", role: "ACC VMD", period: "2010.03 — 2011.11 / 2012.08 — 2013.09", desc: "판매 분석·재고 관리 / 오픈·리뉴얼 셋업" },
    { company: "AI Agent · RAG 프로젝트 수행", role: "", period: "2025.12 — 2026.05", desc: "AI 기반 채용 서비스 / 수출 데이터 자동화 서비스 기획·구현·배포" },
  ].forEach((job, ji) => {
    s.addText(
      [
        { text: job.company + "   ", options: { fontSize: 10.5, bold: true, color: DARK } },
        ...(job.role ? [{ text: job.role, options: { fontSize: 8.5, color: "8A7A6A" } }] : []),
      ],
      { x: rx, y: jy, w: rw - 2.0, h: 0.24, align: "left", valign: "top" }
    );
    s.addText(job.period, { x: rx + rw - 2.0, y: jy, w: 2.0, h: 0.24, fontFace: FONT, fontSize: 8, color: GREY, align: "right", valign: "top" });
    s.addText(job.desc, { x: rx, y: jy + 0.25, w: rw, h: 0.3, fontFace: FONT, fontSize: 9, color: "6A6258", align: "left", valign: "top", lineSpacingMultiple: 1.3 });
    jy += ji < 2 ? 0.68 : 0.55;
  });

  jy += 0.1;
  s.addText("어학·자격증", { x: rx, y: jy, w: 4.0, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addText("OA·업무 스킬", { x: rx + 4.3, y: jy, w: 4.0, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addShape("line", { x: rx, y: jy + 0.24, w: 4.0, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  s.addShape("line", { x: rx + 4.3, y: jy + 0.24, w: 4.0, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  jy += 0.34;

  s.addText(
    ["HSK 2급 (중국어, 2024)", "OPIc IM2 (영어, 2022)", "GTQ 2급 (2021.04)", "자동차운전면허 2종 보통"].join("\n"),
    { x: rx, y: jy, w: 4.0, h: 0.9, fontFace: FONT, fontSize: 9, color: "5A5248", align: "left", valign: "top", lineSpacingMultiple: 1.7 }
  );

  let sy = jy;
  [
    { label: "Excel", level: 4 },
    { label: "한글 / Word", level: 4 },
    { label: "PowerPoint", level: 4 },
    { label: "Google Workspace", level: 5 },
    { label: "Communication", level: 5 },
  ].forEach((sk) => {
    s.addText(sk.label, { x: rx + 4.3, y: sy, w: 1.8, h: 0.2, fontFace: FONT, fontSize: 9, color: "5A5248", align: "left", valign: "middle" });
    const dots = "●".repeat(sk.level) + "○".repeat(5 - sk.level);
    s.addText(dots, { x: rx + 6.2, y: sy, w: 1.5, h: 0.2, fontFace: FONT, fontSize: 9, color: GREEN, align: "left", valign: "middle", charSpacing: 1 });
    sy += 0.23;
  });

  jy = Math.max(jy + 0.95, sy) + 0.15;
  s.addText("Tools & Tech", { x: rx, y: jy, w: rw, h: 0.22, fontFace: FONT, fontSize: 8, bold: true, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addShape("line", { x: rx, y: jy + 0.24, w: rw, h: 0, line: { color: GREEN, width: 0.75, transparency: 70 } });
  jy += 0.36;
  addPillRow(
    s,
    ["Word", "한글", "Outlook", "Excel", "PowerPoint", "Google Workspace", "Notion", "Slack", "Python", "Apps Script", "Excel VBA", "SQL", "HTML", "Photoshop", "CapCut", "ChatGPT", "Gemini", "Claude", "Cursor"],
    rx, jy, rw, GREEN, "F0F7F0", { fs: 8.5, h: 0.28 }
  );
}

/* ══════════════════════════════════════════════════════════
   SLIDE 2 · PROFILE DETAIL (s1)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  addSidebar(s, GREEN, "Core\nCompetency\n&\nExperience", null);
  sectionHeader(s, "경력 상세 — 총 경력 12년 5개월", GREEN);

  const leftX = 2.95, leftW = 6.05, rightX = 9.25, rightW = 3.5;

  // ── 신성통상(주) (좌측) ──
  s.addText(
    [
      { text: "신성통상(주)   ", options: { fontSize: 12, bold: true, color: DARK } },
      { text: "정규직 · 대리", options: { fontSize: 9, color: GREEN } },
    ],
    { x: leftX, y: 0.95, w: 4.2, h: 0.26, align: "left", valign: "top" }
  );
  s.addText("2016.07 — 2025.12 · 9년 6개월", { x: leftX + 4.2, y: 0.95, w: 1.85, h: 0.26, fontFace: FONT, fontSize: 8, color: GREY, align: "right", valign: "top" });

  let ly = 1.3;
  s.addText("임원 비서", { x: leftX, y: ly, w: 3.0, h: 0.2, fontFace: FONT, fontSize: 9.5, bold: true, color: "4A4840", align: "left", valign: "top" });
  s.addText("2016.07 — 2022.02", { x: leftX + 3.0, y: ly, w: 3.05, h: 0.2, fontFace: FONT, fontSize: 8, color: GREY, align: "right", valign: "top" });
  ly += 0.26;
  ly = addItemsBlock(
    s,
    [
      "CEO·회장·부회장·사장단 일정 관리 및 해외 컨퍼런스콜 어레인지, VIP 방문 의전·회의 준비",
      "경영진 보고 체계·우선순위 조율 및 유관부서 간 운영 커뮤니케이션 조율",
      "비품·소모품·자산 관리, 법인카드 경비처리·세금계산서 관리·품의서 작성 등 총무 실무 병행",
      "워크샵·사내 행사 지원 및 직원 소통 기반 업무환경 개선 참여",
    ].map((task) => ({ task })),
    leftX, ly, leftW, GREEN, { taskFS: 8.5, hlFS: 8 }
  );

  ly += 0.12;
  s.addText("총무·경영지원", { x: leftX, y: ly, w: 3.0, h: 0.2, fontFace: FONT, fontSize: 9.5, bold: true, color: "4A4840", align: "left", valign: "top" });
  s.addText("2022.02 — 2025.12", { x: leftX + 3.0, y: ly, w: 3.05, h: 0.2, fontFace: FONT, fontSize: 8, color: GREY, align: "right", valign: "top" });
  ly += 0.26;

  [
    { label: "오피스 운영", tasks: ["수출본부 오피스 전반 단독 담당 — 시설·미화·보안·좌석 배치 (산업안전 법규 기준 적용)", "소방·방역 등 법정 점검 대응 및 시설 하자 수시 처리", "본사 리모델링에 따른 임시 오피스 이전 셋팅·운영 참여, 업무 공백 없이 전 과정 지원"] },
    { label: "계약·자산 관리", tasks: ["임대차·시설·협력업체 등 외부 계약 체결·이행·갱신 관리", "협력업체 비딩·비교 검토를 통한 비용 네고 및 최적 조건 계약 체결", "수출본부 담당 자산 현황 파악·실사 및 총무팀 취합 프로세스 참여"] },
    { label: "구성원 지원", tasks: ["복리후생 운영 — 생일상품권·법인콘도·위탁보육·명절행사 등 전반 운영", "출장·주재원 지원 — 항공권·비자·여행자보험·ABTC·해외이사 비딩까지 전 과정 단독 처리", "시즌별 사내 행사 기획 참여 및 실행"] },
    { label: "업무 자동화", tasks: ["Google Workspace 기반 명함 신청·출장 정산 자동화 구축 — 수동 처리 오류 제거 및 검증 효율 향상"] },
  ].forEach((group) => {
    s.addText(group.label, { x: leftX, y: ly, w: leftW, h: 0.2, fontFace: FONT, fontSize: 8.5, bold: true, color: GREEN, align: "left", valign: "top" });
    ly += 0.22;
    ly = addItemsBlock(s, group.tasks.map((task) => ({ task })), leftX, ly, leftW, GREEN, { taskFS: 8, hlFS: 7.5 });
    ly += 0.06;
  });

  // ── 포에버21 (우측) ──
  s.addText(
    [
      { text: "포에버21코리아리테일(유)   ", options: { fontSize: 10.5, bold: true, color: DARK } },
      { text: "정규직", options: { fontSize: 8, color: ROSE } },
    ],
    { x: rightX, y: 0.95, w: rightW, h: 0.4, align: "left", valign: "top" }
  );
  s.addText("2010.03 — 2013.09 · 총 3년 1개월", { x: rightX, y: 1.22, w: rightW, h: 0.2, fontFace: FONT, fontSize: 7.5, color: GREY, align: "left", valign: "top" });

  let ry = 1.55;
  [
    { label: "세일즈", period: "2010.03 — 2010.09", tasks: ["매장 판매·고객 응대 및 판매 데이터 기반 현장 운영 경험"] },
    { label: "ACC VMD", period: "2010.09 — 2011.11 / 2012.08 — 2013.09", tasks: ["사내 VMD 전환 시험 합격 후 ACC VMD로 직무 전환", "해외 바이어 응대 및 판매 분석·재고 관리·컨셉 진열 관리", "매장 오픈·리뉴얼 셋업 현장 운영", "신사점 오픈, 명동점 리뉴얼 오픈 셋팅 참여 — 일 매출 1억 5천만 원 달성"] },
  ].forEach((role) => {
    s.addText(role.label, { x: rightX, y: ry, w: rightW, h: 0.2, fontFace: FONT, fontSize: 9, bold: true, color: "4A4840", align: "left", valign: "top" });
    ry += 0.2;
    s.addText(role.period, { x: rightX, y: ry, w: rightW, h: 0.18, fontFace: FONT, fontSize: 7.5, color: GREY, align: "left", valign: "top" });
    ry += 0.22;
    ry = addItemsBlock(s, role.tasks.map((task) => ({ task })), rightX, ry, rightW, ROSE, { taskFS: 8, hlFS: 7.5 });
    ry += 0.1;
  });
}

/* ══════════════════════════════════════════════════════════
   SLIDE 3-4 · 지원동기 (s2)
══════════════════════════════════════════════════════════ */
{
  const s1 = pptx.addSlide();
  s1.background = { color: "FFFFFF" };
  addSidebar(s1, GREEN, "Motivation\n&\nGoals", "토스페이먼츠\nGeneral Affairs\nManager");
  sectionHeader(s1, "01 — 지원 동기 및 적합 이유", GREEN);

  s1.addText("“저는 이타적인 마음을 가진 E성향의 사람입니다.”", {
    x: 2.95, y: 1.0, w: 9.8, h: 0.45,
    fontFace: FONT, fontSize: 16, color: DARK, bold: true,
    align: "left", valign: "top",
  });

  s1.addText(
    "상대의 니즈를 파악하고 불편을 개선하는 것이 자연스럽게 즐거운 일이고, 지금까지의 경력이 모두 그 방향으로 이어져 왔습니다. VMD로 고객과 공간을 연결하고, 임원 비서로 경영진의 필요를 선제적으로 파악하며, 총무로 구성원의 운영 환경을 개선해온 경험 모두가 결국 '상대가 체감할 수 있는 서비스'를 만드는 일이었습니다.\n\n최고 경영진의 니즈를 먼저 파악하고 맞추는 임원 비서로 시작해, 총무·경영지원으로 전환한 이후에도 으로 구성원이 말하기 전에 먼저 불편을 발견하고, 직접 기획해 개선하는 것이 저의 업무 방식이었습니다.",
    {
      x: 2.95, y: 1.55, w: 9.8, h: 1.55,
      fontFace: FONT, fontSize: 11, color: BODY, lineSpacingMultiple: 1.35,
      align: "left", valign: "top",
    }
  );

  const examples = [
    { label: "주차 시스템 전산화", desc: "요청 없이\n즉시 사용 가능한 환경 구축" },
    { label: "명함 신청 프로세스", desc: "Forms·Sheets·Apps Script로\n다이렉트 소통 구조화" },
    { label: "법인콘도 이벤트", desc: "바코드 신청 방식 도입으로\n참여율 개선" },
  ];
  const boxW = 3.13, boxGap = 0.2, boxX0 = 2.95, boxY = 3.25, boxH = 0.95;
  examples.forEach((ex, i) => {
    const x = boxX0 + i * (boxW + boxGap);
    s1.addShape("rect", { x, y: boxY, w: boxW, h: boxH, fill: { color: BOX_BG }, line: { type: "none" } });
    s1.addShape("rect", { x, y: boxY, w: boxW, h: 0.04, fill: { color: GREEN }, line: { type: "none" } });
    s1.addText(ex.label, {
      x: x + 0.15, y: boxY + 0.1, w: boxW - 0.3, h: 0.3,
      fontFace: FONT, fontSize: 10.5, color: DARK, bold: true,
      align: "left", valign: "top",
    });
    s1.addText(ex.desc, {
      x: x + 0.15, y: boxY + 0.42, w: boxW - 0.3, h: 0.5,
      fontFace: FONT, fontSize: 9, color: "7A7868", lineSpacingMultiple: 1.25,
      align: "left", valign: "top",
    });
  });

  s1.addText(
    "세 경험 모두 구성원의 불편을 먼저 발견하여 기획해 실행했습니다. 9년간 사내 봉사 동호회에서 총무·회계를 직접 맡아온 것도 같은 이유입니다. 누가 시켜서가 아니라 필요한 일이 보이면 먼저 움직이는 것이 저에게 익숙한 방식이고, 그게 업무 밖에서도 자연스럽게 이어졌습니다.",
    {
      x: 2.95, y: 4.45, w: 9.8, h: 0.85,
      fontFace: FONT, fontSize: 11, color: BODY, lineSpacingMultiple: 1.35,
      align: "left", valign: "top",
    }
  );

  s1.addShape("rect", { x: 2.95, y: 5.5, w: 0.04, h: 1.15, fill: { color: GREEN }, line: { type: "none" } });
  s1.addText(
    "토스페이먼츠 GA팀이 추구하는 “Small Wins”의 파트너로서의 역할이 제가 지금까지 일해온 방식과 일치하다고 생각되어, 합류하게 된다면 적응보다 실행이 가능한 사람일 것 같습니다.",
    {
      x: 3.2, y: 5.5, w: 9.5, h: 1.15,
      fontFace: FONT, fontSize: 12, color: "3A3830", lineSpacingMultiple: 1.4,
      align: "left", valign: "top",
    }
  );

  const s2 = pptx.addSlide();
  s2.background = { color: "FFFFFF" };
  addSidebar(s2, ROSE, "Motivation\n&\nGoals", "토스페이먼츠\nGeneral Affairs\nManager");
  sectionHeader(s2, "02 — General Affairs Manager로서 목표하는 점", ROSE);

  s2.addText("“구성원이 불편함을 느끼기 전에 먼저 파악하고, 체감할 수 있는 환경을 만드는 것.”", {
    x: 2.95, y: 1.0, w: 9.8, h: 0.5,
    fontFace: FONT, fontSize: 16, color: DARK, bold: true,
    align: "left", valign: "top",
  });

  s2.addText(
    "주차권 하나, 명함 신청 방식 하나, 콘도 이벤트 신청 방법 하나. 작은 불편 하나를 개선했을 때 구성원의 움직임이 달라지는 걸 직접 경험했습니다. 거창한 변화보다 작은 개선이 반복될 때 구성원이 실제로 체감하고, 그것이 쌓이면 일하는 환경 자체가 달라진다는 것을 알고 있습니다.",
    {
      x: 2.95, y: 1.65, w: 9.8, h: 0.95,
      fontFace: FONT, fontSize: 11, color: BODY, lineSpacingMultiple: 1.35,
      align: "left", valign: "top",
    }
  );

  s2.addText("이를 위해 세 가지를 실행하겠습니다 —", {
    x: 2.95, y: 2.75, w: 9.8, h: 0.35,
    fontFace: FONT, fontSize: 10.5, color: GREY, charSpacing: 1,
    align: "left", valign: "top",
  });

  const commitments = [
    { n: "01", t: "경험하고 개선하는 파트너", d: "관리자가 아닌 파트너로서 먼저 경험하고 개선하는 방식으로 일하겠습니다. 직접 써보고 부딪혀봐야 불편한 지점이 보이고, 요청이 들어오기 전에 먼저 움직일 수 있는 것은 그 경험에서 나온다고 생각합니다." },
    { n: "02", t: "Google Workspace·AI 도구로 반복 업무 축소", d: "자동화로 처리 시간이 줄어들면 구성원 입장에서 기다림이 사라지고, 담당자는 더 중요한 일에 집중할 수 있습니다. 새로운 툴과 운영 방식에 빠르게 적용하는 것도 GA Manager의 중요한 역할이라고 생각합니다." },
    { n: "03", t: "수치보다 체감에 집중", d: "구성원이 “예전보다 편해졌다”고 느끼는 환경을 만드는 것이 GA Manager로서 제가 추구하는 진짜 목표입니다." },
  ];
  let cy = 3.25;
  commitments.forEach((item) => {
    s2.addText(item.n, {
      x: 2.95, y: cy, w: 0.5, h: 0.35,
      fontFace: FONT, fontSize: 14, color: ROSE, bold: true,
      align: "left", valign: "top",
    });
    s2.addText(item.t, {
      x: 3.5, y: cy, w: 9.2, h: 0.3,
      fontFace: FONT, fontSize: 11.5, color: DARK, bold: true,
      align: "left", valign: "top",
    });
    s2.addText(item.d, {
      x: 3.5, y: cy + 0.32, w: 9.2, h: 0.7,
      fontFace: FONT, fontSize: 10.5, color: BODY, lineSpacingMultiple: 1.3,
      align: "left", valign: "top",
    });
    s2.addShape("line", {
      x: 2.95, y: cy + 1.18, w: 9.8, h: 0,
      line: { color: "000000", width: 0.5, transparency: 92 },
    });
    cy += 1.35;
  });
}

/* ══════════════════════════════════════════════════════════
   SLIDE 5 · INTRO (s3)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };

  s.addText("PORTFOLIO · 2026", {
    x: 0.8, y: 0.9, w: 6, h: 0.3,
    fontFace: FONT, fontSize: 10, color: GREEN, charSpacing: 3,
    align: "left", valign: "top",
  });

  s.addText(
    [
      { text: "박 ", options: { color: "2C3028" } },
      { text: "세형", options: { color: "333030" } },
    ],
    { x: 0.8, y: 1.3, w: 7, h: 1.2, fontFace: SERIF, fontSize: 54, align: "left", valign: "top" }
  );
  s.addText("Park Sehyung", { x: 0.8, y: 2.45, w: 6, h: 0.4, fontFace: SERIF, fontSize: 16, color: "A0A098", align: "left", valign: "top" });

  addPillRow(
    s,
    ["총무·경영지원", "오피스 운영", "업무 자동화", "Google Workspace"],
    0.8, 3.05, 7.0, GREEN, "F0F7F0", { fs: 10, h: 0.34, charW: 0.1 }
  );

  s.addText(
    "총무·경영지원 9년 실무 경력을 바탕으로\n오피스 운영과 업무 효율화를 직접 실행해온 실무자",
    { x: 0.8, y: 3.75, w: 6.5, h: 0.7, fontFace: "Noto Serif KR", fontSize: 13, color: BODY, lineSpacingMultiple: 1.6, align: "left", valign: "top" }
  );

  [
    { n: "9년+", desc: "총무·경영지원 경력" },
    { n: "12년+", desc: "총 실무 경력" },
  ].forEach((st, i) => {
    const x = 0.8 + i * 1.8;
    s.addText(st.n, { x, y: 4.7, w: 1.6, h: 0.45, fontFace: SERIF, fontSize: 26, color: GREEN, align: "left", valign: "top" });
    s.addText(st.desc, { x, y: 5.2, w: 1.6, h: 0.3, fontFace: FONT, fontSize: 8.5, color: GREY, align: "left", valign: "top" });
  });

  s.addShape("roundRect", { x: 0.8, y: 5.85, w: 1.9, h: 0.5, rectRadius: 0.03, fill: { color: GREEN }, line: { type: "none" } });
  s.addText("자세히 보기 ↓", { x: 0.8, y: 5.85, w: 1.9, h: 0.5, fontFace: FONT, fontSize: 10, color: "FFFFFF", charSpacing: 1, align: "center", valign: "middle" });

  // 우측 사진 placeholder
  s.addShape("rect", { x: 9.6, y: 1.8, w: 2.6, h: 3.2, fill: { color: "F0ECE4" }, line: { color: "D4C9BD", width: 1.5 } });
  s.addText("[ 프로필 사진 ]", { x: 9.6, y: 1.8, w: 2.6, h: 3.2, fontFace: FONT, fontSize: 10, color: GREY, align: "center", valign: "middle" });
  s.addText(
    [
      { text: "박 세 형\n", options: { fontSize: 13, color: "FFFFFF", fontFace: SERIF } },
      { text: "총무·경영지원 · 오피스 운영", options: { fontSize: 8, color: "E8E6E0" } },
    ],
    { x: 9.6, y: 4.55, w: 2.6, h: 0.45, fill: { color: "2C3028", transparency: 30 }, align: "left", valign: "top" }
  );
}

/* ══════════════════════════════════════════════════════════
   SLIDE 6-8 · CAREER (s4)
══════════════════════════════════════════════════════════ */
{
  // ── Career 1/3 · 신성통상 1-4 ──
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  sectionHeader(s, "Career — 총 경력 12년 5개월 · 총무·경영지원 9년 6개월 / 리테일 VMD 3년 1개월 (1/3)", GREEN);

  let topY = addCompanyBar(s, "신성통상(주)", "대리 · 임원비서 / 총무·경영지원", "2016.07 — 2025.12", "9년 6개월", GREEN, 1.0);

  const colW = 4.7, gapX = 0.4, col1X = 2.95, col2X = col1X + colW + gapX;
  const b1 = addCategoryCell(s, "임원 비서", "2016.07 — 2022.02", [
    { task: "CEO·회장·부회장·사장단 다수 경영진 동시 지원 체계 장기 안정적 운영" },
    { task: "해외 바이어·컨퍼런스 및 VIP 방문 의전·회의 준비" },
    { task: "경영진 보고 체계·우선순위 조율 및 유관부서 간 운영 커뮤니케이션 조율" },
    { task: "비품·소모품·자산 관리, 법인카드 경비처리·세금계산서 관리·품의서 작성 등 총무 실무 병행" },
    { task: "워크샵·사내 행사 지원 및 직원 소통 기반 업무환경 개선 참여", highlight: "비서 업무와 총무 실무 병행으로 경영지원 전반 역량 선행 축적" },
  ], col1X, topY, colW, GREEN);

  const b2 = addCategoryCell(s, "오피스 운영", null, [
    { task: "오피스 운영 전반 단독 담당 — 시설·미화·보안·좌석 배치 관리 (산업안전 법규 기준 적용)" },
    { task: "시설물 운영 — 조명·공조·전기·통신 하자 점검·조치, 소방·방역 등 법정 점검 대응" },
    { task: "주차 시스템 전산화 전환 시 운영 방식 개선 — 구성원 요청 없이 즉시 사용 가능한 환경 구축", highlight: "수동 요청 방식 제거로 구성원 편의성 향상, 월 1회 정산 처리 구조로 효율화" },
    { task: "본사 리모델링에 따른 임시 오피스 이전 셋팅·운영 참여", highlight: "수출본부 오피스 독립 운영 체계 구축, 이전 기간 업무 공백 없이 지원" },
  ], col2X, topY, colW, GREEN);

  let rowY = Math.max(b1, b2) + 0.25;

  const b3 = addCategoryCell(s, "계약·자산 관리", null, [
    { task: "임대차·시설·협력업체 등 외부 계약 체결·이행·갱신 관리", highlight: "다수 업체 비딩·비교 검토로 비용 절감 및 최적 조건 계약 체결" },
    { task: "수출본부 담당 자산 현황 파악·실사 및 총무팀 취합 프로세스 참여", highlight: "계약 갱신 누락 없이 지속 관리, 수출본부 담당 자산 누락 없이 보고" },
  ], col1X, rowY, colW, GREEN);

  const b4 = addCategoryCell(s, "보안·차량·통신", null, [
    { task: "보안·차량·통신 관리 — 세콤 운영, 법인차량 정비·과태료 처리, 통신요금 정산 및 내선 관리", highlight: "월간 점검 루틴 및 수시 대응 병행으로 운영 공백 없이 유지" },
  ], col2X, rowY, colW, GREEN);

  // ── Career 2/3 · 신성통상 5-8 ──
  const s2 = pptx.addSlide();
  s2.background = { color: "FFFFFF" };
  sectionHeader(s2, "Career — 신성통상(주) · 총무·경영지원 (2/3)", GREEN);

  let topY2 = 1.0;
  const c1 = addCategoryCell(s2, "복리후생·행사", null, [
    { task: "복리후생 운영 — 생일상품권·법인콘도·위탁보육·명절행사·간식 등 구성원 복지 전반 운영" },
    { task: "법인콘도 이벤트 참여 방식 개선 — 바코드 신청 방식으로 전환", highlight: "법인콘도 바코드 신청 방식 전환으로 참여 접근성 개선 및 참여율 향상" },
    { task: "사내 행사 운영 — 명절·복날·한우데이·연말 다이어리 등 시즌별 행사 기획 참여·실행", highlight: "구성원 수요 반영한 복지 항목 운영 및 연간 고정 행사 선제적 준비 수행" },
  ], col1X, topY2, colW, GREEN);

  const c2 = addCategoryCell(s2, "출장·주재원 지원", null, [
    { task: "출장·주재원 지원 — 항공권·비자·여행자보험·ABTC·마일리지·해외이사 비딩까지 전 과정 관리", highlight: "출장 전 과정 단독 처리 및 주재원 이동 시 해외이사 업체 비딩·계약 관리 직접 수행" },
  ], col2X, topY2, colW, GREEN);

  let rowY2 = Math.max(c1, c2) + 0.25;

  const c3 = addCategoryCell(s2, "시스템·조직 지원", null, [
    { task: "부서별 시스템 접근 권한 요청 취합·기안 작성 및 IT 부서 연계 처리 지원" },
    { task: "본사·수출본부·유관부서 간 운영 조율 및 이슈 대응", highlight: "물리적으로 분리된 조직 간 운영 이슈 단독 조율, 업무 연속성 유지" },
  ], col1X, rowY2, colW, GREEN);

  const c4 = addCategoryCell(s2, "업무 자동화", null, [
    { task: "Google Workspace 기반 명함 신청 자동화 구축 — Forms 신청 접수 → Sheets 자동 취합 → Apps Script로 디자이너\n자동 메일 발송 → PDF 업로드 시 신청자 자동 알림까지 전 과정 직접 구축", highlight: "중간 전달 과정 제거로 처리 속도 향상, 신청자·디자이너 간 다이렉트 소통 구조 실현" },
    { task: "Excel VBA 기반 출장 정산 자동화 구축", highlight: "수동 검토 오류 제거 및 정산 검증 효율 향상" },
  ], col2X, rowY2, colW, GREEN);

  // ── Career 3/3 · 포에버21 + 방송·공연 ──
  const s3 = pptx.addSlide();
  s3.background = { color: "FFFFFF" };
  sectionHeader(s3, "Career — 포에버21코리아리테일(유) / 방송·공연 활동 (3/3)", ROSE);

  let topY3 = addCompanyBar(s3, "포에버21코리아리테일(유)", "ACC VMD", ["2010.03 — 2011.11", "2012.08 — 2013.09"], "총 3년 1개월", ROSE, 1.0);
  topY3 = addCategoryCell(s3, "VMD 운영", null, [
    { task: "매장 오픈·리뉴얼 셋팅 및 현장 운영" },
    { task: "발주·재고 관리 및 판매 분석·리포트 작성", highlight: "신사점 오픈, 명동점 리뉴얼 오픈 셋팅 참여 — 일 매출 1억 5천만 원 달성" },
  ], 2.95, topY3, 9.8, ROSE);

  topY3 = addCompanyBar(s3, "방송·공연 활동", "코러스 / 뮤지컬 배우", "2014 — 2016", "방송·공연", PURPLE, topY3 + 0.2);
  addCategoryCell(s3, "방송·공연", null, [
    { highlight: "SBS·KBS 방송 코러스 및 가족 뮤지컬 공연 참여" },
  ], 2.95, topY3, 9.8, PURPLE);
}

/* ══════════════════════════════════════════════════════════
   SLIDE 9 · 핵심역량 (s5)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  sectionHeader(s, "02 — 핵심역량 · 실무에서 직접 구축하고, 운영하며, 개선한 경험", GREEN);

  s.addShape("rect", { x: 2.95, y: 1.0, w: 9.8, h: 0.85, fill: { color: GREEN, transparency: 92 }, line: { color: GREEN, width: 0.75, transparency: 78 } });
  s.addText(
    "비개발자이지만 현장의 반복 업무와 불편을 직접 관찰하고, Google 도구와 Apps Script·Python을 활용해 실무 자동화를 직접 구축하여 운영 개선을 수행해왔습니다.",
    { x: 3.2, y: 1.0, w: 9.3, h: 0.85, fontFace: "Noto Serif KR", fontSize: 11, color: "4A4840", align: "center", valign: "middle", lineSpacingMultiple: 1.5 }
  );

  const cards = [
    { icon: "🔄", color: ROSE, title: "사내 운영 프로세스 개선", desc: "반복 불편 요소를 파악하고 이용 흐름을 재설계해 운영 효율 개선", keywords: ["사용자 중심", "온보딩·명함", "이용 흐름 개선", "운영 효율화"] },
    { icon: "📋", color: BLUE, title: "운영 구조화·문서화", desc: "반복 업무를 프로세스로 정리하고 관리 기준을 만들어 운영 체계 구축", keywords: ["프로세스 정비", "문서화", "운영 체계", "인수인계"] },
    { icon: "🛠️", color: GREEN, title: "Google Workspace 업무 자동화", desc: "Forms·Sheets·Apps Script 연동으로 실무 자동화 직접 구축, AI 도구 병행 활용", keywords: ["Google Workspace", "Apps Script", "자동화 구축", "AI 활용"] },
  ];
  const cardW = 3.13, cardGap = 0.2, cardX0 = 2.95, cardY = 2.15, cardH = 3.4;
  cards.forEach((c, i) => {
    const x = cardX0 + i * (cardW + cardGap);
    s.addShape("rect", { x, y: cardY, w: cardW, h: cardH, fill: { color: "FFFFFF" }, line: { color: c.color, width: 1, transparency: 60 } });
    s.addShape("rect", { x: x + 0.25, y: cardY + 0.3, w: 0.04, h: 0.5, fill: { color: c.color }, line: { type: "none" } });
    s.addText(`${c.icon}  ${c.title}`, { x: x + 0.4, y: cardY + 0.25, w: cardW - 0.6, h: 0.6, fontFace: "Noto Serif KR", fontSize: 11.5, color: "2C3028", align: "left", valign: "top", lineSpacingMultiple: 1.3 });
    s.addText(c.desc, { x: x + 0.25, y: cardY + 1.0, w: cardW - 0.5, h: 1.1, fontFace: FONT, fontSize: 9.5, color: "6A6860", align: "left", valign: "top", lineSpacingMultiple: 1.5 });
    addPillRow(s, c.keywords, x + 0.25, cardY + 2.6, cardW - 0.5, c.color, "FFFFFF", { fs: 8, h: 0.28 });
  });
}

/* ══════════════════════════════════════════════════════════
   SLIDE 10 · SKILLS & CERTIFICATES (s6)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  sectionHeader(s, "03 — Skills & Certificates", GREEN);

  const SKILLS = [
    { cat: "Business · Admin", color: ROSE, bg: "FDF3F1", items: ["오피스 운영 및 업무환경 관리", "임원 비서·일정 관리 / 전사 운영 지원", "복리후생·주재원 지원 / 인사총무·신입 온보딩 지원", "출장 관리·정산", "부서 간 조율·운영 대응", "조직 운영 및 보고 체계 이해"], type: "pill" },
    { cat: "OA · Tools", color: GREEN, bg: "F0F7F0", items: ["Excel — 함수·피벗테이블·운영 데이터 정리·정산 매크로 활용", "PowerPoint — 보고자료·운영자료 작성", "한글 / Word — 공문·안내문·행정 문서 작성", "Google Workspace — Docs·Sheets·Forms 기반 신청·취합 프로세스 운영", "Google Apps Script — 자동 메일 발송 연동 및 실무 자동화 구축", "Slack · Notion 운영 지원"], type: "label" },
    { cat: "Certificates · Training", color: TAN, bg: "FAF6F2", items: ["AI Agent·RAG 양성과정 수료 (2025–2026)", "新HSK 2급 중국어 (2024)", "OPIc IM2 영어 (2022)", "그룹사 승격(대리) 교육 수료 (2022.01)", "ITQ 한글·엑셀·파워포인트 수료 (2021.07)", "GTQ 2급 취득 (2021.04)", "컬러리스트 실기 과정 수료 (2020.05)", "AFPK 교육과정 수료 (2013.05)", "자동차운전면허 2종 보통"], type: "pill" },
  ];

  let sy = 1.0;
  SKILLS.forEach((cat) => {
    s.addShape("rect", { x: 2.95, y: sy, w: 0.35, h: 0.04, fill: { color: cat.color }, line: { type: "none" } });
    s.addText(cat.cat, { x: 3.4, y: sy - 0.1, w: 6, h: 0.24, fontFace: FONT, fontSize: 9, bold: true, color: cat.color, charSpacing: 1.5, align: "left", valign: "top" });
    sy += 0.32;
    if (cat.type === "pill") {
      sy = addPillRow(s, cat.items, 2.95, sy, 9.8, cat.color, cat.bg, { fs: 9, h: 0.3 }) + 0.3;
    } else {
      sy = addLabelDescList(s, cat.items, 2.95, sy, 9.8, cat.color, { fs: 9, labelW: 2.0 }) + 0.2;
    }
  });
}

/* ══════════════════════════════════════════════════════════
   SLIDE 11 · AI PROJECTS (s7)
══════════════════════════════════════════════════════════ */
{
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  sectionHeader(s, "02 — AI Projects", GREEN);

  s.addShape("rect", { x: 2.95, y: 1.0, w: 9.8, h: 0.85, fill: { color: "FFFFFF" }, line: { color: GREEN, width: 0.75, transparency: 70 } });
  s.addShape("rect", { x: 2.95, y: 1.0, w: 0.05, h: 0.85, fill: { color: GREEN }, line: { type: "none" } });
  s.addText("AI AGENT와 RAG를 활용한 생각하는 AI 서비스 개발자 양성과정", { x: 3.2, y: 1.1, w: 9.4, h: 0.25, fontFace: FONT, fontSize: 8.5, color: GREEN, charSpacing: 1, align: "left", valign: "top" });
  s.addText("실무 경험에서 나온 현업 문제를 AI로 해결하기 위해 기획·구현한 2개의 프로젝트입니다.", { x: 3.2, y: 1.4, w: 9.4, h: 0.35, fontFace: FONT, fontSize: 10, color: BODY, align: "left", valign: "top" });

  const PROJECTS = [
    { num: "01", tag: "HR SERVICE", title: "인사 담당자의 반복 채용 업무를\n줄이기 위해 기획한 서비스", desc: "면접 일정 관리·지원자 이력서 관리·면접관 AI 질문 자동 생성 기능을 구현하며 기획·UX·기능 설계 전반 담당", techs: ["채용 운영", "면접 일정 관리", "AI 질문 생성", "UX 설계", "서비스 기획"], color: GREEN },
    { num: "02", tag: "AI AUTOMATION", title: "AI 기반 수출 데이터 자동화 서비스", desc: "실제 현업 데이터를 분석해 주간 리포트 자동 생성 및 자동 메일 발송까지 구현·배포한 현업 활용 서비스", techs: ["데이터 자동 분석", "주간 리포트 자동화", "자동 메일 발송", "현업 배포", "QA팀 활용중"], color: ROSE },
  ];
  const pW = 4.7, pGap = 0.4, pX0 = 2.95, pY = 2.15, pH = 4.3;
  PROJECTS.forEach((p, i) => {
    const x = pX0 + i * (pW + pGap);
    s.addShape("rect", { x, y: pY, w: pW, h: pH, fill: { color: "FFFFFF" }, line: { color: p.color, width: 1, transparency: 60 } });
    s.addShape("rect", { x, y: pY, w: pW, h: 1.7, fill: { color: "F0ECE4" }, line: { type: "none" } });
    s.addText("[ 프로젝트 이미지 ]", { x, y: pY, w: pW, h: 1.7, fontFace: FONT, fontSize: 9, color: GREY, align: "center", valign: "middle" });

    s.addText(`Project ${p.num} · ${p.tag}`, { x: x + 0.3, y: pY + 1.85, w: pW - 0.6, h: 0.24, fontFace: FONT, fontSize: 8, color: p.color, charSpacing: 1.5, align: "left", valign: "top" });
    s.addText(p.title, { x: x + 0.3, y: pY + 2.1, w: pW - 0.6, h: 0.7, fontFace: SERIF, fontSize: 14.5, color: "2C3028", align: "left", valign: "top", lineSpacingMultiple: 1.25 });
    s.addText(p.desc, { x: x + 0.3, y: pY + 2.85, w: pW - 0.6, h: 0.85, fontFace: FONT, fontSize: 9, color: "7A7870", align: "left", valign: "top", lineSpacingMultiple: 1.5 });
    addPillRow(s, p.techs, x + 0.3, pY + 3.75, pW - 0.6, p.color, "FFFFFF", { fs: 7.5, h: 0.26 });
  });
}

const OUT = path.join(__dirname, "pdf-output", "Portfolio_Full.pptx");
await pptx.writeFile({ fileName: OUT });
console.log(`\n✅ 완료! PPTX: ${OUT}`);
