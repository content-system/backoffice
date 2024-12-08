import { Request, Response } from "express"
import {
  buildPages,
  buildPageSearch,
  buildSortFromRequest,
  buildSortSearch,
  cloneFilter,
  escapeArray,
  escapeHTML,
  fromRequest,
  getSearch,
  getStatusCode,
  getView,
  handleError,
  hasSearch,
  queryNumber,
  resources,
} from "express-ext"
import { Log } from "onecore"
import { validate } from "xvalidators"
import { getResource } from "../resources"
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
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
    this.search = this.search.bind(this)
  }
  view(req: Request, res: Response) {
    const resource = getResource()
    const id = req.params["id"]
    this.service.load(id).then((user) => {
      res.render(getView(req, "user"), {
        resource,
        user: escapeHTML(user),
        titles,
        positions,
      })
    })
  }
  submit(req: Request, res: Response) {
    const resource = getResource()
    const user = req.body
    console.log("user " + JSON.stringify(user))
    const errors = validate<User>(user, userModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(errors).end()
    } else {
      this.service
        .update(user)
        .then((result) => {
          console.log("result " + result)
          res.status(200).json(user).end()
        })
        .catch((err) => handleError(err, res, this.log))
    }
  }
  search(req: Request, res: Response) {
    const resource = getResource()
    let filter: UserFilter = {
      q: "",
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<UserFilter>(req, ["status"])
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    this.service.search(cloneFilter(filter, page, limit), limit, page).then((result) => {
      const list = escapeArray(result.list)
      const search = getSearch(req.url)
      const sort = buildSortFromRequest(req)
      res.render(getView(req, "users"), {
        resource,
        limits: resources.limits,
        filter,
        list,
        pages: buildPages(limit, result.total),
        pageSearch: buildPageSearch(search),
        sort: buildSortSearch(search, fields, sort),
      })
    })
  }
}
