# PixelDew

This project is a modern web application built with the Next.js 15 App Router, TypeScript, and Tailwind CSS. It is designed with a focus on developer experience and code quality, enforced through a CI-only workflow.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Package Manager**: [PNPM](https://pnpm.io/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Unit Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Dependency Management**: [Dependabot](https://docs.github.com/en/code-security/dependabot)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Auth.js v5)
- **Payments**: [Stripe](https://stripe.com/)

## Getting Started

To get the development server running, follow these steps:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Set up environment variables**:
    Copy the `.env.example` file to a new file named `.env` and fill in the required values (database credentials, auth secrets, Stripe keys, etc.).
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

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts a production server.
- `pnpm typecheck`: Runs TypeScript to check for type errors.
- `pnpm lint`: Checks the code for linting errors using Biome.
- `pnpm lint:fix`: Automatically fixes linting and formatting errors.
- `pnpm test`: Runs unit tests with Vitest.
- `pnpm e2e`: Runs end-to-end tests with Playwright.
- `pnpm check`: A convenience script that runs linting, type checking, and unit tests in sequence.
- `pnpm db:generate`: Generates the Prisma client based on your schema.
- `pnpm db:migrate`: Runs database migrations for development.
- `pnpm db:deploy`: Deploys database migrations for production.
- `pnpm db:seed`: Seeds the database with sample data.
- `pnpm db:reset`: Resets the database, deleting all data.

## Core Features

### Product Catalog & PDP
- Browse all published products on the catalog page (`/templates`).
- Filter products by category and sort by price or creation date.
- View product details on a dynamic product detail page (PDP).

### Authentication
- Users can sign in with Google or via a magic link sent to their email.
- The system supports both `USER` and `ADMIN` roles.
- Admin routes under `/admin` are protected.

### Shopping Cart & Checkout
- A client-side shopping cart using Zustand with localStorage persistence.
- A multi-step checkout process that integrates with Stripe for payments.
- Server-side validation of cart contents and pricing.
- Webhook endpoint to handle payment confirmation from Stripe.

## Quality Assurance: CI-Only Workflow

This project maintains code quality through a **CI-only workflow**. There are no pre-commit or pre-push hooks configured locally. Instead, all code is validated on the CI server when you push a branch or open a pull request.

The CI pipeline, defined in `.github/workflows/ci.yml`, automatically runs the following checks:

1.  **Linting**: Ensures code style and consistency.
2.  **Type Checking**: Validates TypeScript types.
3.  **Unit Tests**: Verifies individual components and functions.

A pull request can only be merged into the `main` branch if all these checks pass, ensuring that the codebase remains healthy.