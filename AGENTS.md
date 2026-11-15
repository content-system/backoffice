# AGENTS.md — Backoffice project guide

## Project identity: read this first

This repository is a **TypeScript + Express 5 back-office application** backed by PostgreSQL. It renders HTML with **Nunjucks** and uses browser-side **vanilla JavaScript** for forms, AJAX requests, and partial-page navigation.

**This is not a Next.js project.** The inspected source has no `next` or `react` dependency, no Next.js `app/` or `pages/` router, and no React component tree. The HTTP entry point is `server.ts`; the view system is under `views/`. Do not introduce Next.js conventions, React components, App Router APIs, Server Actions, or Next.js configuration when implementing ordinary features. Only do so when the task explicitly requests a migration.

Read the relevant reference before making a change:

- [Architecture](docs/architecture.md) — runtime, layers, feature map, and request lifecycle.
- [Feature development](docs/feature-development.md) — how to add a domain feature consistently.
- [Data access](docs/data-access.md) — PostgreSQL, model metadata, repositories, SQL, and transactions.
- [UI conventions](docs/ui-conventions.md) — Nunjucks pages, forms, partial navigation, resources, and browser scripts.
- [Domain reference](docs/domain-reference.md) — existing business concepts, permissions, and workflows.
- [Development workflow](docs/development.md) — commands, formatting, and verification limitations.

## Rules for every change

1. **Inspect before editing.** Read a nearby feature with the closest behavior. Prefer `category` for simple CRUD, `content` for a composite-key entity, `user` or `role` for join-table assignments, and `article` for transactions and multi-step workflows.
2. **Preserve the existing architecture.** Keep business features under `service/<feature>/`; keep shared business adapters under `service/shared/`; keep page templates under `views/pages/`; keep shared templates under `views/partials/`; keep browser scripts under `public/static/`; keep CSS under `public/css/`.
3. **Keep responsibilities separated.** Controllers handle HTTP, validation, authorization context, and rendering/response mapping. Services/use cases hold business rules. Repositories handle persistence. `index.ts` files compose dependencies. Do not put SQL in a controller or HTML rendering in a repository.
4. **Use the existing libraries and abstractions.** The project relies on `onecore`, `sql-core`, `postgres-kit`, `express-web-kit`, `security-express`, `validation-core`, `ui-formatter`, and related `core-ts` packages. Reuse the closest existing abstraction rather than adding a new framework or utility dependency.
5. **Keep TypeScript strict.** `tsconfig.json` enables `strict`. Use explicit domain/filter/repository/service types and avoid adding `any` unless an existing third-party boundary requires it.
6. **Match formatting.** Follow `.prettierrc.json`: 2 spaces, double quotes, no semicolons, trailing commas, and a 160-character print width. Existing files are not perfectly uniform; for a touched file, follow its local style while keeping new code aligned with these settings.
7. **Use parameterized SQL.** Use `this.db.param(index)` or the existing `postgres-kit` `param` helper for values. Never interpolate user-controlled values into SQL. SQL identifiers (table/column/order-by) must come from fixed code or a validated allow-list.
8. **Respect authorization.** Register protected routes with `ctx.authorize(moduleId, permission)` in `service/index.ts`. Use the same module identifier as the `modules`/`role_modules` data. Do not rely only on hiding a button in the HTML.
9. **Respect the template escaping model.** Nunjucks is configured with `autoescape: false` in `server.ts`. Use the existing `escape`/`escapeArray` helpers before rendering untrusted values, and review every new template interpolation. Do not assume Nunjucks escapes automatically.
10. **Keep localization complete.** Add user-facing server strings to both `service/resources/en.ts` and `service/resources/vi.ts`, or the appropriate feature-specific `en.ts`/`vi.ts` pair already merged by `service/resources/index.ts`. Add client-side messages to `views/partials/resource.html` only when browser JavaScript needs them.
11. **Preserve response conventions.** Existing controllers commonly return `201` for successful creation, `200` for successful update/action, `204` for assignment actions with no body, `400` for invalid/conflicting input, `409` for duplicate/state conflicts, and `410` when an item is missing. Follow the closest feature; do not change semantics casually.
12. **Do not expose secrets.** `config.ts` contains fallback connection/token settings. Treat them as development-only, do not copy credentials into docs, tests, logs, or new code, and use environment-specific configuration for deployment.
13. **Do not assume database cascades.** The schema supplied with the project uses application-managed relationships in many places and the feature repositories explicitly delete join-table rows. Verify constraints and deletion semantics before relying on cascade behavior.
14. **Do not invent tests or scripts.** The current `test` script is a placeholder that exits with an error. Report honestly what was run. Add tests only using a test framework that is deliberately introduced and configured, or use the existing project's available checks.
15. **Keep scope focused.** Avoid broad renames, framework migrations, unrelated refactoring, or replacing the current UI stack while implementing an ordinary feature.

## Established feature layout

A typical feature has these files:

```text
service/<feature>/
  <feature>.ts       # domain types, filters, ports, and Attributes metadata
  repository.ts      # SQL repository / query builder
  service.ts         # use case / business logic
  controller.ts      # Express handlers
  index.ts           # dependency composition; re-exports public feature types
```

Not every feature needs all five files. `audit-log` is a read/search-only feature, `authentication` has a dedicated controller, and `article` has additional repositories/adapters. Do not create empty layers just to match the diagram.

## Normal implementation sequence for a new feature

1. Confirm the table shape and existing domain/table naming.
2. Define the domain interface, filter, repository/service contracts, and `Attributes` metadata in `<feature>.ts`.
3. Implement persistence in `repository.ts` using the closest `sql-core` repository base class; add a custom query builder only when needed.
4. Implement business rules in `service.ts`.
5. Implement an Express controller in `controller.ts`; bind handler methods in the constructor when passed directly to Express.
6. Compose the repository, service, and controller in `index.ts`.
7. Add the controller to `Context` and construct it in `useContext()` in `service/context.ts`.
8. Register routes in `route()` in `service/index.ts`, including read/write/approve authorization as appropriate.
9. Add Nunjucks templates in `views/pages/`, resource strings in English and Vietnamese, and browser code/CSS only as necessary.
10. Verify imports, route permissions, SQL parameterization, escaping, and behavior using the commands in [Development workflow](docs/development.md).

## Representative implementations

- Simple CRUD: `service/category/`
- Search with a custom PostgreSQL query: `service/job/`
- Composite key and language-specific rows: `service/content/`
- Many-to-many user/role assignment: `service/user/` and `service/role/`
- Multi-step transactional workflow: `service/article/`
- Read-only search feature: `service/audit-log/`

When behavior differs between these examples, preserve the domain-specific behavior rather than copying the wrong example.
