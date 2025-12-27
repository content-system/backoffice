import { Attributes, Filter, SearchResult } from "onecore"

export interface User {
  userId: string
  username: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  roles?: string[]
}
export interface UserFilter extends Filter {
  id?: string
  username?: string
  email?: string
  phone?: string
  status?: string
  gender?: string
  title?: string
  position?: string
}

export interface UserRepository {
  search(filter: UserFilter, limit: number, page?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<User>>
  getUsersOfRole(roleId: string): Promise<User[]>
}
export interface UserService {
  search(filter: UserFilter, limit: number, page?: number | string, fields?: string[], ctx?: any): Promise<SearchResult<User>>
  getUsersOfRole(roleId: string): Promise<User[]>
}

export const userModel: Attributes = {
  userId: {
    column: "user_id",
    key: true,
    length: 40,
    operator: "="
  },
  username: {
    required: true,
    length: 255,
    q: true,
  },
  email: {
    format: "email",
    required: true,
    length: 120,
    q: true,
  },
  displayName: {
    column: "display_name",
    length: 120,
    q: true,
  },
  status: {
    length: 1,
    operator: "="
  },
  gender: {
    length: 1,
  },
  phone: {
    format: "phone",
    required: true,
    length: 14,
  },
  title: {
    length: 10,
  },
  position: {
    length: 10,
  },
  imageURL: {
    column: "image_url",
    length: 255,
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
  roles: {
    type: "strings",
    ignored: true,
  },
}
