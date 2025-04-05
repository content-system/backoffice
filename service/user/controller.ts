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
  queryLimit,
  queryPage,
  resources,
  toString,
} from "express-ext"
import { Log } from "onecore"
import { validate } from "xvalidators"
import { buildError404, buildError500, getLang, getResource } from "../resources"
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
  constructor(private service: UserService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
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
    this.service
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        const search = getSearch(req.url)
        res.render(getView(req, "users"), {
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
    this.service
      .load(id)
      .then((user) => {
        if (!user) {
          res.render(getView(req, "error"), buildError404(resource, res))
        } else {
          res.render(getView(req, "user"), {
            resource,
            user: escape(user),
            titles,
            positions,
          })
        }
      })
      .catch((err) => {
        this.log(toString(err))
        res.render(getView(req, "error-500"), { resource })
      })
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const user = req.body
    console.log("user " + JSON.stringify(user))
    const errors = validate<User>(user, userModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(errors).end()
    } else {
      this.service
        .update(user)
        .then((result) => {
          if (result === 0) {
            res.status(410).end()
          } else {
            res.status(200).json(user).end()
          }
        })
        .catch((err) => handleError(err, res, this.log))
    }
  }
}
