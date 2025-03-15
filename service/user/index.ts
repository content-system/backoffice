import { Log, Search, UseCase } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { User, UserFilter, userModel, UserRepository, UserService } from "./user"

export * from "./controller"
export * from "./user"

export class UserUseCase extends UseCase<User, string, UserFilter> implements UserService {
  constructor(search: Search<User, UserFilter>, private repo: UserRepository) {
    super(search, repo)
  }
  getUsersOfRole(roleId: string): Promise<User[]> {
    return this.repo.getUsersOfRole(roleId)
  }
}

export function useUserService(db: DB, mapper?: TemplateMap): UserService {
  const query = useQuery("user", mapper, userModel, true)
  const builder = new SearchBuilder<User, UserFilter>(db.query, "users", userModel, db.driver, query)
  const repo = new SqlUserRepository(builder.search, db)
  const service = new UserUseCase(builder.search, repo)
  return service
}
export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  return new UserController(useUserService(db, mapper), log)
}
