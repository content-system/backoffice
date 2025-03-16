import { Authenticator, initializeStatus, PrivilegeRepository, SqlAuthTemplateConfig, useUserRepository } from "authen-service"
import { compare } from "bcrypt"
import { HealthController, LogController, Logger, Middleware, MiddlewareController, resources } from "express-ext"
import { buildJwtError, generateToken, Payload, verify } from "jsonwebtoken-plus"
import { StringMap } from "onecore"
import { createChecker, DB } from "query-core"
import { TemplateMap } from "query-mappers"
import { Authorize, Authorizer, PrivilegeLoader, useToken } from "security-express"
import { check } from "types-validation"
import { createValidator } from "xvalidators"
import { ArticleController, useArticleController } from "./article"
import { AuditLogController, useAuditLogController } from "./audit-log"
import { LoginController } from "./authentication"
import { JobController, useJobController } from "./job"
import { MenuBuilder } from "./navigation"
import { getResourceByLang } from "./resources"
import { RoleController, useRoleController } from "./role"
import { UserController, useUserController } from "./user"

resources.createValidator = createValidator
resources.check = check

export interface Config {
  cookie?: boolean
  auth: SqlAuthTemplateConfig
  sql: {
    allPrivileges: string
    privileges: string
    permission: string
  }
  map: StringMap
}
export interface Context {
  health: HealthController
  log: LogController
  middleware: MiddlewareController
  authorize: Authorize
  menu: MenuBuilder
  login: LoginController
  role: RoleController
  user: UserController
  auditLog: AuditLogController
  article: ArticleController
  job: JobController
}
export function useContext(db: DB, logger: Logger, midLogger: Middleware, cfg: Config, mapper?: TemplateMap): Context {
  const auth = cfg.auth
  const log = new LogController(logger)
  const middleware = new MiddlewareController(midLogger)
  const sqlChecker = createChecker(db)
  const health = new HealthController([sqlChecker])
  const privilegeLoader = new PrivilegeLoader(cfg.sql.permission, db.query)
  const token = useToken<Payload>(auth.token.secret, verify, buildJwtError, cfg.cookie)
  const authorizer = new Authorizer<Payload>(token, privilegeLoader.privilege, buildJwtError, true)

  const privilegeRepository = new PrivilegeRepository(db.query, cfg.sql.privileges)
  const menu = new MenuBuilder(getResourceByLang, privilegeRepository.privileges, ["en", "vi"], "en")

  const status = initializeStatus(cfg.auth.status)
  const userRepository = useUserRepository<string, SqlAuthTemplateConfig>(db, cfg.auth, cfg.map)
  const authenticator = new Authenticator(
    status,
    compare,
    generateToken,
    auth.token,
    auth.payload,
    auth.account,
    userRepository,
    undefined,
    auth.lockedMinutes,
    2,
  )
  const login = new LoginController(authenticator)

  const role = useRoleController(logger.error, db, mapper)
  const user = useUserController(logger.error, db, mapper)
  const auditLog = useAuditLogController(db, logger.error)
  // const auditLog = useAuditLogController(logger.error, db);

  const article = useArticleController(db, logger.error)
  const job = useJobController(db, logger.error)

  return { health, log, middleware, authorize: authorizer.authorize, menu, login, role, user, auditLog, article, job }
}
