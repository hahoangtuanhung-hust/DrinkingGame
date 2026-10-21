import { expect, test } from "@playwright/test";

test("draws one card and keeps it in history", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /deal me in/i }).click();
  await page.getByRole("button", { name: /draw a card/i }).click();
  await expect(page.getByText("51", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 card on the table/i)).toBeVisible();
});

test("shakes and reveals five stable dice", async ({ page }) => {
  await page.goto("/dice");
  await page.getByRole("button", { name: /shake dice/i }).click();
  const openButton = page.getByRole("button", { name: /open cup/i });
  await expect(openButton).toBeEnabled({ timeout: 10_000 });
  await expect(page.getByText(/result concealed/i)).toBeVisible();
  await openButton.click();
  await expect(page.getByText("Total", { exact: true })).toBeVisible();
  await expect(page.locator(".result-pips span")).toHaveCount(5);
});
