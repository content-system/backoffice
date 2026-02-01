import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  escape,
  escapeArray,
  fromRequest,
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  resources,
  respondError
} from "express-ext"
import { isSuccessful, Log } from "onecore"
import { write } from "security-express"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { RoleQuery } from "../shared/role"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { User, UserFilter, userModel, UserService } from "./user"

function createUser(): User {
  const role = {} as User
  role.status = "A"
  return role
}

const titles = [
  { value: "Mr", text: "Mr" },
  { value: "Mrs", text: "Mrs" },
  { value: "Ms", text: "Ms" },
  { value: "Dr", text: "Dr" },
]
const positions = [
  { value: "E", text: "Employee" },
  { value: "M", text: "Manager" },
  { value: "D", text: "Director" },
]
const fields = ["userId", "username", "email", "displayName", "status"]

export class UserController {
  constructor(private service: UserService, private roleQuery: RoleQuery, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
    this.renderAssign = this.renderAssign.bind(this)
    this.assign = this.assign.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: UserFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<UserFilter>(req, ["status"])
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "users", {
        resource,
        readonly,
        limits: resources.limits,
        filter,
        list,
        pages: buildPages(limit, result.total),
        pageSearch: buildPageSearch(search),
        sort: buildSortSearch(search, fields, sort),
        message: buildMessage(resource, list, limit, page, result.total),
      })
    } catch (err) {
      renderError500(req, res, resource, err)
    }
  }
  async view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    const editMode = id !== "new"
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    if (!editMode) {
      if (readonly) {
        return renderError403(req, res, resource)
      }
      const user = createUser()
      render(req, res, "user", {
        resource,
        editMode,
        user: escape(user),
      })
    } else {
      try {
        const user = await this.service.load(id)
        if (!user) {
          return renderError404(req, res, resource)
        }
        render(req, res, "user", {
          resource,
          readonly,
          editMode,
          titles,
          positions,
          user: escape(user),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const user = req.body as User
    const errors = validate<User>(user, userModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const userId = res.locals.userId
    user.updatedBy = userId
    user.updatedAt = new Date()
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        user.createdBy = userId
        user.createdAt = new Date()
        const result = await this.service.create(user)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(user)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res, this.log)
    }
  }
  async renderAssign(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    try {
      const user = await this.service.load(id)
      if (!user) {
        return renderError404(req, res, resource)
      }
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      const roles = await this.roleQuery.getRoles()
      if (user.roles && user.roles.length > 0) {
        for (const role of roles) {
          role.selected = user.roles.includes(role.value)
        }
      }
      render(req, res, "user-assign", {
        resource,
        user: escape(user),
        roles: escapeArray(roles),
        readonly,
      })
    } catch (err) {
      renderError500(req, res, resource, err)
    }
  }
  async assign(req: Request, res: Response) {
    const id = req.params.id
    const roles = req.body as string[]
    try {
      await this.service.assign(id, roles)
      res.status(204).end()
    } catch (err) {
      handleError(err, res, this.log)
    }
  }
}
