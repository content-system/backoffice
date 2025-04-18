import { Request, Response } from "express"
import {
  buildError404,
  buildError500,
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  cloneFilter,
  escape,
  escapeArray,
  fromRequest,
  getSearch,
  getStatusCode,
  getView,
  handleError,
  hasSearch,
  queryLimit,
  queryPage,
  resources,
  toString,
} from "express-ext"
import { Log } from "onecore"
import { write } from "security-express"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { Role, RoleFilter, roleModel, RoleService } from "./role"

const fields = ["roleId", "roleName", "remark", "status"]

function createRole(): Role {
  const role = {} as Role
  role.status = "A"
  return role
}
export class RoleController {
  constructor(private service: RoleService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
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
    this.service
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        const search = getSearch(req.url)
        res.render(getView(req, "roles"), {
          resource,
          limits: resources.limits,
          filter,
          list,
          pages: buildPages(limit, result.total),
          pageSearch: buildPageSearch(search),
          sort: buildSortSearch(search, fields, filter.sort),
          message: buildMessage(resource, list, limit, page, result.total),
        })
      })
      .catch((err) => {
        this.log(toString(err))
        res.render(getView(req, "error"), buildError500(resource, res))
      })
  }
  view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params["id"]
    const editMode = id !== "new"
    if (!editMode) {
      const role = createRole()
      res.render(getView(req, "role"), {
        resource,
        role: escape(role),
        editMode,
      })
    } else {
      this.service
        .load(id)
        .then((role) => {
          if (!role) {
            res.render(getView(req, "error"), buildError404(resource, res))
          } else {
            const permissions = res.locals.permissions as number
            const readonly = write != (write | permissions)
            res.render(getView(req, "role"), {
              resource,
              role: escape(role),
              editMode,
              readonly,
            })
          }
        })
        .catch((err) => {
          this.log(toString(err))
          res.render(getView(req, "error"), buildError500(resource, res))
        })
    }
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const role = req.body
    const errors = validate<Role>(role, roleModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(role).end()
    } else {
      const id = req.params["id"]
      const editMode = id !== "new"
      if (!editMode) {
        this.service
          .create(role)
          .then((result) => {
            if (result === 0) {
              res.status(410).end()
            } else {
              res.status(200).json(role).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      } else {
        this.service
          .update(role)
          .then((result) => {
            res.status(200).json(role).end()
          })
          .catch((err) => handleError(err, res, this.log))
      }
    }
  }
}
