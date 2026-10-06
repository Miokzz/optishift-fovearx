import { test, expect } from "@playwright/test";
test("all routes load and preserve navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/tecnologia",
    "/engenharia",
    "/empresa",
    "/prototipo",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeVisible();
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("optical simulator responds to keyboard, mode, distance and power", async ({
  page,
}) => {
  await page.goto("/tecnologia");
  const sim = page.locator(".simulator");
  await sim.scrollIntoViewIfNeeded();
  const slider = sim.getByLabel("Ajuste eletrônico");
  await slider.focus();
  await slider.press("End");
  await expect(sim.getByLabel("Ajuste atual")).toHaveText("+1,50 D");
  await sim.getByRole("button", { name: "Automático", exact: true }).click();
  await expect(slider).toBeDisabled();
  await sim.getByRole("button", { name: "Distante · 6 m" }).click();
  await expect(sim.getByLabel("Ajuste atual")).toHaveText("+0,00 D");
  await sim.getByRole("button", { name: "Desligar eletrônica" }).click();
  await expect(sim.getByLabel("Olhar horizontal")).toBeDisabled();
  await sim.getByRole("button", { name: "Reiniciar", exact: false }).click();
  await expect(slider).toBeEnabled();
  await expect(sim.getByLabel("Ajuste atual")).toHaveText("+0,00 D");
});
test("explorer assembles, selects components and changes actual views", async ({
  page,
}) => {
  await page.goto("/engenharia");
  await expect(page.locator(".product-stage")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  await expect(page.locator("canvas")).toBeVisible();
  await page.getByRole("button", { name: "Frontal", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Frontal", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".viewer-caption")).toContainText("ortográfica");
  await page.getByRole("button", { name: "Separar componentes" }).click();
  await expect(page.locator("#explosion")).toHaveValue("1");
  await page.locator("#component-select").selectOption({ index: 1 });
  await expect(page.locator(".part-description h2")).not.toHaveText(
    "O todo e cada parte.",
  );
  await page.getByRole("button", { name: "Retornar à montagem" }).click();
  await expect(page.locator("#explosion")).toHaveValue("0");
  await page.getByRole("button", { name: "Labels", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Labels", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("scroll story goes forward and reverses on one canvas", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-stage")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  await page.evaluate(() => {
    document.querySelector("canvas")!.dataset.testIdentity = "persistent";
  });
  await page.getByRole("button", { name: "Próximo capítulo" }).click();
  await expect(page.locator(".chapter-copy.active h2")).toContainText(
    "Sua visão muda",
  );
  await page.evaluate(() =>
    window.scrollTo(
      0,
      document.querySelector(".story-track")!.getBoundingClientRect().height *
        0.62,
    ),
  );
  await expect(page.locator(".chapter-copy.active h2")).toContainText(
    "Engenharia",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator(".chapter-copy.active h1")).toHaveText(
    "FoveaRx One.",
  );
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-test-identity",
    "persistent",
  );
});
test("production process provides all stages", async ({ page }) => {
  await page.goto("/empresa");
  for (const label of [
    "Projeto",
    "Fornecedores",
    "Shenzhen",
    "Montagem",
    "Calibração",
    "Qualidade",
    "Produto",
  ]) {
    await page
      .locator(".process-flow")
      .getByRole("button", { name: new RegExp(label) })
      .click();
    await expect(page.locator("#production-detail")).toContainText(label);
  }
});
for (const [width, height] of [
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1440, 900],
  [1920, 1080],
  [844, 390],
])
  test(`responsive layout ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of ["/", "/prototipo", "/empresa"]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBeTruthy();
    }
    if (width < 701) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await expect(page.getByRole("navigation")).toBeVisible();
    }
  });
test("reduced motion and no WebGL preserve usable content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      ...args: Parameters<typeof getContext>
    ) {
      if (String(args[0]).includes("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/prototipo");
  await expect(page.locator(".product-stage")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  await expect(page.locator(".stage-fallback img")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".stage-fallback img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(
    page.getByRole("heading", { name: "Explore cada detalhe." }),
  ).toBeVisible();
  await page
    .locator(".simulator")
    .getByRole("button", { name: "Desligar eletrônica" })
    .click();
  await expect(page.getByLabel("Ajuste atual")).toHaveText("+0,00 D");
});

test("automatic demonstration advances and loss of WebGL context shows a real fallback", async ({
  page,
}) => {
  await page.goto("/prototipo");
  await expect(page.locator(".product-stage")).toHaveAttribute(
    "data-renderer",
    "ready",
  );
  const sim = page.locator(".simulator");
  await sim.getByRole("button", { name: "Automático", exact: true }).click();
  const distance = await sim.getByLabel("Distância atual").textContent();
  await expect(sim.getByLabel("Distância atual")).not.toHaveText(distance!);
  await page
    .locator("canvas")
    .evaluate((canvas: HTMLCanvasElement) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator(".product-stage")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  await expect
    .poll(() =>
      page
        .locator(".stage-fallback img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
});
