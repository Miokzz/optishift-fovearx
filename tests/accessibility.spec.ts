import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("key routes have no serious or critical automated accessibility violations", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/tecnologia",
    "/engenharia",
    "/empresa",
    "/prototipo",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    if (await page.locator(".product-stage").count()) {
      await expect(page.locator(".product-stage")).not.toHaveAttribute(
        "data-renderer",
        "loading",
      );
    }
    await page.waitForTimeout(300);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      result.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  }
});
