# Architecture Overview

This document provides a high-level overview of the technical architecture for the PixelDew project.

## Core Components

The application is built on a modern, server-centric web stack, primarily leveraging the Next.js ecosystem.

-   **Frontend**: Built with **Next.js 15 (App Router)** and **React 19**. UI components are created using **Tailwind CSS** and **shadcn/ui**. Client-side state (like the shopping cart) is managed by **Zustand**.
-   **Backend**: Leverages **Next.js API Routes** and **Server Actions** for backend logic. This includes handling checkout, secure download requests, and admin panel operations.
-   **Database**: A **PostgreSQL** database is used for data persistence, managed through the **Prisma ORM**. This includes all user data, products, orders, and reviews.
-   **Authentication**: Handled by **NextAuth.js (v5)**, supporting Google OAuth and email-based magic links. It uses the Prisma adapter to store session and user data directly in the database. An admin role is managed via an environment variable whitelist.
-   **Payments**: A multi-provider payment system is structured to support **Stripe**, **Midtrans**, and **Xendit**. The active provider is determined by an environment variable. Webhooks are used to confirm payment status asynchronously.
-   **Storage**: Digital product files are stored in an **S3-compatible object storage** (like Cloudflare R2 or AWS S3). Secure access is provided via short-lived, signed URLs generated on demand.
-   **Transactional Email**: Invoices and other notifications are sent via the **Resend** API.
-   **CI/CD**: The project uses **GitHub Actions** for continuous integration, running linting, type checks, and tests on every pull request. Deployment is designed for and handled by **Vercel**.

## Folder Structure

The project follows a structure conventional for Next.js App Router applications:

-   `content/blog/`: Contains the MDX files for the blog posts.
-   `docs/`: Contains project documentation (architecture, security, deployment).
-   `prisma/`: Contains the Prisma schema (`schema.prisma`), migrations, and seed script.
-   `public/`: Static assets like images, icons, and the `manifest.webmanifest`.
-   `scripts/`: Contains utility scripts, such as the blog content validator.
-   `src/app/`: The core of the Next.js application, containing all routes and UI.
    -   `src/app/api/`: API route handlers (e.g., for webhooks, checkout).
    -   `src/app/admin/`: All routes and components for the admin panel.
    -   `src/app/(public_routes)/`: Contains all public-facing pages like `/`, `/blog`, `/templates`, `/cart`, etc.
-   `src/components/`: Shared UI components, organized by feature (e.g., `blog`, `products`).
-   `src/lib/`: Core logic, utilities, and third-party service integrations.
    -   `src/lib/admin/`: Admin-specific utilities, like Zod validators.
    -   `src/lib/blog/`: The content loader for the MDX blog.
    -   `src/lib/payments/`: Integrations for Stripe, Midtrans, etc.
    -   `src/lib/storage/`: S3 client and signed URL generation logic.
    -   `src/lib/db.ts`: The singleton Prisma client instance.

## Data Flow: Checkout & Download

The primary user flow for a purchase is as follows:

1.  **Add to Cart**: A user adds a product to their cart. The cart state is managed on the client with Zustand and persisted in `localStorage`.
2.  **Create Order**: On checkout, the client sends the cart contents to the `/api/checkout/create-order` endpoint.
3.  **Server Validation**: The server validates the cart items, calculates the total price (applying any coupons), and creates an `Order` record in the database with a `PENDING` status. An idempotency key prevents duplicate orders.
4.  **Payment Session**: The server calls the configured payment provider (e.g., Stripe) to create a payment session and returns a redirect URL to the client.
5.  **Payment Gateway**: The user is redirected to the payment provider's page to complete the payment.
6.  **Webhook Confirmation**: After payment, the provider sends a webhook to `/api/webhooks/<provider>`. The server validates the webhook's signature.
7.  **Order Fulfillment**: Upon successful validation, the server updates the `Order` status to `PAID`. It then triggers a transactional email (via Resend) to the user with an invoice and a link to their download page.
8.  **Secure Download**: On the `/download` page, the user can request a download link for their purchased item. The `/api/downloads/request` endpoint validates their ownership and download limits before generating a short-lived, secure signed URL for the file in the S3 bucket.