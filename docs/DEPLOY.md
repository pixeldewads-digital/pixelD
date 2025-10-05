# Deployment Guide

This guide provides instructions for deploying the PixelDew project to **Vercel**.

## Prerequisites

-   A Vercel account.
-   A GitHub account with the project repository.
-   A PostgreSQL database (e.g., from Neon, Supabase, or Vercel Postgres).
-   An S3-compatible object storage bucket (e.g., Cloudflare R2 or AWS S3).
-   API keys for the services used: Google (OAuth), Stripe (Payments), and Resend (Emails).

## Step 1: Connect Your Repository to Vercel

1.  Log in to your Vercel dashboard.
2.  Click "Add New..." -> "Project".
3.  Import the Git repository for this project from your GitHub account.
4.  Vercel will automatically detect that it is a Next.js project and configure the build settings. No changes are needed for the framework preset, build command, or output directory.

## Step 2: Configure Environment Variables

This is the most critical step. In your Vercel project settings, navigate to "Settings" -> "Environment Variables". Add all the variables from the `.env.example` file.

**Key variables to set:**

-   `DATABASE_URL`: The connection string for your PostgreSQL database.
-   `NEXTAUTH_URL`: The canonical URL of your production deployment (e.g., `https://your-domain.com`).
-   `NEXTAUTH_SECRET`: A strong, randomly generated secret. You can generate one with `openssl rand -base64 32`.
-   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Your Google OAuth credentials.
-   `PAYMENT_PROVIDER`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: Your Stripe API keys and webhook secret.
-   `S3_*` variables: Your credentials for the S3-compatible bucket where product files are stored.
-   `RESEND_API_KEY`: Your API key for Resend.
-   `ADMIN_EMAILS`: A comma-separated list of emails for users who should have admin privileges.

## Step 3: Set Up the Database

1.  **Connect to your database provider**: Ensure your Vercel project can access the PostgreSQL database. If you are using a provider that requires IP whitelisting, add Vercel's IP addresses.
2.  **Run Migrations**: To apply the database schema, you need to run the Prisma migrations against your production database. The recommended way to do this is to run the command from your local machine, pointed at the production database:
    ```bash
    pnpm db:deploy
    ```
    Alternatively, you can configure a custom "Build Command" in Vercel to run the migration before the build, but this is generally less safe. Example: `pnpm db:deploy && pnpm build`.

## Step 4: Configure Webhooks

After deploying, you will get a production URL. Use this URL to configure the webhook endpoints in your payment provider's dashboard.

-   **Stripe Webhook URL**: `https://<your-domain.com>/api/webhooks/stripe`
-   Listen for the `checkout.session.completed` event.
-   Make sure to use the `STRIPE_WEBHOOK_SECRET` you generated and added to your Vercel environment variables.

## Step 5: Deploy

Once your repository is connected and the environment variables are set, Vercel will automatically handle the rest.

-   **Production Branch**: Every push to the `main` branch will trigger a new production deployment.
-   **Preview Deployments**: Every pull request will automatically generate a unique preview deployment URL. This allows you to test changes in a production-like environment before merging them.

## Continuous Integration

The project's GitHub Actions workflow (`.github/workflows/ci.yml`) is configured to run on every pull request. It performs:
- Linting (`pnpm lint`)
- Type checking (`pnpm typecheck`)
- Unit tests (`pnpm test -- --coverage`)
- E2E tests (`pnpm e2e`)
- Blog content validation (`pnpm blog:check`)

These checks ensure code quality and prevent broken code from being merged into the `main` branch. Vercel's GitHub integration will show the status of these checks directly on the pull request.