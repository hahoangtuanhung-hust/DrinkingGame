import { expect, test } from "@playwright/test";

test("draws one card and keeps it in history", async ({ page }) => {
  await page.goto("/DrinkingGame/#/");
  await page.getByRole("link", { name: /deal me in/i }).click();
  await page.getByRole("button", { name: /draw a card/i }).click();
  await expect(page.getByText("51", { exact: true })).toBeVisible();
  const historyButton = page.getByRole("button", { name: /draw history/i });
  await expect(historyButton).toContainText("1 card on the table");
  await historyButton.click();
  await expect(page.getByRole("dialog", { name: "1 card on the table" })).toBeVisible();
  await expect(page.locator(".history-modal-list .history-card")).toHaveCount(1);
});

test("shakes and reveals five stable dice", async ({ page }) => {
  await page.goto("/DrinkingGame/#/dice");
  const actionButton = page.locator(".dice-primary-button");
  await expect(actionButton).toHaveAccessibleName("Shake");
  await page.evaluate(() => {
    const button = document.querySelector<HTMLButtonElement>(".dice-primary-button");
    if (!button) throw new Error("Dice action button is missing");
    const timing = { startedAt: 0, completedAt: 0 };
    Object.assign(window, { __diceShakeTiming: timing });
    new MutationObserver(() => {
      if (button.disabled && timing.startedAt === 0) timing.startedAt = performance.now();
      if (!button.disabled && timing.startedAt > 0 && timing.completedAt === 0) timing.completedAt = performance.now();
    }).observe(button, { attributes: true, attributeFilter: ["disabled"] });
  });
  await actionButton.click();
  const openButton = page.getByRole("button", { name: "Open", exact: true });
  await expect(openButton).toBeEnabled({ timeout: 10_000 });
  const shakeDuration = await page.evaluate(() => {
    const timing = (window as typeof window & { __diceShakeTiming: { startedAt: number; completedAt: number } }).__diceShakeTiming;
    return timing.completedAt - timing.startedAt;
  });
  expect(shakeDuration).toBeGreaterThanOrEqual(1_900);
  await expect(page.locator(".dice-status, .gesture-hint, .shake-meter")).toHaveCount(0);
  await openButton.click();
  await expect(actionButton).toHaveAccessibleName("Shake");
  await expect(page.getByText("Total", { exact: true })).toHaveCount(0);
  await expect(page.locator(".dice-primary-control button")).toHaveCount(1);
});

test("switches the whole site between English and Vietnamese", async ({ page }) => {
  await page.goto("/DrinkingGame/#/");
  await page.getByRole("button", { name: "Chuyển sang tiếng Việt" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Khuấy động");
  await page.getByRole("link", { name: /Bắt đầu chia bài/i }).click();
  await expect(page.locator("h1.sr-only")).toHaveText("Rút lá bài định mệnh.");
  await expect(page.getByRole("button", { name: /Rút một lá/i })).toBeVisible();
  await page.getByRole("link", { name: /Sửa luật/i }).click();
  await expect(page.getByRole("heading", { name: "Tạo luật của bạn." })).toBeVisible();
  await expect(page.getByLabel("Tên luật")).toHaveValue("Nâng ly");
  await page.getByRole("button", { name: "Mở cài đặt" }).click();
  await expect(page.getByRole("dialog", { name: "Điều chỉnh trải nghiệm" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/DrinkingGame/#/dice");
  await expect(page.locator(".dice-primary-button")).toHaveAccessibleName("Lắc");
  await expect(page.getByRole("button", { name: "Switch to English" })).toBeVisible();
  await page.reload();
  await expect(page.locator(".dice-primary-button")).toHaveAccessibleName("Lắc");
});

test("switches between light and dark themes and remembers the choice", async ({ page }) => {
  await page.goto("/DrinkingGame/#/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f5efe6");
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("checkbox", { name: /Light theme/i })).toBeChecked();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("changes the complete dice set color and remembers the choice", async ({ page }) => {
  await page.goto("/DrinkingGame/#/dice");
  const stage = page.locator(".dice-stage");
  await expect(stage).toHaveAttribute("data-dice-color", "blue");
  await page.getByRole("button", { name: "Open settings" }).click();
  const colorGroup = page.getByRole("radiogroup", { name: "Choose dice set color" });
  await expect(colorGroup.getByRole("radio")).toHaveCount(6);
  await colorGroup.getByRole("radio", { name: "Red", exact: true }).click();
  await expect(colorGroup.getByRole("radio", { name: "Red", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(stage).toHaveAttribute("data-dice-color", "red");
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(stage).toHaveAttribute("data-dice-color", "red");
});

test("enables the camera torch and pulses it while shaking", async ({ page }) => {
  await page.addInitScript(() => {
    const torchStates: boolean[] = [];
    (window as unknown as { __torchStates: boolean[] }).__torchStates = torchStates;
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => {
          const track = {
            readyState: "live",
            getCapabilities: () => ({ torch: true }),
            applyConstraints: async (constraints: { advanced?: Array<{ torch?: boolean }> }) => {
              torchStates.push(Boolean(constraints.advanced?.[0]?.torch));
            },
            stop: () => { track.readyState = "ended"; },
          };
          return {
            getVideoTracks: () => [track],
            getTracks: () => [track],
          };
        },
      },
    });
  });

  await page.goto("/DrinkingGame/#/dice");
  await page.getByRole("button", { name: "Open settings" }).click();
  const torchToggle = page.getByRole("checkbox", { name: /Camera flash/i });
  await torchToggle.click();
  await expect(torchToggle).toBeChecked();
  await expect(page.getByText(/Ready; the camera is active only while the light pulses/i)).toBeVisible();
  await page.keyboard.press("Escape");

  await page.locator(".dice-primary-button").click();
  await expect(page.locator(".dice-stage")).toHaveClass(/is-light-pulsing/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { __torchStates: boolean[] }).__torchStates.filter(Boolean).length)).toBeGreaterThanOrEqual(2);
});
