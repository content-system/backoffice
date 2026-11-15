# Backoffice

A TypeScript back-office application built with Express 5, PostgreSQL, Nunjucks server-side templates, and vanilla JavaScript. It provides user/role administration, authorization, audit logs, categories, multilingual content, article publishing, jobs, and contact management.

> **Architecture note:** despite occasional references to Next.js in project discussions, this repository is not a Next.js application. Its server entry point is `server.ts`; HTML pages are rendered with Nunjucks under `views/`.

## Technology

- TypeScript with strict compiler settings
- Express 5
- PostgreSQL (`pg`, `postgres-kit`, `sql-core`)
- Nunjucks templates
- Vanilla JavaScript and CSS
- `authen-service`, JWT, and `security-express` for authentication/authorization
- `validation-core` for model-based request validation
- Webpack for the production server bundle

## Available scripts

```bash
npm ci
npm start       # Development server (ts-node-dev)
npm run build   # Webpack bundle to server.js in the project root
npm run prod    # Run the generated server.js
```

`npm test` is currently a placeholder and does not run a test suite.

## Architecture overview

- `server.ts` — application bootstrap, Nunjucks, PostgreSQL pool, route setup, and HTTP listener.
- `config.ts` — application, authentication, database, logging, and environment configuration.
- `service/context.ts` — dependency composition root.
- `service/index.ts` — Express routes and authorization middleware.
- `service/<feature>/` — domain contracts, repositories, use cases, controllers, and feature composition.
- `service/shared/` — reusable adapters and shared domain utilities.
- `service/resources/` — English and Vietnamese server-side resources.
- `views/` — Nunjucks layouts, pages, and partials.
- `public/static/` and `public/css/` — browser scripts and styles.

## AI-assisted development guidance

Start with [`AGENTS.md`](AGENTS.md). It links to focused documentation for architecture, feature implementation, data access, UI conventions, domain behavior, and development checks:

- [Architecture](docs/architecture.md)
- [Feature development](docs/feature-development.md)
- [Data access](docs/data-access.md)
- [UI conventions](docs/ui-conventions.md)
- [Domain reference](docs/domain-reference.md)
- [Development workflow](docs/development.md)

## Configuration

The application loads `.env` and merges the defaults in `config.ts` with environment-specific configuration. Supply database credentials and authentication secrets through the deployment environment; do not use source-code fallback values as production secrets.
