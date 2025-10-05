# Contributing to PixelDew

First off, thank you for considering contributing to PixelDew! Any contribution, whether it's a bug report, a new feature, or an improvement to the documentation, is greatly appreciated.

## Development Setup

To get started with local development, please follow the instructions in the main [README.md](./README.md).

## Coding Style

-   **Formatting**: We use **Biome** for both linting and formatting. Please run `pnpm lint:fix` before committing your changes to ensure your code adheres to the project's style.
-   **TypeScript**: We aim for strong type safety. Please use TypeScript features appropriately and avoid using `any` where possible.
-   **Component Structure**: Follow the existing patterns for creating components, especially within the `src/components` and `src/app` directories.

## Submitting a Pull Request

1.  Fork the repository and create your branch from `main`.
2.  Make your changes, ensuring you follow the coding style.
3.  If you add new functionality, please add corresponding tests.
4.  Ensure all existing and new tests pass by running `pnpm test`.
5.  Make sure the CI checks will pass by running `pnpm check` locally.
6.  Submit a pull request with a clear description of the changes you've made.

Thank you for your contribution!