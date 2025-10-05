import { test, expect } from "@playwright/test";

test.describe("Guest User E-commerce Flow", () => {
  test("should allow a guest to add an item to the cart and be prompted to sign in at checkout", async ({
    page,
  }) => {
    // 1. Visit the templates page and find a product
    await page.goto("/templates");

    // This assumes there's at least one product card visible.
    // A more robust test might create a product first or mock the data.
    const firstProduct = page.locator(".group").first();
    await expect(firstProduct).toBeVisible();

    const productName = await firstProduct.getByRole("heading").textContent();
    expect(productName).not.toBeNull();

    // 2. Click on the product to go to the PDP
    await firstProduct.click();
    await expect(page).toHaveURL(/\/templates\//);
    await expect(page.getByRole("heading", { name: productName! })).toBeVisible();

    // 3. Add the item to the cart
    await page.getByRole("button", { name: "Add to Cart" }).click();

    // 4. Verify the toast notification appears
    await expect(page.getByText(`${productName} has been added to your cart.`)).toBeVisible();

    // 5. Navigate to the cart page
    // A real site would have a cart icon/link. We'll navigate directly.
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
    await expect(page.getByText(productName!)).toBeVisible();

    // 6. Proceed to checkout
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();

    // 7. Verify the user is redirected to the sign-in page
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    // 8. Verify the callbackUrl is set correctly
    const url = new URL(page.url());
    expect(url.searchParams.get("callbackUrl")).toBe("/checkout");
  });
});