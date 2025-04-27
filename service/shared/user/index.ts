import { Attribute, Attributes, Search, StringMap } from "onecore"
import { buildMap, DB, metadata, SearchBuilder, SearchResult } from "query-core"
import { TemplateMap, useQuery } from "query-mappers"
import { User, UserFilter, userModel, UserService } from "./user"

export * from "./user"

export class SqlUserService implements UserService {
  constructor(private find: Search<User, UserFilter>, private db: DB) {
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
      from userRoles ur
        inner join users u on u.userId = ur.userId
      where ur.roleId = ${this.db.param(1)}
      order by userId`
    return this.db.query(q, [roleId], this.map)
  }
  search(s: UserFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<User>> {
    return this.find(s, limit, page, fields)
  }
}

export function useUserService(db: DB, mapper?: TemplateMap): UserService {
  const query = useQuery("user", mapper, userModel, true)
  const builder = new SearchBuilder<User, UserFilter>(db.query, "users", userModel, db.driver, query)
  return new SqlUserService(builder.search, db)
}
