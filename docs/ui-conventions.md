# UI, templates, and browser conventions

## Stack

The UI is server-rendered HTML using Nunjucks, enhanced by global vanilla JavaScript functions and CSS. It is not React, Next.js, JSX, or a client-side router framework.

## Template organization

```text
views/
  layout.html                 # Global shell and shared script/CSS loading
  signin.html                 # Login page
  error.html                 # Error page
  components/                 # Reusable template components (currently small)
  pages/                      # Feature pages
  partials/                   # Navigation, header, search, pagination, CSS, resources, etc.
```

`service/template.ts` renders a page by compiling a wrapper that extends `layout.html` and includes `views/pages/<name>.html`. The `partial=true` query causes `getTemplateString()` to return the page template alone, so the same page can be returned as a fragment for in-page navigation.

Common page naming:

- List page: plural, for example `users.html`, `roles.html`, `articles.html`.
- Detail/form page: singular, for example `user.html`, `role.html`, `article-form.html`.
- Related action page: descriptive, for example `user-assign.html`, `role-assign.html`, `approve-article.html`.

## Shared layout and partials

`views/layout.html` provides the outer shell, sidebar/navigation, header, `#pageBody`, common dialogs, and global script imports. Reuse the shared fragments instead of duplicating them:

- `views/partials/css.html` — CSS imports.
- `views/partials/resource.html` — browser-visible localized messages.
- `views/partials/navigation.html` — navigation.
- `views/partials/header.html` — page header.
- `views/partials/common.html` — toast/loading/confirmation elements.
- `views/partials/search.html`, `advance-search.html`, `pagination.html` — search and pagination UI.

## Page template pattern

Use the existing semantic HTML and CSS classes (`row`, `col`, `form`, `search-group`, `table-responsive`, etc.). List templates commonly:

1. Render a page heading and a `new` link when the user can write.
2. Render a search `<form>` and hidden page field.
3. Include shared search/pagination partials.
4. Render a table using controller-provided `list` and `sort` data.
5. Use links with `onclick="navigate(event)"` so navigation can be fetched as a partial.

For detail forms, follow the existing form pages (`user.html`, `category.html`, `job.html`, or `article-form.html`) and preserve established `id`/`name` attributes where shared JavaScript depends on them.

## Rendering and escaping

Important: Nunjucks is configured with `autoescape: false` in `server.ts`. The controller must pass escaped values for untrusted text:

- Use `escape(value)` for a single object/value.
- Use `escapeArray(list, ...)` for table/list data.
- Use `render(req, res, pageName, viewModel)` from `service/template.ts` for feature pages.

Review every interpolation of user-supplied content, especially article body, contact message, job description, names, URLs, and tags. Do not assume `{{value}}` is safe merely because it is in a template. If a field intentionally contains trusted HTML, make that exception explicit and verify its sanitization/source.

`render()` injects common values such as `menu`, date/number/phone formatters, `isChecked`, `isNotEmpty`, `generateTags`, and `generateChips` when a view model object is supplied. Follow existing code instead of duplicating these helpers in a controller.

## Browser navigation and partial rendering

`public/static/layout.js` defines `navigate(event, ...)`. It:

- Prevents the normal anchor navigation.
- Requests the URL with `partial=true` (and optional `sub=true`).
- Replaces `#pageBody` (or a supplied target) with the returned HTML.
- Updates browser history.
- Handles scripts marked `data-init-script="true"` so page-specific initializers can run.
- Calls `afterLoaded()` to register events on forms inserted into the page.

Use ordinary anchor links and the existing `onclick="navigate(event)"` pattern when implementing a page-to-page navigation consistent with current pages. Do not add a second client router.

`public/static/index.js` and the loaded form/search/UI scripts provide shared browser helpers. The current global layout explicitly includes `ui.js`, `index.js`, `validator.js`, `form.js`, `form-utilities.js`, `search.js`, `chip.js`, `layout.js`, and `business.js`. `views/signin.html` separately includes `script.js`. Not every file under `public/static/` is loaded globally; inspect references before assuming a script is active.

## Forms and JSON requests

The common form conventions are:

- Forms use the existing CSS classes and HTML control names.
- Buttons commonly call `submitForm(event)` or another shared handler.
- `form.js` provides decoding, request headers, submission, and JSON error handling.
- Controllers use `validate<T>(body, model, resource)` and `respondError()` for server-side validation.
- Route definitions explicitly add `json()` for JSON request bodies.
- Assignment actions commonly send an array of IDs and return `204 No Content`.

Client-side validation improves interaction but does not replace server-side validation.

For an interaction that needs custom JavaScript, add or extend a focused file under `public/static/`, use the project's global-function style, and load it through the correct template/layout. Avoid introducing a bundler or frontend framework just for one page.

## Page-specific scripts

A page can include an initializer script marked `data-init-script="true"`; `navigate()` detects and re-executes these after partial page updates. See `views/pages/job.html` and `views/pages/user-assign.html` for examples. Ensure initializers tolerate being executed after navigation and do not create duplicate event handlers.

## CSS and visual consistency

- Add feature-specific CSS in `public/css/` only when existing styles cannot express the UI.
- Include a new stylesheet in `views/partials/css.html`.
- Reuse current typography, grid, button, form, table, card, and theme classes.
- Avoid page-specific inline style when a reusable class is appropriate.

## Localization

Server resources are assembled in `service/resources/index.ts` from shared dictionaries and feature dictionaries. Add corresponding keys to both `en.ts` and `vi.ts`. Keep keys consistent and avoid hard-coding user-facing labels in templates or controllers.

When browser JavaScript needs a localized message, expose the value through `views/partials/resource.html` and use the global `resource` object. Adding a key only to a TypeScript resource dictionary does not automatically make it available to browser JavaScript.
