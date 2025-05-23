import { Attribute, Attributes, Search } from "onecore"
import { buildMap, buildToDelete, buildToInsert, buildToInsertBatch, buildToUpdate, DB, metadata, SearchResult, select, Statement, StringMap } from "query-core"
import { Role, RoleFilter, roleModel, RoleRepository } from "./role"

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
const roleModuleModel: Attributes = {
  roleId: {
    column: "role_id",
    key: true,
  },
  moduleId: {
    column: "module_id",
    key: true,
  },
  permissions: {
    type: "integer",
  },
}
interface UserRole {
  userId?: string
  roleId?: string
}
interface Module {
  moduleId?: string
  roleId?: string
  permissions?: number
}
export class SqlRoleRepository implements RoleRepository {
  private roleModuleMap: StringMap
  map?: StringMap
  primaryKeys: Attribute[]
  attributes: Attributes
  constructor(protected find: Search<Role, RoleFilter>, private db: DB) {
    this.attributes = roleModel
    const meta = metadata(roleModel)
    this.primaryKeys = meta.keys
    this.metadata = this.metadata.bind(this)
    this.search = this.search.bind(this)
    this.all = this.all.bind(this)
    this.load = this.load.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.patch = this.patch.bind(this)
    this.delete = this.delete.bind(this)
    this.map = buildMap(roleModel)
    this.roleModuleMap = buildMap(roleModuleModel)
  }
  metadata(): Attributes {
    return roleModel
  }
  search(filter: RoleFilter, limit: number, page?: number | string, fields?: string[]): Promise<SearchResult<Role>> {
    return this.find(filter, limit, page, fields)
  }
  all(): Promise<Role[]> {
    return this.db.query("select * from roles order by role_id asc", undefined, this.map)
  }
  load(id: string): Promise<Role | null> {
    const stmt = select(id, "roles", this.primaryKeys, this.db.param)
    if (!stmt) {
      return Promise.resolve(null)
    }
    return this.db.query<Role>(stmt.query, stmt.params, this.map).then((roles) => {
      if (!roles || roles.length === 0) {
        return null
      }
      const role = roles[0]
      const q = `select module_id, permissions from role_modules where role_id = ${this.db.param(1)}`
      return this.db.query<Module>(q, [role.roleId], this.roleModuleMap).then((modules) => {
        if (modules && modules.length > 0) {
          role.privileges = modules.map((i) => (i.permissions ? i.moduleId + " " + i.permissions.toString(16) : i.moduleId)) as any
        }
        return role
      })
    })
  }
  create(role: Role): Promise<number> {
    const stmts: Statement[] = []
    const stmt = buildToInsert(role, "roles", roleModel, this.db.param)
    let firstSuccess = false
    if (stmt) {
      firstSuccess = true
      stmts.push(stmt)
    }
    insertRoleModules(stmts, role.roleId, role.privileges, this.db.param)
    return this.db.execBatch(stmts, firstSuccess)
  }
  update(role: Role): Promise<number> {
    const stmts: Statement[] = []
    const stmt = buildToUpdate(role, "roles", roleModel, this.db.param)
    let firstSuccess = false
    if (stmt) {
      firstSuccess = true
      stmts.push(stmt)
    }
    if (role.privileges != undefined) {
      const query = `delete from role_modules where role_id = ${this.db.param(1)}`
      stmts.push({ query, params: [role.roleId] })
      insertRoleModules(stmts, role.roleId, role.privileges, this.db.param)
    }
    return this.db.execBatch(stmts)
  }
  patch(role: Role): Promise<number> {
    return this.update(role)
  }
  delete(id: string): Promise<number> {
    const stmts: Statement[] = []
    const stmt = buildToDelete(id, "roles", this.primaryKeys, this.db.param)
    if (stmt) {
      stmts.push(stmt)
    }
    const query = `delete from role_modules where role_id = ${this.db.param(1)}`
    stmts.push({ query, params: [id] })
    return this.db.execBatch(stmts)
  }
  assign(roleId: string, users: string[]): Promise<number> {
    const userRoles: UserRole[] = users.map<UserRole>((u) => {
      return { roleId, userId: u }
    })
    const stmts: Statement[] = []
    const q1 = `delete from user_roles where role_id = ${this.db.param(1)}`
    stmts.push({ query: q1, params: [roleId] })
    const s = buildToInsertBatch<UserRole>(userRoles, "user_roles", userRoleModel, this.db.param)
    if (s) {
      stmts.push(s)
    }
    return this.db.execBatch(stmts)
  }
}
function insertRoleModules(stmts: Statement[], roleId: string, privileges: string[] | undefined, param: (i: number) => string): Statement[] {
  if (privileges && privileges.length > 0) {
    let permissions = 0
    const modules = privileges.map<Module>((i) => {
      if (i.indexOf(" ") > 0) {
        const s = i.split(" ")
        permissions = parseInt(s[1], 16)
        if (isNaN(permissions)) {
          permissions = 0
        }
      }
      const ms: Module = { roleId, moduleId: i, permissions }
      return ms
    })
    const stmt = buildToInsertBatch(modules, "role_modules", roleModuleModel, param)
    if (stmt) {
      console.log("sql " + stmt.query)
      stmts.push(stmt)
    }
  }
  return stmts
}
