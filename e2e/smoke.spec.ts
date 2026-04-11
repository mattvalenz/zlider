import { expect, test } from "@playwright/test";

test.describe("public routes", () => {
  test("login page shows sign-in form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(
      page.getByRole("heading", { name: /sign in/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("new deck page requires auth and redirects to login", async ({
    page,
  }) => {
    await page.goto("/decks/new");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("home redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
