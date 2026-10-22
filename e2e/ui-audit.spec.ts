import { expect, test } from "@playwright/test";

const routes = ["/DrinkingGame/#/", "/DrinkingGame/#/cards", "/DrinkingGame/#/cards/rules", "/DrinkingGame/#/dice"];

test.describe("automated mobile UI audit", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const route of routes) {
    test(`${route} has no overflow, unnamed controls, or undersized primary targets`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1, { timeout: 15_000 });

      const report = await page.evaluate(() => {
        const visible = (element: Element) => {
          const node = element as HTMLElement;
          const style = getComputedStyle(node);
          return node.getClientRects().length > 0 && style.visibility !== "hidden" && style.display !== "none";
        };
        const interactive = [...document.querySelectorAll<HTMLElement>("button, a[href]")].filter(visible);
        const unnamed = interactive.filter((element) => {
          const name = element.getAttribute("aria-label") ?? element.textContent ?? "";
          return !name.trim();
        }).map((element) => element.outerHTML.slice(0, 120));
        const undersized = interactive.filter((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.width < 44 || bounds.height < 44;
        }).map((element) => {
          const bounds = element.getBoundingClientRect();
          return `${element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 30)} (${Math.round(bounds.width)}x${Math.round(bounds.height)})`;
        });
        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          unnamed,
          undersized,
        };
      });

      expect(report.overflow, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
      expect(report.unnamed, `Unnamed controls on ${route}`).toEqual([]);
      expect(report.undersized, `Touch targets below 44px on ${route}`).toEqual([]);
    });
  }

  test("settings dialog traps focus and returns it to the opener", async ({ page }) => {
    await page.goto("/DrinkingGame/#/");
    const opener = page.getByRole("button", { name: "Open settings" });
    await opener.click();
    const dialog = page.getByRole("dialog", { name: "Set the mood" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close dialog" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.locator("select")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test("dice layout remains usable in a short landscape viewport", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/DrinkingGame/#/dice");
    await expect(page.getByRole("button", { name: "Shake", exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator(".dice-primary-control button")).toHaveCount(1);
  });

  test("all routes remain overflow-free at required breakpoints", async ({ page }) => {
    const viewports = [
      { width: 320, height: 760 },
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ];
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator("h1")).toHaveCount(1, { timeout: 15_000 });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} overflows at ${viewport.width}px`).toBeLessThanOrEqual(1);
      }
    }
  });

  test("Vietnamese copy remains overflow-free on a narrow phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 760 });
    await page.goto("/DrinkingGame/#/");
    await page.getByRole("button", { name: "Chuyển sang tiếng Việt" }).click();
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1, { timeout: 15_000 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} Vietnamese copy overflows at 320px`).toBeLessThanOrEqual(1);
    }
  });

  test("mobile rule filters keep the editor close while preserving all 52 cards", async ({ page }) => {
    await page.goto("/DrinkingGame/#/cards/rules");
    await expect(page.locator(".rule-card-grid button")).toHaveCount(13);
    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.locator(".rule-card-grid button")).toHaveCount(52);
  });

  test("mobile primary actions stay reachable and drawing advances to the reveal", async ({ page }) => {
    await page.goto("/DrinkingGame/#/dice");
    const diceAction = page.locator(".dice-primary-button");
    await diceAction.scrollIntoViewIfNeeded();
    await expect(diceAction).toBeVisible();
    await expect(page.locator(".dice-primary-control button")).toHaveCount(1);
    await page.goto("/DrinkingGame/#/cards");
    await page.getByRole("button", { name: /draw a card/i }).click();
    await expect.poll(async () => {
      const box = await page.locator(".reveal-zone").boundingBox();
      return box?.y ?? 999;
    }, { timeout: 5_000 }).toBeLessThan(80);
  });
});
