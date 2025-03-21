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
  getSearch,
  getStatusCode,
  getView,
  handleError,
  hasSearch,
  queryNumber,
  resources,
  toString,
} from "express-ext"
import { Log } from "onecore"
import { getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getResource } from "../resources"
import { Role, RoleFilter, roleModel, RoleService } from "./role"

const fields = ["roleId", "roleName", "remark", "status"]

function createRole(): Role {
  const role = {} as Role
  role.status = "A"
  return role
}
export class RoleController {
  constructor(private service: RoleService, private log: Log) {
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
    this.search = this.search.bind(this)
  }
  view(req: Request, res: Response) {
    const resource = getResource(req)
    const id = req.params["id"]
    const editMode = id !== "new"
    if (!editMode) {
      const role = createRole()
      res.render(getView(req, "role"), { resource, role: escape(role), editMode })
    } else {
      this.service
        .load(id)
        .then((role) => {
          if (!role) {
            res.render(getView(req, "error-404"), { resource })
          } else {
            res.render(getView(req, "role"), { resource, role: escape(role), editMode })
          }
        })
        .catch((err) => {
          this.log(toString(err))
          res.render(getView(req, "error-500"), { resource })
        })
    }
  }
  submit(req: Request, res: Response) {
    const resource = getResource(req)
    const role = req.body
    console.log("role " + JSON.stringify(role))
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
            res.status(200).json(role).end()
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
  search(req: Request, res: Response) {
    const dateFormat = getDateFormat()
    const resource = getResource(req)
    let filter: RoleFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<RoleFilter>(req, ["status"])
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
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
        res.render(getView(req, "error-500"), { resource })
      })
  }
}
