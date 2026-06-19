import { DB } from "onecore"
import { TemplateMap, useQuery } from "query-mappers"
import { SqlRoleQuery } from "../shared/role"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { UserUseCase } from "./service"
import { userModel } from "./user"
export * from "./controller"

export function useUserController(db: DB, mapper?: TemplateMap): UserController {
  const query = useQuery("user", mapper, userModel, true)
  const repository = new SqlUserRepository(db, query)
  const service = new UserUseCase(repository)
  const roleQuery = new SqlRoleQuery(db)
  return new UserController(service, roleQuery)
}
