import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  escape,
  escapeArray,
  format,
  fromRequest,
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  queryLimit,
  queryPage,
  resources,
  respondError
} from "express-ext"
import { isSuccessful, Log } from "onecore"
import { write } from "security-express"
import { formatDateTime } from "ui-formatter"
import { validate } from "xvalidators"
import { getDateFormat, getLang, getResource } from "../resources"
import { render, renderError404, renderError500 } from "../template"
import { Content, ContentFilter, contentModel, ContentService } from "./content"

const fields = ["id", "lang", "title", "publishedAt", "description", "status"]
export class ContentController {
  constructor(private service: ContentService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ContentFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<ContentFilter>(req)
      format(filter, ["publishedAt"])
    }
    const search = getSearch(req.url)
    const sort = buildSortSearch(search, fields, filter.sort)
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    const offset = getOffset(limit, page)
    this.service
      .search(filter, limit, page)
      .then((result) => {
        const list = escapeArray(result.list, offset, "sequence")
        for (const item of list) {
          item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
        }
        render(req, res, "contents", {
          resource,
          limits: resources.limits,
          filter,
          list,
          pages: buildPages(limit, result.total),
          pageSearch: buildPageSearch(search),
          sort,
          message: buildMessage(resource, list, limit, page, result.total),
        })
      })
      .catch((err) => renderError500(req, res, resource, err))
  }
  view(req: Request, res: Response) {
    const id = req.params.id
    const lang = req.params.lang
    const language = getLang(req, res)
    const resource = getResource(language)
    if (!id || !lang) {
      res.status(400).json({ error: "id and lang are required" }).end()
      return
    }
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    this.service
      .load(id, lang)
      .then((content) => {
        if (!content) {
          return renderError404(req, res, resource)
        }
        render(req, res, "content", {
          resource,
          content: escape(content),
          readonly,
        })
      })
      .catch((err) => handleError(err, res, this.log))
  }
  submit(req: Request, res: Response) {
    const language = getLang(req, res)
    const resource = getResource(language)
    const content = req.body
    const errors = validate<Content>(content, contentModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const id = req.params.id
    const editMode = id !== "new"
    if (!editMode) {
      this.service
        .create(content)
        .then((result) => {
          const status = isSuccessful(result) ? 201 : 409
          res.status(status).json(result).end()
        })
        .catch((err) => handleError(err, res, this.log))
    } else {
      this.service
        .update(content)
        .then((result) => {
          const status = isSuccessful(result) ? 200 : 410
          res.status(status).json(result).end()
        })
        .catch((err) => handleError(err, res, this.log))
    }
  }
}
