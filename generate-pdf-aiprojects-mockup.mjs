import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output");

const DEV_URL = process.env.DEV_URL || "http://localhost:5174";

// 추출할 페이지만 지정: AI Projects(s7, 마지막 섹션)
const KEEP_ID = "s7";
const OUT_NAME = "AIProjects_목업ai설명추가";

async function run() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
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
      section:not(#${KEEP_ID}) {
        display: none !important;
      }
      nav, [style*="position: fixed"], [style*="position:fixed"] {
        display: none !important;
      }
    `,
  });

  await new Promise((r) => setTimeout(r, 500));

  const pngPath = path.join(OUTPUT_DIR, `${OUT_NAME}.png`);
  await page.screenshot({ path: pngPath, fullPage: true });
  console.log("PNG 저장 완료");

  await browser.close();

  const pdfPath = path.join(OUTPUT_DIR, `${OUT_NAME}.pdf`);
  const pngBytes = readFileSync(pngPath);
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const { width, height } = pngImage.scale(0.5);
  const pdfPage = pdfDoc.addPage([width, height]);
  pdfPage.drawImage(pngImage, { x: 0, y: 0, width, height });
  const pdfBytes = await pdfDoc.save();
  writeFileSync(pdfPath, pdfBytes);

  console.log(`\n✅ 완료!`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  PNG: ${pngPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
