# Data access and PostgreSQL conventions

## Database connection path

`server.ts` creates a `pg.Pool`, wraps it with `PoolManager` from `postgres-kit`, and passes the resulting `DB` abstraction into `useContext()`. Feature repositories receive this `DB` through constructor injection. Do not instantiate a new pool in a feature.

The project uses PostgreSQL-specific SQL and types, including positional parameters, `timestamptz`, arrays, JSONB, and array overlap (`&&`).

## Domain property to SQL column mapping

Domain interfaces generally use camelCase; database columns use snake_case. The `Attributes` metadata declares the mapping and other persistence/validation behavior.

Example from the project:

```ts
updatedAt: {
  column: "updated_at",
  type: "datetime",
  updatedAt: true,
}
```

Commonly used metadata:

| Metadata | Observed purpose |
|---|---|
| `key: true` | Marks a primary-key field for repository/model helpers. |
| `column` | Maps a TypeScript property to a differently named SQL column. |
| `length` | Declares a maximum field length used by validation/model helpers. |
| `required` | Marks a required value. |
| `q: true` | Includes the field in the model's general text-search behavior / query metadata. |
| `operator` | Declares an explicit comparison operator for search metadata. |
| `type: "datetime"` | Maps date/time values. |
| `type: "integer"` | Declares integer metadata. |
| `type: "strings"` | Declares string-array metadata. |
| `noupdate: true` | Keeps create-only values from being updated by generic builders. |
| `createdAt: true` / `updatedAt: true` | Marks timestamp fields for repository helpers. |
| `version: true` | Marks the optimistic-lock version field (used by `categories` and `contents`). |
| `ignored: true` | Excludes non-column/interface-only fields such as `user.roles` from generic SQL mapping. |

Confirm exact semantics in the installed package versions and nearby code before relying on an unfamiliar metadata option.

## Repository selection

| Base class / helper | Existing use |
|---|---|
| `Repository<T, Id, Filter>` | Standard CRUD and search; `category`, `job`, `contact`, `draft_articles`. |
| `SearchRepository<T, Filter>` | Search base with custom query; `user`, `role`. |
| `SqlSearchWriter<T, Filter>` | Search plus generic write operations; `content`. |
| `SqlViewRepository<T, Id>` | Read-only view/table access; published `articles`. |
| `SearchBuilder<T, Filter>` | Read/search builder for `audit_logs`. |
| `buildToInsert`, `buildToUpdate` | Generic SQL statement builders using model metadata. |
| `buildToInsertBatch` | Batch insertion of join-table rows. |
| `buildMap` | Builds the database-to-domain result mapping from metadata. |
| `buildSort` | Converts model-aware sort metadata to a safe SQL order expression. |

Do not add hand-written CRUD SQL if the existing generic repository class already supports the operation. Override methods when a composite key, view, join, or business-specific query requires it.

## Parameterized SQL

The established style builds SQL placeholders from `this.db.param(index)` or `param(index)` imported from `postgres-kit`:

```ts
const query = `select * from examples where id = ${this.db.param(1)}`
return this.db.query<Example>(query, [id], this.map)
```

For variable filters, increment a local parameter index as parameters are appended. Keep the `params` array in exactly the same order as the placeholders.

Use fixed SQL fragments for identifiers. Never create SQL by concatenating a request-provided column, table, sort direction, or literal value. For sorting, use `buildSort(filter.sort, exampleModel)` and keep UI sort fields in a fixed controller `fields` array.

The existing custom search repositories demonstrate PostgreSQL-specific behavior:

- `user/repository.ts`: `ILIKE` prefix/contains matching, status filters, exclusion lists, and `buildSort`.
- `job/repository.ts`: text matching, date ranges, and array overlap with `skills && $n`.
- `article/repository.ts`: tags array overlap, date/status filters, and draft-article search.

When implementing `ILIKE`, escape `%` and `_` from user input when they should be treated literally, as the user and job repositories attempt to do.

## Composite keys and join tables

Not every entity has a single `id` primary key:

- `contents` is keyed by `(id, lang)`; see `Content` and `SqlContentRepository`.
- `user_roles` is keyed by `(user_id, role_id)`; user/role repositories explicitly insert/delete join rows.
- `role_modules` links roles and modules and stores integer permission bits.
- `saved_articles` links users and articles.

For composite keys, make the repository method signatures include all key parts and ensure every query constrains all of them. For many-to-many updates, follow `user/repository.ts` or `role/repository.ts` and consider transaction requirements if partial writes would violate consistency.

## Transactions

`article/service.ts` is the complex transaction example. It coordinates draft/article repositories and history/notification adapters for submit, approval, and rejection paths.

When a business operation must update multiple tables atomically:

1. Begin the transaction from the injected DB abstraction.
2. Pass the same transaction to every participating repository/adapter method that supports it.
3. Commit only after all required writes succeed.
4. Roll back on failure and rethrow/report the error using the feature's established handling style.
5. Keep external side effects (such as notifications) out of the critical transaction when possible, or explicitly define what happens if the database commits but delivery fails.

Do not assume a repository method participates in a transaction unless its signature accepts and forwards the transaction.

## Audit history and notifications

`service/shared/history.ts` provides a generic `HistoryAdapter<T>` that writes to the configured history table and can omit fields such as IDs and audit timestamps. `service/shared/notification.ts` provides a notification adapter. `service/shared/approvers.ts` resolves approvers. `article/index.ts` shows how to compose these for one feature.

Reuse these adapters when the new feature's semantics match them; do not create a parallel history/notification schema without a concrete requirement.

## Schema and integrity notes

The supplied schema uses `varchar` identifiers, status characters, PostgreSQL timestamps, arrays, and JSONB. Many logical relationships are represented in application code rather than declared foreign keys. Existing delete methods sometimes delete join rows before deleting the parent. Preserve this behavior unless the actual deployed schema and intended lifecycle prove otherwise.

No migration or seed management tool/directory was found in the archive. For a schema change, document the required DDL separately and confirm the target database version/environment. Do not claim the TypeScript model alone migrates the database.

## Data-safety checklist

- Parameterize every value.
- Validate allowed sort fields/operators.
- Match property names and `Attributes` column mapping to the deployed schema.
- Include all composite-key parts in reads, updates, and deletes.
- Preserve optimistic-lock `version` metadata where applicable.
- Use transactions when multi-table invariants require atomicity.
- Avoid logging passwords, passcodes, tokens, or other secrets.
- Confirm deletion behavior without assuming foreign-key cascades.
