# PixelDew

PixelDew is a modern, full-featured e-commerce platform for selling digital products. It's built from the ground up with a focus on developer experience, performance, and security, leveraging a modern Next.js and TypeScript stack.

This repository contains the complete implementation, from the public-facing product catalog to the secure admin panel for managing the store.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js v5)
- **Payments**: [Stripe](https://stripe.com/) (with a multi-provider architecture)
- **Transactional Email**: [Resend](https://resend.com/)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/) (or any S3-compatible service)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (E2E)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)

## Core Features

-   **Product Catalog**: A filterable and sortable catalog of digital products.
-   **Secure Checkout**: A robust shopping cart and checkout flow powered by Stripe.
-   **Download Center**: A post-purchase area for users to download their products via secure, time-limited signed URLs.
-   **Admin Panel**: A comprehensive, role-protected dashboard for managing products, orders, and reviews.
-   **MDX Blog**: A fully-featured blog with i18n support and a full suite of SEO enhancements.

## Getting Started

To get the development server running locally, follow these steps:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Set up environment variables**:
    Copy the `.env.example` file to a new file named `.env` and fill in the required values (database credentials, auth secrets, API keys, etc.).
    ```bash
    cp .env.example .env
    ```
3.  **Run database migrations**:
    This will set up your database schema based on the Prisma model.
    ```bash
    pnpm db:migrate
    ```
4.  **(Optional) Seed the database**:
    To populate your database with sample products and an admin user, run:
    ```bash
    pnpm db:seed
    ```
5.  **Run the development server**:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

For more detailed information about the project, please refer to the documentation in the `docs/` directory:

-   [**Architecture Overview**](./docs/ARCHITECTURE.md): A high-level look at the project's structure and data flows.
-   [**Security Measures**](./docs/SECURITY.md): An outline of the security practices implemented.
-   [**Deployment Guide**](./docs/DEPLOY.md): Instructions for deploying the project to Vercel.

## Available Scripts

This project includes a variety of scripts to aid in development and quality control:

-   `pnpm dev`: Starts the development server.
-   `pnpm build`: Builds the application for production.
-   `pnpm analyze`: Builds the app and opens the bundle analyzer.
-   `pnpm check`: Runs linting, type checking, and unit tests.
-   `pnpm test`: Runs unit tests.
-   `pnpm test:ui`: Opens the Vitest UI for interactive testing.
-   `pnpm e2e`: Runs end-to-end tests with Playwright.
-   `pnpm e2e:headed`: Runs E2E tests in headed mode.
-   `pnpm db:*`: A set of scripts for managing the database (e.g., `db:migrate`, `db:seed`).
-   `pnpm blog:*`: Scripts for validating blog content (`blog:check`, `blog:dev`).

## Quality Assurance: CI-Only Workflow

This project maintains code quality through a **CI-only workflow**. There are no pre-commit or pre-push hooks configured locally. Instead, all code is validated on the CI server when you push a branch or open a pull request. The CI pipeline runs linting, type checking, unit tests, E2E tests, and content validation to ensure the codebase remains healthy.