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
import { verifyToken } from "jsonwebtoken-plus"
import { Log } from "onecore"
import { validate } from "xvalidators"
import { config } from "../../config"
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
    const resource = getResource(req, res)
    const id = req.params["id"]
    this.service
      .load(id)
      .then((user) => {
        if (!user) {
          res.render(getView(req, "error-404"), { resource })
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
    const resource = getResource(req, res)
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
    const token = req.cookies.token
    if (token) {
      verifyToken(token, config.auth.token.secret)
        .then((payload) => {
          console.log("Payload " + JSON.stringify(payload))
          const resource = getResource(req, res)
          let filter: UserFilter = {
            q: "",
            limit: resources.defaultLimit,
          }
          if (hasSearch(req)) {
            filter = fromRequest<UserFilter>(req, ["status"])
          }
          const page = queryNumber(req, resources.page, 1)
          const limit = queryNumber(req, resources.limit, resources.defaultLimit)
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
              res.render(getView(req, "error-500"), { resource })
            })
        })
        .catch((err) => {
          res.status(401).end("Failed " + err)
        })
    }
  }
}
