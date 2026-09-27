import fs from "node:fs";
import path from "node:path";
import puppeteer, { type LaunchOptions } from "puppeteer-core";

function getSystemExecutablePath(): string | undefined {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

async function exportPdf(): Promise<void> {
  console.log("🚀 Launching Next.js PDF exporter with Bun...");

  const currentDir = (import.meta as any).dir || process.cwd();
  const projectRoot = (import.meta as any).dir
    ? path.join(currentDir, "..", "..")
    : process.cwd();
  const outputPath = path.join(projectRoot, "cv.pdf");

  const executablePath = getSystemExecutablePath();
  if (!executablePath) {
    throw new Error("Chrome or Edge executable not found on Windows.");
  }

  const launchOptions: LaunchOptions = {
    headless: true,
    executablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  try {
    await page.goto("http://localhost:3000", {
      waitUntil: ["load", "networkidle0"],
      timeout: 8000,
    });
  } catch {
    console.log(
      "⚠️ Next.js dev server not running on port 3000. Start it with `bun dev`.",
    );
    await browser.close();
    return;
  }

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    tagged: true,
    margin: {
      top: "0mm",
      bottom: "0mm",
      left: "0mm",
      right: "0mm",
    },
  });

  await browser.close();
  console.log(`✅ Success! PDF generated at: ${outputPath}`);
}

exportPdf().catch((err: unknown) => {
  console.error("❌ Error exporting PDF:", err);
  process.exit(1);
});
