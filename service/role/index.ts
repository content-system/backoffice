import { Log } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { RoleController } from "./controller"
import { SqlRoleService } from "./repository"
import { Role, RoleFilter, roleModel, RoleService } from "./role"

export * from "./controller"
export * from "./role"

export function useRoleService(db: DB, mapper?: TemplateMap): RoleService {
  const query = useQuery("role", mapper, roleModel, true)
  const builder = new SearchBuilder<Role, RoleFilter>(db.query, "roles", roleModel, db.driver, query)
  return new SqlRoleService(builder.search, db)
}
export function useRoleController(log: Log, db: DB, mapper?: TemplateMap): RoleController {
  return new RoleController(useRoleService(db, mapper), log)
}
