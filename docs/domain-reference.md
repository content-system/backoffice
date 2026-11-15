# Existing domain reference

This file summarizes the business concepts visible in the TypeScript source and the provided PostgreSQL schema. Treat the source code and deployed schema as authoritative when changing behavior; this document is a navigation aid, not a replacement for DDL.

## System configuration

- `code_masters`: generic master/code/name/sequence/status lookup table appears in the supplied schema, but no direct feature implementation was found in the inspected TypeScript source.
- `modules`: navigation/module metadata, including `path`, `resource_key`, `icon`, `sequence`, `actions`, and `parent`.
- `categories`: hierarchical categories with `parent`, display metadata, type/status, audit columns, and `version`.

The `modules` rows are also used by role-based authorization and menu construction. A new protected module generally needs a matching module identifier configured in the database.

## Users, authentication, roles, and authorization

Relevant tables: `users`, `passwords`, `passcodes`, `roles`, `user_roles`, and `role_modules`.

- Authentication is delegated to `authen-service` through `Authenticator`, a SQL authentication configuration, and password comparison via `bcryptjs` in `service/context.ts`.
- `LoginController` in `service/authentication/index.ts` renders the sign-in page, validates credentials, authenticates, signs a JWT, sets a cookie, and redirects to a privilege-derived path.
- `user_roles` is the many-to-many relationship between users and roles.
- `role_modules` stores the role/module relationship and integer permission bits.
- `service/role/repository.ts` serializes module privileges in a UI-facing string form and persists integer permissions.
- `security-express` supplies `read` and `write`; the route module defines `approve = 8` for article approval.

Do not change permission bit values or module IDs without coordinating the database seed/configuration and every route/controller that uses them. Route authorization must be applied server-side.

## Audit logs and entity histories

- `audit_logs` is queried by the read-only `audit-log` feature.
- `histories` stores entity-level history through `HistoryAdapter<T>` in `service/shared/history.ts`.
- `Action` defines the event codes used by the article workflow: create, update, submit, approve, reject, and delete.

Audit logs and business entity histories are separate concepts; do not collapse them into one mechanism without a product requirement.

## Notifications

`notifications` is written through `NotificationAdapter` in `service/shared/notification.ts`. The article workflow notifies approvers when submitted and notifies the submitter after a review outcome. Keep notification transport/data handling in the shared adapter rather than embedding table SQL in the controller.

## Articles and content

Relevant tables: `contents`, `draft_articles`, `articles`, and `saved_articles`.

- `contents` stores language-specific rows with composite key `(id, lang)`, an optional publication timestamp, tags, status, and optimistic-lock `version`.
- `draft_articles` and `articles` have similar structures. The article service reads/updates drafts and saves the published representation separately.
- Article creation/update can write draft state and history; submission triggers approver notifications; approval/rejection updates state and records history.
- `saved_articles` represents user bookmarks for articles. No dedicated saved-article feature/controller was found in the inspected archive.

The article feature is more complex than normal CRUD. Read `service/article/service.ts`, `service/article/repository.ts`, and `service/article/index.ts` before changing its workflow.

## Jobs and contacts

- `jobs` stores job postings, with slug, title, description, publication/expiration dates, company, position, quantity, location, skills array, salary bounds, status, and audit columns. `JobUseCase` generates IDs/slugs and enforces draft-oriented update behavior.
- `contacts` stores contact submissions and follow-up fields such as `contacted_by` and `contacted_at`.

These are separate feature areas from article publishing. Reuse their simple CRUD/search patterns only when the new behavior is genuinely similar.

## Statuses and permissions

Status values are represented as short strings in the database. The shared article/status helper in `service/shared/status.ts` and the job-local `Status` in `service/job/job.ts` are not identical; do not assume all domains share one global enum.

Observed shared status constants include draft, submitted, rejected, approved, published, expired, request-to-edit, active, inactive, and deactivated/deleted values. Some names reuse the same one-character code in different contexts. Always inspect the feature-specific status rules before adding transitions.

Permission checks use bitwise operations, for example `write != (write & permissions)` to calculate whether the current page is read-only. Article approval is a separate permission bit (`8`). Follow the existing route and controller pair when adding a permission-sensitive action.

## Table coverage caveat

The supplied schema contains tables that do not currently have an obvious dedicated service in this archive (for example `code_masters`, and possibly passcode-related storage managed by `authen-service`). Do not create a feature merely because a table exists; first verify the requested business behavior and whether a dependency package owns that behavior.
