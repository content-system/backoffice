import { Application, json, urlencoded } from "express"
import { read, write } from "security-express"
import { Context } from "./context"

export * from "./context"

export const approve = 8
// const parser = multer()

export function route(app: Application, ctx: Context): void {
  app.get("/health", ctx.health.check)
  app.patch("/log", ctx.log.config)
  app.patch("/middleware", ctx.middleware.config)

  app.get("", ctx.login.render)
  app.get("/login", ctx.login.render)
  app.post("", urlencoded(), ctx.login.submit)
  app.post("/login", urlencoded(), ctx.login.submit)

  const readRole = ctx.authorize("role", read)
  const writeRole = ctx.authorize("role", write)
  app.get("/roles", readRole, ctx.menu.build, ctx.role.search)
  app.get("/roles/:id", readRole, ctx.menu.build, ctx.role.view)
  app.post("/roles/:id", writeRole, json(), ctx.role.submit)
  app.get("/roles/:id/assign", readRole, ctx.menu.build, ctx.role.renderAssign)
  app.patch("/roles/:id/assign", writeRole, ctx.menu.build, json(), ctx.role.assign)

  const readUser = ctx.authorize("user", read)
  const writeUser = ctx.authorize("user", write)
  app.get("/users", readUser, ctx.menu.build, ctx.user.search)
  app.get("/users/:id", readUser, ctx.menu.build, ctx.user.view)
  app.post("/users/:id", writeUser, json(), ctx.user.submit)
  app.get("/users/:id/assign", readUser, ctx.menu.build, ctx.user.renderAssign)
  app.patch("/users/:id/assign", writeUser, ctx.menu.build, json(), ctx.user.assign)

  const readAuditLog = ctx.authorize("audit_log", read)
  app.get("/audit-logs", readAuditLog, ctx.menu.build, ctx.auditLog.render)

  const readCategory = ctx.authorize("category", read)
  const writeCategory = ctx.authorize("category", write)
  app.get("/categories", readCategory, ctx.menu.build, ctx.category.search)
  app.get("/categories/:id", readCategory, ctx.menu.build, ctx.category.view)
  app.post("/categories/:id", writeCategory, ctx.menu.build, json(), ctx.category.submit)

  const readContent = ctx.authorize("content", read)
  const writeContent = ctx.authorize("content", write)
  app.get("/contents", readContent, ctx.menu.build, ctx.content.search)
  app.get("/contents/:id/:lang", readContent, ctx.menu.build, ctx.content.view)
  app.post("/contents/:id/:lang", writeContent, ctx.menu.build, json(), ctx.content.submit)

  const readArticle = ctx.authorize("article", read)
  const writeArticle = ctx.authorize("article", write)
  const approveArticle = ctx.authorize("article", approve)
  app.get("/articles", readArticle, ctx.menu.build, ctx.article.search)
  app.get("/articles/:id", readArticle, ctx.menu.build, ctx.article.view)
  app.post("/articles/:id", writeArticle, ctx.menu.build, json(), ctx.article.submit)
  app.get("/articles/:id/approve", readArticle, ctx.menu.build, ctx.article.renderApprove)
  app.patch("/articles/:id/approve", approveArticle, ctx.menu.build, ctx.article.approve)
  app.patch("/articles/:id/reject", approveArticle, ctx.menu.build, ctx.article.reject)

  const readJob = ctx.authorize("job", read)
  const writeJob = ctx.authorize("job", write)
  app.get("/jobs", readJob, ctx.menu.build, ctx.job.search)
  app.get("/jobs/:id", readJob, ctx.menu.build, ctx.job.view)
  app.post("/jobs/:id", writeJob, ctx.menu.build, json(), ctx.job.submit)

  const readContact = ctx.authorize("contact", read)
  const writeContact = ctx.authorize("contact", write)
  app.get("/contacts", readContact, ctx.menu.build, ctx.contact.search)
  app.get("/contacts/:id", readContact, ctx.menu.build, ctx.contact.view)
  app.post("/contacts/:id", writeContact, ctx.menu.build, json(), ctx.contact.submit)
}
