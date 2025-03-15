import { GenericUseCase, Log, SearchResult } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { RoleController } from "./controller"
import { SqlRoleRepository } from "./repository"
import { Role, RoleFilter, roleModel, RoleRepository, RoleService } from "./role"

export * from "./controller"
export * from "./role"

export class RoleUseCase extends GenericUseCase<Role, string> implements RoleService {
  constructor(private repo: RoleRepository) {
    super(repo)
  }
  search(filter: RoleFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<Role>> {
    return this.repo.search(filter, limit, page, fields)
  }
  assign(id: string, users: string[]): Promise<number> {
    return this.repo.assign(id, users)
  }
}

export function useRoleController(log: Log, db: DB, mapper?: TemplateMap): RoleController {
  const query = useQuery("role", mapper, roleModel, true)
  const builder = new SearchBuilder<Role, RoleFilter>(db.query, "roles", roleModel, db.driver, query)
  const repo = new SqlRoleRepository(builder.search, db)
  const service = new RoleUseCase(repo)
  return new RoleController(service, log)
}
