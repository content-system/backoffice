import { Log } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { User, UserFilter, userModel, UserService } from "./user"

export * from "./controller"
export * from "./user"

export function useUserService(db: DB, mapper?: TemplateMap): UserService {
  const query = useQuery("user", mapper, userModel, true)
  const builder = new SearchBuilder<User, UserFilter>(db.query, "users", userModel, db.driver, query)
  return new SqlUserRepository(builder.search, db)
}
export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  return new UserController(useUserService(db, mapper), log)
}
