import { DB } from "onecore"
import { SqlRoleQuery } from "../shared/role"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { UserUseCase } from "./service"
export * from "./controller"

export function useUserController(db: DB): UserController {
  const repository = new SqlUserRepository(db)
  const service = new UserUseCase(repository)
  const roleQuery = new SqlRoleQuery(db)
  return new UserController(service, roleQuery)
}
