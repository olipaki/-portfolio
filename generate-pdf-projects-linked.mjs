import puppeteer from "puppeteer";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output");

// 추출할 페이지만 지정: AI Projects(s7)
const KEEP_IDS = ["s7"];

// 프로젝트 카드 → 링크 매핑 (data-project-card 값 기준)
const LINKS = {
  "01": "https://www.ai-hr.kr/",
  "02": "http://15.134.156.172/",
};

function addLinkAnnotation(pdfDoc, page, rect, url) {
  const linkDict = pdfDoc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: rect,
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url),
    },
  });
  const linkRef = pdfDoc.context.register(linkDict);
  const existingAnnots = page.node.lookup(PDFName.of("Annots"));
  if (existingAnnots) {
    existingAnnots.push(linkRef);
  } else {
    page.node.set(PDFName.of("Annots"), pdfDoc.context.obj([linkRef]));
  }
}

async function run() {
  const fs = await import("fs");
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:5180", { waitUntil: "networkidle2" });

  await new Promise((r) => setTimeout(r, 2500));

  const hideSelector = "section" + KEEP_IDS.map((id) => `:not(#${id})`).join("");

  await page.addStyleTag({
    content: `
      section {
        min-height: unset !important;
        height: auto !important;
        padding-top: 60px !important;
        padding-bottom: 60px !important;
      }
      ${hideSelector} {
        display: none !important;
      }
      nav, [style*="position: fixed"], [style*="position:fixed"] {
        display: none !important;
      }
    `,
  });

  await new Promise((r) => setTimeout(r, 500));

  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`전체 높이: ${fullHeight}px`);

  // 카드별 클릭 영역(바운딩 박스) 측정 — 이미지+제목+설명+태그 전체 포함
  const cardHandles = await page.$$("[data-project-card]");
  const cardBoxes = [];
  for (const handle of cardHandles) {
    const num = await handle.evaluate((el) => el.getAttribute("data-project-card"));
    const box = await handle.boundingBox();
    cardBoxes.push({ num, box });
  }
  console.log("카드 영역:", cardBoxes);

  const pngPath = path.join(OUTPUT_DIR, "AI_Projects_Linked.png");
  await page.screenshot({ path: pngPath, fullPage: true });
  console.log("PNG 저장 완료");

  await browser.close();

  const pdfPath = path.join(OUTPUT_DIR, "AI_Projects_Linked.pdf");
  const pngBytes = readFileSync(pngPath);
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const { width, height } = pngImage.scale(0.5); // 2x 스케일 → 1x(CSS px = PDF pt)로 축소
  const pdfPage = pdfDoc.addPage([width, height]);
  pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });

  // CSS px(=PDF pt) 좌표를 PDF 좌표계(원점 좌하단)로 변환해 링크 영역 추가
  cardBoxes.forEach(({ num, box }) => {
    const url = LINKS[num];
    if (!box || !url) return;
    const x1 = box.x;
    const x2 = box.x + box.width;
    const y1 = height - (box.y + box.height);
    const y2 = height - box.y;
    addLinkAnnotation(pdfDoc, pdfPage, [x1, y1, x2, y2], url);
    console.log(`링크 추가 — Project ${num}: ${url}  Rect=[${x1.toFixed(1)}, ${y1.toFixed(1)}, ${x2.toFixed(1)}, ${y2.toFixed(1)}]`);
  });

  const pdfBytes = await pdfDoc.save();
  writeFileSync(pdfPath, pdfBytes);

  console.log(`\n✅ 완료!`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  PNG: ${pngPath}`);
}

run().catch(console.error);
