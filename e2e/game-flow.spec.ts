import { expect, test } from "@playwright/test";

test("draws one card and keeps it in history", async ({ page }) => {
  await page.goto("/DrinkingGame/#/");
  await page.getByRole("link", { name: /deal me in/i }).click();
  await page.getByRole("button", { name: /draw a card/i }).click();
  await expect(page.getByText("51", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 card on the table/i)).toBeVisible();
});

test("shakes and reveals five stable dice", async ({ page }) => {
  await page.goto("/DrinkingGame/#/dice");
  const actionButton = page.locator(".dice-primary-button");
  await expect(actionButton).toHaveAccessibleName("Shake");
  await actionButton.click();
  const openButton = page.getByRole("button", { name: "Open", exact: true });
  await expect(openButton).toBeEnabled({ timeout: 10_000 });
  await expect(page.locator(".dice-status, .gesture-hint, .shake-meter")).toHaveCount(0);
  await openButton.click();
  await expect(actionButton).toHaveAccessibleName("Shake");
  await expect(page.getByText("Total", { exact: true })).toHaveCount(0);
  await expect(page.locator(".dice-primary-control button")).toHaveCount(1);
});

test("switches the dice interface between English and Vietnamese", async ({ page }) => {
  await page.goto("/DrinkingGame/#/dice");
  await page.getByRole("button", { name: "Chuyển sang tiếng Việt" }).click();
  await expect(page.locator(".dice-primary-button")).toHaveAccessibleName("Lắc");
  await expect(page.getByRole("button", { name: "Switch to English" })).toBeVisible();
  await page.reload();
  await expect(page.locator(".dice-primary-button")).toHaveAccessibleName("Lắc");
});
