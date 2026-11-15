# Adding a feature

This guide describes the repository's current feature pattern. It is intended for changes that fit the existing Express/Nunjucks application; it is not a Next.js feature recipe.

## 1. Choose the closest existing example

| New feature requirement | Start from |
|---|---|
| Basic list/search/details/create/update | `service/category/` |
| Custom PostgreSQL search filters | `service/job/repository.ts` |
| Composite primary key / localized rows | `service/content/` |
| Many-to-many assignment | `service/user/` or `service/role/` |
| Transactions, state transitions, history, notifications | `service/article/` |
| Read-only report/search | `service/audit-log/` |

Do not copy a complex feature wholesale when the new feature only needs CRUD.

## 2. Add the domain contract and metadata

Create `service/<feature>/<feature>.ts`. Typical contents:

- Domain interface using camelCase property names.
- Filter interface extending `Filter` from `onecore`.
- Repository interface.
- Service interface.
- `Attributes` object describing the mapping to SQL columns and validation/search metadata.

Typical shape (illustrative; adapt it to the real entity):

```ts
import { Attributes, Filter, SearchResult } from "onecore"

export interface Example {
  id: string
  name: string
  status: string
  createdBy: string
  createdAt?: Date
  updatedBy: string
  updatedAt?: Date
}

export interface ExampleFilter extends Filter {
  id?: string
  name?: string
  status?: string[]
}

export interface ExampleRepository {
  search(filter: ExampleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Example>>
  load(id: string): Promise<Example | null>
  create(item: Example): Promise<number>
  update(item: Example): Promise<number>
  delete(id: string): Promise<number>
}

export interface ExampleService {
  search(filter: ExampleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Example>>
  load(id: string): Promise<Example | null>
  create(item: Example): Promise<number>
  update(item: Example): Promise<number>
  delete(id: string): Promise<number>
}

export const exampleModel: Attributes = {
  id: { key: true, length: 40, required: true },
  name: { length: 255, required: true, q: true },
  status: { length: 1 },
  createdBy: { column: "created_by", noupdate: true },
  createdAt: { column: "created_at", type: "datetime", noupdate: true, createdAt: true },
  updatedBy: { column: "updated_by" },
  updatedAt: { column: "updated_at", type: "datetime", updatedAt: true },
}
```

The exact supported `Attributes` flags are defined by the installed `onecore`/`sql-core` versions. Inspect a close existing model before using an unfamiliar flag. Commonly seen metadata includes `key`, `column`, `length`, `required`, `q`, `operator`, `type`, `noupdate`, `createdAt`, `updatedAt`, `version`, and `ignored`.

## 3. Implement the repository

Create `repository.ts`. Use the least complex base class that fits:

- `Repository<T, Id, Filter>` for straightforward CRUD/search.
- `SearchRepository<T, Filter>` when a custom search query is needed.
- `SqlSearchWriter<T, Filter>` for search plus create/update/patch behavior.
- `SqlViewRepository<T, Id>` for read-only SQL-backed views.
- `SearchBuilder<T, Filter>` for read-only search-only features.

Examples:

- `SqlCategoryRepository` extends `Repository`.
- `SqlJobRepository` extends `Repository` and provides `buildQuery()`.
- `SqlContentRepository` extends `SqlSearchWriter` and overrides composite-key `load`/`delete`.
- `SqlArticleRepository` extends `SqlViewRepository` for the published article view.

For custom SQL:

- Bind every value with `this.db.param(index)` or the existing `postgres-kit` `param` helper.
- Build `where` clauses and `params` together; keep placeholder numbering synchronized.
- Use `buildSort(filter.sort, model)` rather than accepting a raw sort expression.
- Use a fixed list of sortable fields in the controller for UI sort links.
- Never interpolate a request-provided table name, column name, order direction, or filter value.

## 4. Implement business rules in the service

Create `service.ts`. Typical simple features extend `UseCase<T, Id, Filter>` or `SearchWriter<T, Filter>` and only override operations with domain-specific behavior.

Keep these concerns in the service:

