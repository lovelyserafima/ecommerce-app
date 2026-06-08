import { test, expect } from "@playwright/test";

test.describe("Product Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("shows Product Catalog heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Product Catalog" })).toBeVisible();
  });

  test("renders product cards", async ({ page }) => {
    const cards = page.locator(".border.rounded-lg");
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(await cards.count());
  });

  test("shows category filter in sidebar", async ({ page }) => {
    await expect(page.getByText("Category")).toBeVisible();
  });

  test("shows brand filter in sidebar", async ({ page }) => {
    await expect(page.getByText("Brand")).toBeVisible();
  });
});

test.describe("Category filtering", () => {
  test("filters products by category", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: "Footwear" }).click();
    await expect(page).toHaveURL(/category=Footwear/);
  });

  test("shows subcategory filter after selecting category", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("button", { name: "Footwear" }).click();
    await expect(page.getByText("Subcategory")).toBeVisible();
  });

  test("resets subcategory when category changes", async ({ page }) => {
    await page.goto("/products?category=Footwear&subcategory=Sneakers");
    await page.getByRole("button", { name: "Electronics" }).click();
    await expect(page).not.toHaveURL(/subcategory=/);
  });
});

test.describe("Search", () => {
  test("filters products via search input", async ({ page }) => {
    await page.goto("/products");
    await page.getByPlaceholder("Search products...").fill("Nike");
    await expect(page).toHaveURL(/search=Nike/, { timeout: 10000 });
  });

  test("shows no products message for unmatched search", async ({ page }) => {
    await page.goto("/products?search=xyznonexistentproduct123");
    await expect(page.getByText("No products found")).toBeVisible();
  });
});

test.describe("Load More", () => {
  test("shows Load more button when products exceed page size", async ({ page }) => {
    await page.goto("/products?perPage=2");
    await expect(page.getByRole("button", { name: "Load more" })).toBeVisible();
  });
});
