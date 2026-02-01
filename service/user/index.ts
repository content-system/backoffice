import { nanoid } from "nanoid"
import { Log, UseCase } from "onecore"
import { DB } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { SqlRoleQuery } from "../shared/role"
import { UserController } from "./controller"
import { SqlUserRepository } from "./repository"
import { User, UserFilter, userModel, UserRepository, UserService } from "./user"
export * from "./controller"

export class UserUseCase extends UseCase<User, string, UserFilter> implements UserService {
  constructor(protected repository: UserRepository) {
    super(repository)
    this.create = this.create.bind(this);
  }
  create(user: User): Promise<number> {
    user.userId = nanoid(10)
    return this.repository.create(user)
  }
  assign(id: string, roles: string[]): Promise<number> {
    return this.repository.assign(id, roles)
  }
}

export function useUserController(log: Log, db: DB, mapper?: TemplateMap): UserController {
  const query = useQuery("user", mapper, userModel, true)
  const repo = new SqlUserRepository(db, query)
  const service = new UserUseCase(repo)
  const roleQuery = new SqlRoleQuery(db);
  return new UserController(service, roleQuery, log)
}
