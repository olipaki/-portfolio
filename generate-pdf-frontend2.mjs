import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "pdf-output", "frontend2");
const FRONTEND2_DIR = path.join(__dirname, "frontend2");
const PORT = 5185;
const DEV_URL = `http://localhost:${PORT}`;

const SECTIONS = [
  { id: "s0", name: "Resume" },
  { id: "s1", name: "Operations_Impact" },
  { id: "s2", name: "Career" },
  { id: "s3", name: "AI_Projects" },
];

// ── 개발 서버 시작 ──────────────────────────────────
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log("🚀 frontend2 dev server 시작 중...");
    const proc = spawn("npx", ["vite", "--port", String(PORT)], {
      cwd: FRONTEND2_DIR,
      stdio: ["ignore", "pipe", "pipe"],
    });
    proc.stdout.on("data", (d) => {
      if (d.toString().includes("ready")) {
        console.log(`   ✓ 서버 준비 완료 (${DEV_URL})`);
        resolve(proc);
      }
    });
    proc.stderr.on("data", (d) => {
      const msg = d.toString();
      if (msg.includes("already in use")) {
        console.log(`   ✓ 포트 ${PORT} 이미 실행 중`);
        resolve(proc);
      }
    });
    setTimeout(() => resolve(proc), 8000); // 최대 8초 대기
    proc.on("error", reject);
  });
}

// ── 섹션별 전체 스크린샷 캡처 ──────────────────────
async function captureSection(browser, sectionId, tmpPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(DEV_URL, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 2000));

  // 해당 섹션만 표시, 나머지 숨김 + nav/fixed 제거
  await page.addStyleTag({
    content: `
      section:not(#${sectionId}) { display: none !important; }
      section#${sectionId} {
        min-height: unset !important;
        height: auto !important;
        padding-top: 56px !important;
        padding-bottom: 60px !important;
      }
      nav,
      [style*="position: fixed"],
      [style*="position:fixed"] { display: none !important; }
      body { background: #ffffff !important; }
    `,
  });

  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: tmpPath, fullPage: true });
  await page.close();
}

// ── PNG → PDF 페이지 변환 ──────────────────────────
async function pngToPdfPage(pdfDoc, pngPath) {
  const pngBytes = readFileSync(pngPath);
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const { width, height } = pngImage.scale(0.5); // 2x → 1x
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(pngImage, { x: 0, y: 0, width, height });
  return { width, height };
}

// ── 메인 ──────────────────────────────────────────
async function run() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const devServer = await startDevServer();
  // 서버 준비 대기 (이미 시작된 경우 포함)
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const combinedPdf = await PDFDocument.create();
  const tmpFiles = [];

  try {
    for (const { id, name } of SECTIONS) {
      console.log(`\n📄 캡처 중: ${name} (#${id})`);
      const tmpPath = path.join(OUTPUT_DIR, `__tmp_${id}.png`);
      tmpFiles.push(tmpPath);

      await captureSection(browser, id, tmpPath);

      // ① 개별 PDF 저장
      const indivPdf = await PDFDocument.create();
      const { width, height } = await pngToPdfPage(indivPdf, tmpPath);
      const indivPath = path.join(OUTPUT_DIR, `${name}.pdf`);
      writeFileSync(indivPath, await indivPdf.save());
      console.log(`   ✓ 개별 PDF 저장: ${indivPath}  (${Math.round(width)}×${Math.round(height)})`);

      // ② 통합 PDF에 추가
      await pngToPdfPage(combinedPdf, tmpPath);
      console.log(`   ✓ 통합 PDF에 추가`);
    }

    // 통합 PDF 저장
    const combinedPath = path.join(OUTPUT_DIR, "Portfolio_frontend2_Full.pdf");
    writeFileSync(combinedPath, await combinedPdf.save());
    console.log(`\n✅ 통합 PDF 저장: ${combinedPath}`);

  } finally {
    await browser.close();
    devServer.kill();

    // 임시 PNG 삭제
    for (const f of tmpFiles) {
      try { unlinkSync(f); } catch {}
    }
  }

  console.log(`\n📁 저장 위치: ${OUTPUT_DIR}`);
  console.log("   개별 PDF × 4  +  통합 PDF × 1  =  총 5파일");
}

run().catch((err) => {
  console.error("❌ 오류:", err);
  process.exit(1);
});
