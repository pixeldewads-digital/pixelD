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

## Getting Started

To get the development server running, follow these steps:

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Run the development server**:
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

This project includes a set of scripts to help with development and quality control:

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts a production server.
- `pnpm typecheck`: Runs TypeScript to check for type errors.
- `pnpm lint`: Checks the code for linting errors using Biome.
- `pnpm lint:fix`: Automatically fixes linting and formatting errors.
- `pnpm test`: Runs unit tests with Vitest.
- `pnpm e2e`: Runs end-to-end tests with Playwright.
- `pnpm check`: A convenience script that runs linting, type checking, and unit tests in sequence.

## Quality Assurance: CI-Only Workflow

This project maintains code quality through a **CI-only workflow**. There are no pre-commit or pre-push hooks configured locally. Instead, all code is validated on the CI server when you push a branch or open a pull request.

The CI pipeline, defined in `.github/workflows/ci.yml`, automatically runs the following checks:

1.  **Linting**: Ensures code style and consistency.
2.  **Type Checking**: Validates TypeScript types.
3.  **Unit Tests**: Verifies individual components and functions.

A pull request can only be merged into the `main` branch if all these checks pass, ensuring that the codebase remains healthy.