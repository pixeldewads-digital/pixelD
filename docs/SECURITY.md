# Security Measures

This document outlines the key security measures and best practices implemented in the PixelDew project.

## Authentication and Authorization

-   **Session Management**: User authentication is handled by **NextAuth.js (v5)**, which provides secure session management using industry-standard practices (e.g., JWTs or database sessions).
-   **Role-Based Access Control (RBAC)**: The system implements a simple RBAC with two roles: `USER` and `ADMIN`.
-   **Admin Access**: All administrative routes under `/admin` are protected by a layout guard (`src/app/admin/layout.tsx`). This guard verifies the user's session on the server and checks that their role is `ADMIN`. Any unauthorized access attempt results in a redirect to the sign-in page.

## Payment Processing

-   **Server-Side Price Calculation**: The application **never trusts prices sent from the client**. During the checkout process, the server re-fetches all product details from the database to calculate the final total, preventing price tampering.
-   **Webhook Signature Validation**: All incoming webhooks from payment providers (e.g., Stripe) are verified using a secret key. The signature of each webhook request is validated to ensure it originates from the payment provider and has not been tampered with. This is a critical step to prevent fraudulent order status updates.
-   **Idempotency**: The order creation process uses an **idempotency key**, which is a unique hash generated from the user's cart contents and their user ID. This key is stored with the order, preventing the accidental creation of duplicate orders if a user retries a request.

## Storage and Downloads

-   **Secure File Access**: Digital product files are stored in a private S3-compatible bucket and are **never exposed directly to the public**.
-   **Signed URLs**: Access to purchased files is granted exclusively through **short-lived signed URLs**. These URLs are generated on-demand by the server and are typically valid for only 3-5 minutes, providing just enough time for the user's browser to initiate the download.
-   **Download Policy Enforcement**:
    -   **Max Attempts**: Each purchased item has a maximum number of download attempts (configurable via `DOWNLOAD_MAX_ATTEMPTS` in `.env`). Each successful download request is logged, and further requests are denied once the limit is reached.
    -   **Time-to-Live (TTL)**: Download access for a purchase expires after a set number of days (configurable via `SIGNED_URL_TTL_DAYS`). The API checks the order date against this policy before generating a new link.
-   **Access Validation**: The API endpoint for requesting a download link (`/api/downloads/request`) strictly validates that the requester is the authenticated owner of the order.

## General Security Practices

-   **Secrets Management**: All sensitive information—such as API keys, database credentials, and auth secrets—is managed exclusively through **environment variables**. The `.env.example` file provides a template, but the `.env` file itself is included in `.gitignore` and should never be committed to version control.
-   **Dependency Management**: The project uses **Dependabot** to automatically monitor for security vulnerabilities in dependencies and create pull requests to update them.
-   **Rate Limiting**: While not implemented with a dedicated library, the download request API has an implicit rate limit due to the server-side checks and database operations. For a production environment, implementing a formal rate-limiting solution (e.g., with Upstash or a middleware) on critical API endpoints is recommended.