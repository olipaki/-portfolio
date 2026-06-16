import pptxgen from "pptxgenjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FONT = "맑은 고딕";
const GREEN = "6B9A6B";
const ROSE = "B07A6E";
const DARK = "2C2820";
const BODY = "5A5850";
const GREY = "AAA8A0";
const SIDEBAR_BG = "F7F4F0";
const BOX_BG = "F7F4F0";

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";

function addSidebar(slide, color) {
  slide.addShape("rect", { x: 0, y: 0, w: 2.6, h: 7.5, fill: { color: SIDEBAR_BG }, line: { type: "none" } });
  slide.addShape("rect", { x: 0.5, y: 0.55, w: 0.04, h: 0.5, fill: { color }, line: { type: "none" } });
  slide.addText("Motivation\n&\nGoals", {
    x: 0.5, y: 1.15, w: 1.8, h: 1.1,
    fontFace: FONT, fontSize: 11, color, charSpacing: 2, bold: true,
    align: "left", valign: "top", lineSpacingMultiple: 1.5,
  });
  slide.addText("토스페이먼츠\nGeneral Affairs\nManager", {
    x: 0.5, y: 2.5, w: 1.9, h: 1.0,
    fontFace: FONT, fontSize: 10.5, color: GREY,
    align: "left", valign: "top", lineSpacingMultiple: 1.3,
  });
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

/* ══════════════ SLIDE 1 · 지원 동기 및 적합 이유 ══════════════ */
const s1 = pptx.addSlide();
s1.background = { color: "FFFFFF" };
addSidebar(s1, GREEN);
sectionHeader(s1, "01 — 지원 동기 및 적합 이유", GREEN);

s1.addText("“저는 이타적인 마음을 가진 E성향의 사람입니다.”", {
  x: 2.95, y: 1.0, w: 9.8, h: 0.45,
  fontFace: FONT, fontSize: 16, color: DARK, bold: true,
  align: "left", valign: "top",
});

s1.addText(
  "상대의 니즈를 파악하고 불편을 개선하는 것이 자연스럽게 즐거운 일이고, 지금까지의 경력이 모두 그 방향으로 이어져 왔습니다. VMD로 고객과 공간을 연결하고, 임원 비서로 경영진의 필요를 선제적으로 파악하며, 총무로 구성원의 운영 환경을 개선해온 경험 모두가 결국 '상대가 체감할 수 있는 서비스'를 만드는 일이었습니다.\n\n최고 경영진의 니즈를 먼저 파악하고 맞추는 임원 비서로 시작해, 총무·경영지원으로 전환한 이후에도 같은 방식으로 구성원이 말하기 전에 먼저 불편을 발견하고, 직접 기획해 개선하는 것이 저의 업무 방식이었습니다.",
  {
    x: 2.95, y: 1.55, w: 9.8, h: 1.55,
    fontFace: FONT, fontSize: 11, color: BODY, lineSpacingMultiple: 1.35,
    align: "left", valign: "top",
  }
);

// 실행 사례 3가지 (하이라이트 박스)
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

/* ══════════════ SLIDE 2 · GA Manager로서 목표하는 점 ══════════════ */
const s2 = pptx.addSlide();
s2.background = { color: "FFFFFF" };
addSidebar(s2, ROSE);
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

const OUT = path.join(__dirname, "pdf-output", "Motivation_and_Goals.pptx");
await pptx.writeFile({ fileName: OUT });
console.log(`\n✅ 완료! PPTX: ${OUT}`);
