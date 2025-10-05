import { test, expect } from "@playwright/test";

test.describe("Admin Panel - Product Management", () => {
  const adminEmail = process.env.ADMIN_TEST_EMAIL || "admin@example.com";
  const productName = `Test Product ${Date.now()}`;
  const productSlug = `test-product-${Date.now()}`;

  // This test requires the app to be running and for environment variables
  // for an admin user to be configured.
  test.beforeEach(async ({ page }) => {
    // Simulate login via magic link.
    // In a real-world CI, you would likely use a programmatic way to get a session token
    // and set it in the browser context to bypass the UI login for speed and reliability.
    // For this test, we'll simulate the UI flow as much as possible.
    await page.goto("/auth/signin");
    await page.getByLabel("Email").fill(adminEmail);
    await page.getByRole("button", { name: "Sign in with Email" }).click();

    // Since we can't click the magic link from an email in this environment,
    // we'll navigate to the admin page after initiating the sign-in.
    // This assumes the magic link would grant a valid session.
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("should allow an admin to create, publish, and see a new product", async ({
    page,
  }) => {
    // 1. Navigate to Products and Create a New One
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await page.getByRole("link", { name: "Add Product" }).click();
    await expect(page.getByRole("heading", { name: "Add New Product" })).toBeVisible();

    // 2. Fill out the product form
    await page.getByLabel("Title").fill(productName);
    await page.getByLabel("Slug").fill(productSlug);
    await page.getByLabel("Price (in Cents)").fill("2999");
    await page.getByLabel("Description").fill("A detailed description for the test product.");
    await page.getByLabel("Cover Image URL").fill("https://example.com/e2e-cover.png");
    await page.getByLabel("File Key (R2/S3)").fill(`products/${productSlug}.zip`);

    // Select formats
    await page.getByLabel("FIGMA").check();
    await page.getByLabel("CANVA").check();

    // Select category and license
    await page.locator('select[name="category"]').selectOption("SOCIAL_MEDIA");
    await page.locator('select[name="license"]').selectOption("COMMERCIAL");

    await page.getByRole("button", { name: "Save" }).click();

    // 3. Verify Product is Created and then Publish It
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

    const productRow = page.getByRole("row", { name: productName });
    await productRow.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Publish" }).click();

    // 4. Verify the Product Appears on the Public Catalog
    await page.goto("/templates");
    await expect(page.getByText(productName)).toBeVisible();
  });
});