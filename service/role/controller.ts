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
import { UserService } from "../shared/user"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Role, RoleFilter, roleModel, RoleService } from "./role"

const fields = ["roleId", "roleName", "remark", "status"]

function createRole(): Role {
  const role = {} as Role
  role.status = "A"
  return role
}
export class RoleController {
  constructor(private service: RoleService, private userService: UserService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
    this.renderAssign = this.renderAssign.bind(this)
    this.assign = this.assign.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: RoleFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<RoleFilter>(req, ["status"])
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "roles", {
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
      const role = createRole()
      render(req, res, "role", {
        resource,
        editMode,
        role: escape(role),
      })
    } else {
      try {
        const role = await this.service.load(id)
        if (!role) {
          return renderError404(req, res, resource)
        }
        render(req, res, "role", {
          resource,
          readonly,
          editMode,
          role: escape(role),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const role = req.body as Role
    const errors = validate<Role>(role, roleModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const userId = res.locals.userId
    role.updatedBy = userId
    role.updatedAt = new Date()
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        role.createdBy = userId
        role.createdAt = new Date()
        const result = await this.service.create(role)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(role)
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
      const role = await this.service.load(id)
      if (!role) {
        return renderError404(req, res, resource)
      }
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      const users = await this.userService.getUsersOfRole(id)
      render(req, res, "role-assign", {
        resource,
        readonly,
        role: escape(role),
        users: escapeArray(users),
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
