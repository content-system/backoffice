import { Application, json, urlencoded } from "express"
import { get, read, write } from "security-express"
import { Context } from "./context"

export * from "./context"

// const parser = multer()

export function route(app: Application, ctx: Context, secure?: boolean): void {
  app.get("/health", ctx.health.check)
  app.patch("/log", ctx.log.config)
  app.patch("/middleware", ctx.middleware.config)

  app.get("/login", ctx.login.render)
  app.post("/login", urlencoded(), ctx.login.submit)

  const readRole = ctx.authorize("role", read)
  const writeRole = ctx.authorize("role", write)
  app.get("/roles", ctx.role.search)
  app.get("/roles/:id", ctx.role.view)
  app.post("/roles/:id", json(), ctx.role.submit)
  /*
  put(app, "/roles/:id/assign", writeRole, ctx.role.assign, secure)
  get(app, "/roles", readRole, ctx.role.search, secure)
  post(app, "/roles/search", readRole, ctx.role.search, secure)
  get(app, "/roles/search", readRole, ctx.role.search, secure)
  get(app, "/roles/:id", readRole, ctx.role.load, secure)
  post(app, "/roles", writeRole, ctx.role.create, secure)
  put(app, "/roles/:id", writeRole, ctx.role.update, secure)
  patch(app, "/roles/:id", writeRole, ctx.role.patch, secure)
  del(app, "/roles/:id", writeRole, ctx.role.delete, secure)
*/
  const readUser = ctx.authorize("user", read)
  const writeUser = ctx.authorize("user", write)
  // get(app, "/users", readUser, ctx.user.all, secure)
  app.get("/users", ctx.user.search)
  app.get("/users/:id", ctx.user.view)
  app.post("/users/:id", json(), ctx.user.submit)
  /*
  post(app, "/users/search", readUser, ctx.user.search, secure)
  get(app, "/users/search", readUser, ctx.user.search, secure)
  get(app, "/users/:id", readUser, ctx.user.load, secure)
  post(app, "/users", writeUser, ctx.user.create, secure)
  put(app, "/users/:id", writeUser, ctx.user.update, secure)
  patch(app, "/users/:id", writeUser, ctx.user.patch, secure)
  del(app, "/users/:id", writeUser, ctx.user.delete, secure)
*/
  const readAuditLog = ctx.authorize("audit_log", read)
  get(app, "/audit-logs", readAuditLog, ctx.auditLog.render, secure)

  app.get("/articles", ctx.article.search)
  app.get("/articles/:id", ctx.article.view)
  app.post("/articles/:id", json(), ctx.article.submit)

  app.get("/jobs", ctx.job.search)
  app.get("/jobs/:id", ctx.job.view)
  app.post("/jobs/:id", json(), ctx.job.submit)
}
