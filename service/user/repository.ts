import { Attribute, Attributes, Search, StringMap } from "onecore"
import { buildMap, buildToInsert, buildToInsertBatch, buildToUpdate, DB, metadata, SearchResult, Statement } from "query-core"
import { User, UserFilter, userModel, UserRepository } from "./user"

const userRoleModel: Attributes = {
  userId: {
    column: "user_id",
    key: true,
  },
  roleId: {
    column: "role_id",
    key: true,
  },
}
interface UserRole {
  userId?: string
  roleId: string
}

export class SqlUserRepository implements UserRepository {
  map: StringMap
  roleMap: StringMap
  primaryKeys: Attribute[]
  attributes: Attributes
  constructor(private find: Search<User, UserFilter>, private db: DB) {
    this.attributes = userModel
    const meta = metadata(userModel)
    this.primaryKeys = meta.keys
    this.map = buildMap(userModel)
    this.roleMap = buildMap(userRoleModel)
    this.search = this.search.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.patch = this.patch.bind(this)
    this.delete = this.delete.bind(this)
    this.assign = this.assign.bind(this)
  }
  search(filter: UserFilter, limit: number, page?: number, fields?: string[]): Promise<SearchResult<User>> {
    return this.find(filter, limit, page, fields)
  }
  load(id: string): Promise<User | null> {
    return this.db.query<User>(`select * from users where user_id = ${this.db.param(1)}`, [id], this.map).then((users) => {
      if (!users || users.length === 0) {
        return null
      }
      const user = users[0]
      const query = `select role_id from user_roles where user_id = ${this.db.param(1)}`
      return this.db.query<UserRole>(query, [id], this.roleMap).then((roles) => {
        if (roles && roles.length > 0) {
          user.roles = roles.map((i) => i.roleId)
        }
        return user
      })
    })
  }
  create(user: User): Promise<number> {
    const stmts: Statement[] = []
    const stmt = buildToInsert(user, "users", userModel, this.db.param)
    if (!stmt) {
      return Promise.resolve(-1)
    }
    stmts.push(stmt)
    insertUserRoles(stmts, user.userId, user.roles, this.db.param)
    return this.db.execBatch(stmts, true)
  }
  update(user: User): Promise<number> {
    const stmts: Statement[] = []
    const stmt = buildToUpdate(user, "users", userModel, this.db.param)
    if (!stmt) {
      return Promise.resolve(-1)
    }
    stmts.push({ query: `delete from user_roles where user_id = ${this.db.param(1)}`, params: [user.userId] })
    insertUserRoles(stmts, user.userId, user.roles, this.db.param)
    return this.db.execBatch(stmts, true)
  }
  patch(user: User): Promise<number> {
    return this.update(user)
  }
  delete(id: string): Promise<number> {
    const stmts: Statement[] = []
    stmts.push({ query: `delete from user_roles where user_id = ${this.db.param(1)}`, params: [id] })
    stmts.push({ query: `delete from users where user_id = ${this.db.param(1)}`, params: [id] })
    return this.db.execBatch(stmts)
  }
  assign(id: string, roles: string[]): Promise<number> {
    const stmts: Statement[] = []
    const query = `delete from user_roles where user_id = ${this.db.param(1)}`
    stmts.push({ query, params: [id] })
    if (roles && roles.length > 0) {
      insertUserRoles(stmts, id, roles, this.db.param)
    }
    return this.db.execBatch(stmts)
  }
}

function insertUserRoles(stmts: Statement[], userId: string, roles: string[] | undefined, param: (i: number) => string): Statement[] {
  if (roles && roles.length > 0) {
    const userRoles = roles.map<UserRole>((i) => {
      const userRole: UserRole = { userId, roleId: i }
      return userRole
    })
    const stmt = buildToInsertBatch(userRoles, "user_roles", userRoleModel, param)
    if (stmt) {
      stmts.push(stmt)
    }
  }
  return stmts
}
