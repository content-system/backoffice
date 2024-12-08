import { Attributes, Filter, Service } from "onecore"

export interface RoleFilter extends Filter {
  roleId?: string
  roleName?: string
  status?: string
  remark?: string
}
export interface Role {
  roleId: string
  roleName: string
  status?: string
  remark?: string
  privileges?: string[]
}
export interface RoleService extends Service<Role, string, RoleFilter> {
  all(): Promise<Role[]>
  assign(id: string, users: string[]): Promise<number>
}

export const roleModel: Attributes = {
  roleId: {
    column: "role_id",
    key: true,
    length: 40,
    q: true,
  },
  roleName: {
    column: "role_name",
    required: true,
    length: 255,
    q: true,
    match: "prefix",
  },
  status: {
    match: "equal",
    length: 1,
  },
  remark: {
    length: 255,
    q: true,
  },
  createdBy: {
    column: "created_by",
  },
  createdAt: {
    column: "created_at",
    type: "datetime",
  },
  updatedBy: {
    column: "updated_by",
  },
  updatedAt: {
    column: "updated_at",
    type: "datetime",
  },
  privileges: {
    type: "strings",
    ignored: true,
  },
}
