import { test, expect } from "@playwright/test";

test.describe("Admin Panel - Product Management", () => {
  // Note: This test assumes an admin user exists and environment variables
  // for authentication are set up in the test environment.
  // For a real-world scenario, you might use a separate test user or mock auth.

  const productName = `Test Product ${Date.now()}`;
  const productSlug = `test-product-${Date.now()}`;

  test("should allow an admin to create, publish, and see a new product", async ({
    page,
  }) => {
    // 1. Login as Admin
    await page.goto("/auth/signin");
    await page.getByLabel("Email").fill(process.env.ADMIN_TEST_EMAIL || "admin@example.com");
    await page.getByRole("button", { name: "Sign in with Email" }).click();

    // In a real test, you'd handle the magic link.
    // For this test, we'll assume a simplified or mocked login that redirects.
    // As a placeholder, we will navigate directly to the admin dashboard after initiating login.
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // 2. Navigate to Products and Create a New One
    await page.getByRole("link", { name: "Products" }).click();
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await page.getByRole("link", { name: "Add Product" }).click();
    await expect(page.getByRole("heading", { name: "Add New Product" })).toBeVisible();

    // 3. Fill out the product form
    await page.getByLabel("Title").fill(productName);
    await page.getByLabel("Slug").fill(productSlug);
    await page.getByLabel("Price (in Cents)").fill("1999");
    await page.getByLabel("Description").fill("This is a test description for an E2E test product.");
    await page.getByLabel("Cover Image URL").fill("https://example.com/test-cover.jpg");
    await page.getByLabel("File Key (R2/S3)").fill(`products/${productSlug}.zip`);

    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByLabel('Social Media').click();

    await page.getByRole('combobox', { name: 'License' }).click();
    await page.getByLabel('Commercial').click();

    // For formats, this depends on the implementation. Assuming a simple text input for now.
    // If it's a multi-select, this would need to be adjusted.
    // The current form implementation is missing a 'formats' field. We will skip this for now.

    await page.getByRole("button", { name: "Save" }).click();

    // 4. Verify Product is Created and then Publish It
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

    const productRow = page.getByRole("row", { name: productName });
    await productRow.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Publish" }).click();

    // 5. Verify the Product Appears on the Public Catalog
    await page.goto("/templates");
    await expect(page.getByText(productName)).toBeVisible();
  });
});