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
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ContentFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<ContentFilter>(req)
      format(filter, ["publishedAt"])
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      for (const item of list) {
        item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
      }
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "contents", {
        resource,
        readonly,
        dateFormat,
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
    try {
      const content = await this.service.load(id, lang)
      if (!content) {
        return renderError404(req, res, resource)
      }
      render(req, res, "content", {
        resource,
        content: escape(content),
        readonly,
      })
    } catch (err) {
      renderError500(req, res, resource, err)
    }
  }
  async submit(req: Request, res: Response) {
    const language = getLang(req, res)
    const resource = getResource(language)
    const content = req.body
    const errors = validate<Content>(content, contentModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const userId = res.locals.userId
    content.updatedBy = userId
    content.updatedAt = new Date()
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        content.createdBy = userId
        content.createdAt = new Date()
        const result = await this.service.create(content)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(content)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res, this.log)
    }
  }
}
