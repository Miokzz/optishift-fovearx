import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
await mkdir("docs/evidence", { recursive: true });
await page.goto(base);
await page.locator('[data-renderer="ready"]').waitFor();
await page.waitForTimeout(1200);
await page.screenshot({ path: "docs/evidence/hero-desktop.png" });
for (const [n, name] of [
  [2, "optical-layers"],
  [3, "infrared"],
  [7, "exploded-story"],
  [11, "finale"],
]) {
  await page.evaluate((n) => {
    const el = document.querySelector(".story-track");
    window.scrollTo(0, ((el.offsetHeight - innerHeight + 64) * n) / 11);
  }, n);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `docs/evidence/${name}.png` });
}
await page.goto(`${base}/engenharia`);
await page.locator('[data-renderer="ready"]').waitFor();
await page.locator(".viewer-workbench").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: "Explodida", exact: true }).click();
await page.waitForTimeout(1100);
await page.screenshot({ path: "docs/evidence/engineering.png" });
await page.goto(`${base}/empresa`);
await page.locator("#network-title").scrollIntoViewIfNeeded();
await page.screenshot({ path: "docs/evidence/company.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base);
await page.locator('[data-renderer="ready"]').waitFor();
await page.waitForTimeout(1100);
await page.screenshot({ path: "docs/evidence/hero-mobile.png" });
await page.goto(`${base}/prototipo`);
await page.locator('[data-renderer="ready"]').waitFor();
await page.locator(".viewer-workbench").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: "docs/evidence/prototype-mobile.png" });
await page.getByRole("button", { name: "Labels", exact: true }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "docs/evidence/prototype-mobile-labels.png" });
// Local authoring only: derive static media from the exact product geometry.
if (base.includes("127.0.0.1:5173")) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  const result = await page.evaluate(async () => {
    const { createProductScene } = await import("/src/three/scene.ts");
    const host = document.createElement("div");
    host.style.cssText =
      "position:fixed;inset:0;width:1200px;height:580px;z-index:1000;background:#08090a";
    document.body.append(host);
    let signalReady;
    let signalError;
    const ready = new Promise((resolve, reject) => {
      signalReady = resolve;
      signalError = reject;
    });
    const api = createProductScene(host, {
      interactive: true,
      onReady: signalReady,
      onError: () => signalError(new Error("Studio failed to initialize")),
    });
    api.setView("hero");
    await ready;
    await new Promise((r) => setTimeout(r, 1200));
    const image = api.capture();
    const stats = api.getStats();
    api.dispose();
    host.remove();
    const decoded = new Image();
    decoded.src = image;
    await decoded.decode();
    const webps = [600, 1200].map((width) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round((width * 580) / 1200);
      canvas
        .getContext("2d")
        .drawImage(decoded, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/webp", 0.94);
    });
    return { image, stats, webps };
  });
  await writeFile(
    "public/product-still.png",
    Buffer.from(result.image.split(",")[1], "base64"),
  );
  await writeFile(
    "public/product-still-small.webp",
    Buffer.from(result.webps[0].split(",")[1], "base64"),
  );
  await writeFile(
    "public/product-still.webp",
    Buffer.from(result.webps[1].split(",")[1], "base64"),
  );
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.evaluate((image) => {
    document.body.innerHTML = "";
    document.body.style.cssText =
      "margin:0;background:#08090a;font-family:Inter Variable,Arial,sans-serif;color:#f5f6f5";
    const img = new Image();
    img.src = image;
    img.style.cssText =
      "position:absolute;top:0;left:180px;width:840px;height:406px;object-fit:contain";
    document.body.append(img);
    const title = document.createElement("div");
    title.style.cssText =
      "position:absolute;top:382px;left:0;width:100%;text-align:center";
    title.innerHTML =
      '<div style="font-size:76px;letter-spacing:-5px">FoveaRx One.</div><div style="font-size:23px;margin-top:12px;color:#bdc5c7">Seu olhar muda. Sua visão acompanha.</div><div style="font-size:11px;letter-spacing:2px;margin-top:36px;color:#9ba5a9">OPTISHIFT TECHNOLOGIES · PROTÓTIPO DIGITAL CONCEITUAL</div>';
    document.body.append(title);
  }, result.image);
  await page.waitForTimeout(200);
  await page.screenshot({ path: "public/og.png" });
  await writeFile(
    "docs/evidence/render-stats.json",
    JSON.stringify(
      {
        ...result.stats,
        environment:
          "Local Chrome desktop via Playwright; no universal FPS claim",
      },
      null,
      2,
    ),
  );
  console.log(result.stats);
}
await browser.close();
