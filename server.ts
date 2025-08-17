import { merge } from "config-plus"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import { loadTemplates, MiddlewareLogger } from "express-ext"
import http from "http"
import { createLogger } from "logger-core"
import nunjucks from "nunjucks"
import { Pool } from "pg"
import { PoolManager } from "pg-extension"
import { log } from "query-core"
import { buildTemplates, trim } from "query-mappers"
import { config, env } from "./config"
import { route, useContext } from "./service"
import { resources } from "./service/template"

dotenv.config()
const cfg = merge(config, process.env, env, process.env.ENV)

// buildJavascript()
// buildCSS()

const app = express()
// Define public folder :
app.use(express.static(__dirname + "/public"))
// Setup views folder :
app.set("views", __dirname + "/views")
// Setup view engine :
// Setting Nunjucks as default view
const nunjucksEnv = nunjucks.configure("views", {
  autoescape: false,
  express: app,
  noCache: false,
})
resources.nunjucks = nunjucksEnv

app.set("view engine", "html")
// app.locals.datetimeToString = datetimeToString

const logger = createLogger(cfg.log)
resources.log = logger.error

const middleware = new MiddlewareLogger(logger.info, cfg.middleware)
app.use(cookieParser())
// app.use(allow(cfg.allow), json(), cookieParser(), middleware.log)

const templates = loadTemplates(cfg.template, buildTemplates, trim, ["./config/query.xml"])
const pool = new Pool(cfg.db)
const db = log(new PoolManager(pool), cfg.log.db, logger, "sql")
const ctx = useContext(db, logger, middleware, cfg, templates)

route(app, ctx, cfg.secure)
// start(app, cfg)
http.createServer(app).listen(cfg.port, () => {
  console.log("Start server at port " + cfg.port)
})
