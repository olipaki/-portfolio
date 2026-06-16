import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output");

// 추출할 페이지만 지정: Resume(s0) · 지원동기(s2) · Career(s4) · AI Projects(s7)
const KEEP_IDS = ["s0", "s2", "s4", "s7"];

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

  // 폰트·이미지 로드 대기
  await new Promise((r) => setTimeout(r, 2500));

  const hideSelector = "section" + KEEP_IDS.map((id) => `:not(#${id})`).join("");

  // 슬라이드 고정 높이 해제 + 선택된 섹션만 표시
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
      /* 네비게이션 고정바 숨김 */
      nav, [style*="position: fixed"], [style*="position:fixed"] {
        display: none !important;
      }
    `,
  });

  await new Promise((r) => setTimeout(r, 500));

  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`전체 높이: ${fullHeight}px`);

  const pngPath = path.join(OUTPUT_DIR, "portfolio_selected.png");
  await page.screenshot({
    path: pngPath,
    fullPage: true,
  });
  console.log("PNG 저장 완료");

  await browser.close();

  const pdfPath = path.join(OUTPUT_DIR, "portfolio_selected.pdf");
  const pngBytes = readFileSync(pngPath);
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const { width, height } = pngImage.scale(0.5); // 2x 스케일 → 1x로 축소
  const pdfPage = pdfDoc.addPage([width, height]);
  pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });
  const pdfBytes = await pdfDoc.save();
  writeFileSync(pdfPath, pdfBytes);

  console.log(`\n✅ 완료!`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  PNG: ${pngPath}`);
}

run().catch(console.error);
