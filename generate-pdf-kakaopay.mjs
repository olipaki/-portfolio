import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output");

const DEV_URL = process.env.DEV_URL || "http://localhost:5174";

// 추출할 페이지: 1페이지(Resume, s0) · Career(s4) — 각각 별도 PDF 페이지로 구성
const PAGES = [
  { id: "s0", name: "1페이지" },
  { id: "s4", name: "Career" },
];

async function capture(browser, id) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(DEV_URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2000));

  await page.addStyleTag({
    content: `
      section {
        min-height: unset !important;
        height: auto !important;
        padding-top: 60px !important;
        padding-bottom: 60px !important;
      }
      section:not(#${id}) {
        display: none !important;
      }
      nav, [style*="position: fixed"], [style*="position:fixed"] {
        display: none !important;
      }
    `,
  });

  await new Promise((r) => setTimeout(r, 500));

  const pngPath = path.join(OUTPUT_DIR, `__kakaopay_${id}.png`);
  await page.screenshot({ path: pngPath, fullPage: true });
  await page.close();
  return pngPath;
}

async function run() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const pdfDoc = await PDFDocument.create();

  for (const { id, name } of PAGES) {
    console.log(`캡처 중: ${name} (#${id})`);
    const pngPath = await capture(browser, id);
    const pngBytes = readFileSync(pngPath);
    const pngImage = await pdfDoc.embedPng(pngBytes);
    const { width, height } = pngImage.scale(0.5); // 2x 스케일 → 1x로 축소
    const pdfPage = pdfDoc.addPage([width, height]);
    pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });
    console.log(`  -> 페이지 추가 완료 (${Math.round(width)}x${Math.round(height)})`);
  }

  await browser.close();

  const pdfPath = path.join(OUTPUT_DIR, "1페이지_Career_카카오페이.pdf");
  const pdfBytes = await pdfDoc.save();
  writeFileSync(pdfPath, pdfBytes);

  console.log(`\n✅ 완료!`);
  console.log(`  PDF: ${pdfPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
