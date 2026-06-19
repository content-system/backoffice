import { DB } from "onecore"
import { TemplateMap, useQuery } from "query-mappers"
import { UserService } from "../shared/user"
import { RoleController } from "./controller"
import { SqlRoleRepository } from "./repository"
import { roleModel } from "./role"
import { RoleUseCase } from "./service"
export * from "./controller"

export function useRoleController(db: DB, userService: UserService, mapper?: TemplateMap): RoleController {
  const query = useQuery("role", mapper, roleModel, true)
  const repository = new SqlRoleRepository(db, query)
  const service = new RoleUseCase(repository)
  return new RoleController(service, userService)
}
