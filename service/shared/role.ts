import { DB } from "onecore"

export interface Role {
  value: string
  text: string
  selected?: boolean
}

export interface RoleQuery {
  getRoles(): Promise<Role[]>
}

export class SqlRoleQuery implements RoleQuery {
  constructor(private db: DB) {
    this.getRoles = this.getRoles.bind(this)
  }

  getRoles(): Promise<Role[]> {
    const q = `
      select role_id as value, role_name as text
      from roles
      order by role_name`
    return this.db.query(q)
  }
}
