# Development workflow

## Prerequisites

- Node.js compatible with the installed dependency versions.
- npm and access to the npm registry for installing dependencies.
- PostgreSQL configured for the application.
- Environment-specific configuration for database and authentication secrets.

The archive includes a package lock file. Prefer `npm ci` for a reproducible dependency install when the lock file is authoritative.

## Available scripts

| Command | Behavior from `package.json` |
|---|---|
| `npm start` | Starts the development server using `nodemon --exec ts-node-dev server.ts`. |
| `npm run build` | Runs Webpack with `webpack.config.js`; output is configured as `server.js` in the repository root. |
| `npm run prod` | Runs `node server.js`. Run after a successful production build. |
| `npm test` | **Not implemented.** The current script prints an error and exits with status 1. |

The legacy `README.md` previously described `dist` as the build output; the inspected `webpack.config.js` actually writes `server.js` to the repository root. Verify this if the build configuration changes.

## TypeScript and formatting

`tsconfig.json` uses strict type checking, `module: "nodenext"`, `moduleResolution: "nodenext"`, `target: "es6"`, `esModuleInterop`, and `skipLibCheck`. It includes `service/**/*.ts`, `server.ts`, `config.ts`, and future `client/**/*.ts` / `build/**/*.ts` paths.

`.prettierrc.json` specifies:

```json
{
  "printWidth": 160,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": false
}
```

There is no lint script or dedicated type-check script in `package.json`. When dependencies are installed, a useful standalone type-check command is `npx tsc --noEmit`; this command has not been run as part of this documentation analysis.

## Suggested verification sequence

1. Install dependencies with `npm ci`.
2. Run `npx tsc --noEmit` to check TypeScript.
3. Run `npm run build` to check the Webpack production bundle.
4. Start the app with `npm start` against a development database.
5. Exercise the new routes through both full-page and partial-page navigation.
6. Verify authorization with users that have read-only and write/approval permissions.
7. Verify English and Vietnamese labels, validation messages, and browser error messages.
8. Inspect database writes, transaction behavior, and audit/history/notification effects as applicable.

Do not state that tests pass when no tests exist or when a check was not executed. Record environmental blockers such as missing dependencies, database access, or required environment variables.

## Configuration and secrets

- `config.ts` defines defaults and environment profiles (`sit`, `prd`).
- `server.ts` calls `dotenv.config()` and merges configuration using `config-plus`.
- The uploaded archive contained a `.env` file with a `PASSWORD` entry. The generated AI-ready project ZIP intentionally omits `.env` so it does not redistribute that credential; restore your local file or create a new `.env` from your deployment secret manager.
- The current `config.ts` includes fallback database/token values. Treat them as unsafe development defaults; production configuration must provide strong secret values outside source control.
- Do not log credentials, JWTs, passcodes, password hashes, or sensitive request bodies.

## Build artifact hygiene

Webpack writes the bundled server to the repository root as `server.js`, and `.gitignore` excludes `server.js`. Do not edit the generated bundle by hand. Modify the TypeScript source and rebuild.

The `server.js.LICENSE.txt` file is also generated and ignored. Source changes belong in `.ts` files, Nunjucks templates, `public/static/`, or `public/css/` as appropriate.

## Known repository gaps

- No test framework or meaningful `npm test` command was found.
- No lint command was found.
- No database migration/seed directory was found.
- No Next.js or React setup was found.

Agents should explicitly flag these constraints instead of fabricating a test result or using framework-specific commands that are not configured.
