import { Attribute, Attributes, StringMap } from "onecore"
import { buildMap, DB, metadata, SearchBuilder } from "query-core"
import { Query, TemplateMap, useQuery } from "query-mappers"
import { User, UserFilter, userModel, UserService } from "./user"

export * from "./user"

export class SqlUserService extends SearchBuilder<User, UserFilter> implements UserService {
  constructor(protected db: DB, query?: Query) {
    super(db.query, "users", userModel, db.driver, query)
    this.attributes = userModel
    const meta = metadata(userModel)
    this.primaryKeys = meta.keys
    this.getUsersOfRole = this.getUsersOfRole.bind(this)
    this.search = this.search.bind(this)
    this.map = buildMap(userModel)
  }
  map?: StringMap
  primaryKeys: Attribute[]
  attributes: Attributes

  getUsersOfRole(roleId: string): Promise<User[]> {
    if (!roleId || roleId.length === 0) {
      return Promise.resolve([])
    }
    const q = `
      select u.*
      from user_roles ur
        inner join users u on u.user_id = ur.user_id
      where ur.role_id = ${this.param(1)}
      order by user_id`
    return this.query(q, [roleId], this.map)
  }
}

export function useUserService(db: DB, mapper?: TemplateMap): UserService {
  const query = useQuery("user", mapper, userModel, true)
  return new SqlUserService(db, query)
}
