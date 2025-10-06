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
    Copy the `.env.example` file to a new file named `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```
3.  **Run database migrations**:
    This command applies any pending database schema changes to your local database.
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

## Deployment

This project is optimized for deployment on modern hosting platforms like **Vercel** and **Railway**.

### Deploying to Railway

Railway is the recommended platform for a seamless deployment experience, thanks to its integrated support for both the application and the PostgreSQL database.

1.  **Connect Your Repo**: In your Railway dashboard, create a new project and connect it to your GitHub repository.
2.  **Add PostgreSQL Plugin**: Within your project, add a "PostgreSQL" service. Railway will automatically provision a database and inject the `DATABASE_URL` environment variable into your application service.
3.  **Set Environment Variables**: In your application service settings, navigate to the "Variables" tab and add all the required environment variables from the `.env.example` file (excluding `DATABASE_URL`, which is handled automatically).
4.  **Deploy**: Railway will detect the `Dockerfile` and automatically build and deploy your application. The `prestart` script in `package.json` will run your database migrations on every new deployment.
5.  **Update Domain**: Once deployed, update your `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` environment variables to match your public Railway domain.

### Deploying to Vercel

For detailed instructions on deploying to Vercel, see our [Vercel Deployment Guide](./docs/DEPLOY.md). Note that you will need to connect to an external database provider, such as Railway or Neon.

## Documentation

For more detailed information about the project, please refer to the documentation in the `docs/` directory:

-   [**Architecture Overview**](./docs/ARCHITECTURE.md)
-   [**Security Measures**](./docs/SECURITY.md)
-   [**Deployment Guide**](./docs/DEPLOY.md)
-   [**Contributing Guide**](./docs/CONTRIBUTING.md)
-   [**Changelog**](./docs/CHANGELOG.md)

## Available Scripts

-   `pnpm dev`: Starts the development server.
-   `pnpm dev-seed`: Migrates, seeds, and starts the dev server.
-   `pnpm build`: Builds the application for production.
-   `pnpm check`: Runs linting, type checking, and unit tests.
-   `pnpm db:*`: Scripts for managing the database.
-   `pnpm blog:*`: Scripts for validating blog content.

## Quality Assurance

This project uses a **CI-only workflow** via GitHub Actions. All pull requests are automatically validated for code quality, ensuring the `main` branch is always stable.