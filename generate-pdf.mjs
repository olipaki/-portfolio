import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output");

async function run() {
  const fs = await import("fs");
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });

  // 폰트·이미지 로드 대기
  await new Promise((r) => setTimeout(r, 2500));

  // 슬라이드 고정 높이 해제 → 전체 콘텐츠가 자연스럽게 이어지도록
  await page.addStyleTag({
    content: `
      section {
        min-height: unset !important;
        height: auto !important;
        padding-top: 60px !important;
        padding-bottom: 60px !important;
      }
      /* 네비게이션 고정바 숨김 */
      nav, [style*="position: fixed"], [style*="position:fixed"] {
        display: none !important;
      }
    `,
  });

  await new Promise((r) => setTimeout(r, 500));

  // 전체 페이지 높이 측정
  const fullHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`전체 높이: ${fullHeight}px`);

  // PNG 먼저 저장 (전체 스크린샷)
  const pngPath = path.join(OUTPUT_DIR, "portfolio_full.png");
  await page.screenshot({
    path: pngPath,
    fullPage: true,
  });
  console.log("PNG 저장 완료");

  // viewport 높이를 전체 높이로 설정 후 PDF 생성
  await page.setViewport({ width: 1440, height: fullHeight, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 300));

  const pdfPath = path.join(OUTPUT_DIR, "portfolio_full.pdf");
  await page.pdf({
    path: pdfPath,
    width: "1440px",
    height: `${fullHeight}px`,
    printBackground: true,
    pageRanges: "1",
  });

  await browser.close();
  console.log(`\n✅ 완료!`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  PNG: ${pngPath}`);
}

run().catch(console.error);
