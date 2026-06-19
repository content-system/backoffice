import { UseCase } from "onecore"
import { Role, RoleFilter, RoleRepository, RoleService } from "./role"

export class RoleUseCase extends UseCase<Role, string, RoleFilter> implements RoleService {
  constructor(protected repository: RoleRepository) {
    super(repository)
  }
  assign(id: string, users: string[]): Promise<number> {
    return this.repository.assign(id, users)
  }
}
