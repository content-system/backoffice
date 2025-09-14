import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  cloneFilter,
  escape,
  escapeArray,
  fromRequest,
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  queryLimit,
  queryPage,
  resources,
  respondError,
  save
} from "express-ext"
import { Log } from "onecore"
import { write } from "security-express"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { UserService } from "../shared/user"
import { render, renderError404, renderError500 } from "../template"
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
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: RoleFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<RoleFilter>(req, ["status"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    const offset = getOffset(limit, page)
    this.service.search(cloneFilter(filter, limit, page), limit, page).then((result) => {
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
        sort: buildSortSearch(search, fields, filter.sort),
        message: buildMessage(resource, list, limit, page, result.total),
      })
    }).catch((err) => renderError500(req, res, resource, err))
  }
  view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    const editMode = id !== "new"
    if (!editMode) {
      const role = createRole()
      render(req, res, "role", {
        resource,
        role: escape(role),
        editMode,
      })
    } else {
      this.service.load(id).then((role) => {
        if (!role) {
          renderError404(req, res, resource)
        } else {
          const permissions = res.locals.permissions as number
          const readonly = write != (write & permissions)
          render(req, res, "role", {
            resource,
            readonly,
            editMode,
            role: escape(role),
          })
        }
      }).catch((err) => renderError500(req, res, resource, err))
    }
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const role = req.body as Role
    const errors = validate<Role>(role, roleModel, resource)
    if (errors.length > 0) {
      respondError(res, errors)
    } else {
      save(req.params.id !== "new", res, role, this.service, this.log)
    }
  }
  renderAssign(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    this.service.load(id).then((role) => {
      if (!role) {
        renderError404(req, res, resource)
      } else {
        const permissions = res.locals.permissions as number
        const readonly = write != (write & permissions)
        this.userService.getUsersOfRole(id).then(users => {
          render(req, res, "role-assign", {
            resource,
            readonly,
            role: escape(role),
            users: escapeArray(users)
          })
        })
      }
    }).catch((err) => renderError500(req, res, resource, err))
  }
  assign(req: Request, res: Response) {
    const id = req.params.id
    const roles = req.body as string[]
    if (!id || id.length === 0) {
      return res.status(400).end("id is required")
    }
    this.service.assign(id, roles).then(result => {
      res.status(204).end()
    }).catch((err) => handleError(err, res, this.log))
  }
}
