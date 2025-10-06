# Deployment Guide: Vercel

This guide provides instructions for deploying the PixelDew project to **Vercel**. For a more integrated experience, consider the [Railway deployment guide in our README](./README.md).

## Prerequisites

-   A Vercel account.
-   A GitHub account with the project repository.
-   An external PostgreSQL database. We recommend using a provider like **Railway** or **Neon**, as Vercel's hobby-tier Postgres is not ideal for production applications.
-   An S3-compatible object storage bucket (e.g., Cloudflare R2 or AWS S3).
-   API keys for all required services: Google (OAuth), Stripe (Payments), and Resend (Emails).

## Step 1: Connect Your Repository to Vercel

1.  Log in to your Vercel dashboard and create a new project.
2.  Import the Git repository for this project from your GitHub account.
3.  Vercel will automatically detect the Next.js framework and configure the build settings.

## Step 2: Set Up Your External Database

Before proceeding, ensure you have a PostgreSQL database ready.

1.  **Create a database**: Use a service like **Railway** or **Neon** to create a new PostgreSQL database.
2.  **Get the Connection String**: Find the connection string (often labeled `DATABASE_URL`) for your new database. You will need this for the next step.

## Step 3: Configure Environment Variables

In your Vercel project settings, navigate to **Settings -> Environment Variables**. Add all the variables from the `.env.example` file, ensuring you use the production values.

**Key variables to set:**

-   `DATABASE_URL`: The connection string from your external database provider.
-   `NEXTAUTH_URL`: The canonical URL of your production deployment (e.g., `https://your-domain.com`).
-   `NEXTAUTH_SECRET`: A strong, randomly generated secret. You can generate one with `openssl rand -base64 32`.
-   All other API keys and secrets for Google, Stripe, Resend, and S3.

## Step 4: Run Database Migrations

To apply the database schema to your production database, you must run the Prisma `deploy` command. **This should be done from your local machine**, pointed at the production database.

1.  Temporarily update the `DATABASE_URL` in your local `.env` file to your production database string.
2.  Run the following command:
    ```bash
    pnpm db:deploy
    ```
3.  **Important**: Revert the `DATABASE_URL` in your local `.env` file back to your local database connection string afterward.

*Note: While you can chain `pnpm db:deploy` into the build command in Vercel, it is generally safer to run migrations as a separate, deliberate step.*

## Step 5: Deploy

Once your repository is connected and the environment variables are set, Vercel will automatically handle the rest. Every push to the `main` branch will trigger a new production deployment.

## Step 6: Configure Webhooks

After your first successful deployment, use the production URL to configure the webhook endpoint in your Stripe dashboard.

-   **Stripe Webhook URL**: `https://<your-domain.com>/api/webhooks/stripe`
-   Listen for the `checkout.session.completed` event.
-   Ensure your `STRIPE_WEBHOOK_SECRET` environment variable in Vercel matches the secret shown in your Stripe dashboard.