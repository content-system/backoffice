import { Application, json, urlencoded } from "express"
import { read, write } from "security-express"
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
  app.get("/audit-logs", readAuditLog, ctx.menu.build, ctx.auditLog.render)

  const readArticle = ctx.authorize("article", read)
  const writeArticle = ctx.authorize("article", write)
  app.get("/articles", readArticle, ctx.menu.build, ctx.article.search)
  app.get("/articles/:id", readArticle, ctx.menu.build, ctx.article.view)
  app.post("/articles/:id", writeArticle, ctx.menu.build, json(), ctx.article.submit)

  const readJob = ctx.authorize("job", read)
  const writeJob = ctx.authorize("job", write)
  app.get("/jobs", readJob, ctx.menu.build, ctx.job.search)
  app.get("/jobs/:id", readJob, ctx.menu.build, ctx.job.view)
  app.post("/jobs/:id", writeJob, ctx.menu.build, json(), ctx.job.submit)
}
