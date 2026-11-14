import { DB } from "onecore"
import { UserService } from "../shared/user"
import { RoleController } from "./controller"
import { SqlRoleRepository } from "./repository"
import { RoleUseCase } from "./service"
export * from "./controller"

export function useRoleController(db: DB, userService: UserService): RoleController {
  const repository = new SqlRoleRepository(db)
  const service = new RoleUseCase(repository)
  return new RoleController(service, userService)
}
