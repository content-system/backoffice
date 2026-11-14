import { merge } from "config-plus"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import { TokenVerifier } from "express-jsonwebtoken"
import { resources as expressResources, MiddlewareLogger } from "express-web-kit"
import http from "http"
import { createLogger } from "logger-core"
import nunjucks from "nunjucks"
import { Pool } from "pg"
import { PoolManager } from "postgres-kit"
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
expressResources.log = logger.error
resources.log = logger.error

const middleware = new MiddlewareLogger(logger.info, cfg.middleware)
const verifier = new TokenVerifier(
  "account",
  "userId",
  "id",
  "accessToken",
  cfg.token.secret,
  cfg.token.expires,
  "lax",
  "rememberToken",
  cfg.rememberToken.secret,
)
app.use(cookieParser(), verifier.verify)
// app.use(allow(cfg.allow), json(), cookieParser(), middleware.log)

const pool = new Pool(cfg.db)
const db = new PoolManager(pool)
const ctx = useContext(db, logger, middleware, cfg)

route(app, ctx)
// start(app, cfg)
http.createServer(app).listen(cfg.port, () => {
  console.log("Start server at port " + cfg.port)
})
