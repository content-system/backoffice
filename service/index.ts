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
  app.get("/roles", readRole, ctx.menu.build, ctx.role.search)
  app.get("/roles/:id", readRole, ctx.menu.build, ctx.role.view)
  app.post("/roles/:id", writeRole, json(), ctx.role.submit)

  const readUser = ctx.authorize("user", read)
  const writeUser = ctx.authorize("user", write)
  app.get("/users", readUser, ctx.menu.build, ctx.user.search)
  app.get("/users/:id", readUser, ctx.menu.build, ctx.user.view)
  app.post("/users/:id", writeUser, json(), ctx.user.submit)

  const readAuditLog = ctx.authorize("audit_log", read)
  get(app, "/audit-logs", readAuditLog, ctx.auditLog.render, secure)

  app.get("/articles", ctx.article.search)
  app.get("/articles/:id", ctx.article.view)
  app.post("/articles/:id", json(), ctx.article.submit)

  app.get("/jobs", ctx.job.search)
  app.get("/jobs/:id", ctx.job.view)
  app.post("/jobs/:id", json(), ctx.job.submit)
}