- ID generation (existing examples commonly use `nanoid(10)`).
- Slug generation (`service/common/slug.ts`).
- State transitions and business invariants.
- Coordinating multiple repositories/adapters.
- Transaction boundaries for multi-write operations.

Do not put request/response objects or Nunjucks rendering into the service.

## 5. Implement the controller

Create `controller.ts` with Express `Request` and `Response` handlers. Existing controllers commonly:

- Bind methods in the constructor (`this.search = this.search.bind(this)`) before passing them directly to Express.
- Resolve language/resource with `getLang(req, res)` and `getResource(lang)`.
- Parse filters with `hasSearch(req)` and `fromRequest<T>()`.
- Use `resources.defaultLimit`, `getOffset`, `buildPages`, `buildPageSearch`, `buildSortSearch`, and `buildMessage` for list pages.
- Call the service inside `try/catch` and render errors with `renderError500` or return JSON errors with `handleError`.
- Validate write payloads with `validate<T>(value, model, resource)` and respond with `respondError(res, errors)`.
- Read the authenticated user from `res.locals.userId` and permission bits from `res.locals.permissions`.
- Escape data passed to templates with `escape()` / `escapeArray()`.

The usual list-page pattern is visible in `service/category/controller.ts`, `service/role/controller.ts`, and `service/user/controller.ts`. Use a simpler controller when the feature does not need all of the search/pagination helpers.

For create/update handlers, the common route parameter convention is `:id`; `id === "new"` means create mode. Existing status-code behavior varies by feature; copy the nearest relevant controller rather than imposing one universal response mapping.

## 6. Compose the feature

Create `service/<feature>/index.ts`:

```ts
import { DB } from "onecore"
import { ExampleController } from "./controller"
import { SqlExampleRepository } from "./repository"
import { ExampleUseCase } from "./service"

export * from "./controller"

export function useExampleController(db: DB): ExampleController {
  const repository = new SqlExampleRepository(db)
  const service = new ExampleUseCase(repository)
  return new ExampleController(service)
}
```

Adjust the constructor if the feature needs existing services or adapters. `article/index.ts` is the reference for wiring multiple repositories and shared adapters.

Then update `service/context.ts`:

1. Import `ExampleController` and `useExampleController`.
2. Add `example: ExampleController` (or an appropriate property name) to `Context`.
3. Construct it inside `useContext()`.
4. Include it in the returned context object.

## 7. Register and protect the routes

Add routes in `route()` in `service/index.ts`. Follow the existing resource route layout:

```ts
const readExample = ctx.authorize("example", read)
const writeExample = ctx.authorize("example", write)
app.get("/examples", readExample, ctx.menu.build, ctx.example.search)
app.get("/examples/:id", readExample, ctx.menu.build, ctx.example.view)
app.post("/examples/:id", writeExample, ctx.menu.build, json(), ctx.example.submit)
```

This is only a shape example. Use the permission constants already imported from `security-express`; use `approve` only if the feature has a separate approval permission. Keep the module ID consistent with the `modules` / `role_modules` rows that drive privileges.

Do not forget route-level body parsing. Existing JSON write routes explicitly include `json()`. Login uses `urlencoded()`.

## 8. Add templates, localization, and browser behavior

See [UI conventions](ui-conventions.md). A common pair is:

- `views/pages/examples.html` for the list.
- `views/pages/example.html` for the detail/form.

Add English and Vietnamese resource keys. Update `views/partials/resource.html` only for messages read by browser scripts. Add JavaScript only if the existing shared form/navigation helpers cannot cover the interaction.

## 9. Final checklist

- [ ] New types, filters, and model metadata reflect the actual database schema.
- [ ] Repository values are parameterized; sort fields are allow-listed.
- [ ] Business invariants are in the service, not the controller.
- [ ] Controller handlers are bound when Express receives the method reference.
- [ ] `Context` and `useContext()` include the new controller.
- [ ] Routes are registered with server-side authorization and correct body parsers.
- [ ] Template values are escaped because Nunjucks autoescape is off.
- [ ] English and Vietnamese strings are added.
- [ ] Navigation/form behavior works with full and `partial=true` requests.
- [ ] TypeScript/build checks have been run where dependencies/environment permit.
