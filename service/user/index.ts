import { GenericUseCase, Log, SearchResult } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { SqlRoleQuery } from "../shared/role"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { User, UserFilter, userModel, UserRepository, UserService } from "./user"

export * from "./controller"
export * from "./user"

export class UserUseCase extends GenericUseCase<User, string> implements UserService {
  constructor(private repo: UserRepository) {
    super(repo)
  }
  search(filter: UserFilter, limit: number, page?: number | string, fields?: string[]): Promise<SearchResult<User>> {
    return this.repo.search(filter, limit, page, fields)
  }
  getUsersOfRole(roleId: string): Promise<User[]> {
    return this.repo.getUsersOfRole(roleId)
  }
}

export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  const query = useQuery("user", mapper, userModel, true)
  const builder = new SearchBuilder<User, UserFilter>(db.query, "users", userModel, db.driver, query)
  const repo = new SqlUserRepository(builder.search, db)
  const service = new UserUseCase(repo)
  const roleQuery = new SqlRoleQuery(db);
  return new UserController(service, roleQuery, log)
}
