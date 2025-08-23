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
  save,
} from "express-ext"
import { Log } from "onecore"
import { write } from "security-express"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { RoleQuery } from "../shared/role"
import { render, renderError404, renderError500 } from "../template"
import { User, UserFilter, userModel, UserService } from "./user"

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
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: UserFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<UserFilter>(req, ["status"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    const offset = getOffset(limit, page)
    this.service.search(cloneFilter(filter, limit, page), limit, page).then((result) => {
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      render(req, res, "users", {
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
    .catch((err) => renderError500(req, res, resource, err))
  }
  view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    this.service.load(id).then((user) => {
      if (!user) {
        renderError404(req, res, resource)
      } else {
        const permissions = res.locals.permissions as number
        const readonly = write != (write & permissions)
        render(req, res, "user", {
          resource,
          user: escape(user),
          titles,
          positions,
          readonly,
        })
      }
    })
    .catch((err) => renderError500(req, res, resource, err))
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const user = req.body as User
    const errors = validate<User>(user, userModel, resource)
    if (errors.length > 0) {
      respondError(res, errors)
    } else {
      save(req.params.id !== "new", res, user, this.service, this.log)
    }
  }
  renderAssign(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    this.service.load(id).then((user) => {
      if (!user) {
        renderError404(req, res, resource)
      } else {
        const permissions = res.locals.permissions as number
        const readonly = write != (write & permissions)
        this.roleQuery.getRoles().then((roles) => {
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
        })
        .catch((err) => renderError500(req, res, resource, err))
      }
    })
    .catch((err) => renderError500(req, res, resource, err))
  }
  assign(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
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
