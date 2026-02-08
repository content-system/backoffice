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
  isSuccessful,
  resources,
  respondError
} from "express-ext"
import { write } from "security-express"
import { formatDateTime, getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { Status } from "../shared/status"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Article, ArticleFilter, articleModel, ArticleService } from "./article"

const approve = 8
const fields = ["id", "title", "publishedAt", "description"]
export class ArticleController {
  constructor(private service: ArticleService) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
    this.renderApprove = this.renderApprove.bind(this)
    this.approve = this.approve.bind(this)
    this.reject = this.reject.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ArticleFilter = {
      limit: resources.defaultLimit,
      q: "",
      publishedAt: {},
    }
    if (hasSearch(req)) {
      filter = fromRequest<ArticleFilter>(req, ["tags"])
      format(filter, ["publishedAt"])
    }
    if (!filter.sort) {
      filter.sort = "-publishedAt"
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      for (const item of result.list) {
        item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
      }
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "articles", {
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
    const dateFormat = getDateFormat(lang)
    const id = req.params.id
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    const editMode = id !== "new"
    if (!editMode) {
      if (readonly) {
        return renderError403(req, res, resource)
      }
      render(req, res, "article-form", {
        resource,
        editMode,
        article: {},
      })
    } else {
      try {
        let article: Article | null
        let view = readonly ? "article" : "article-form"
        if (readonly) {
          article = await this.service.load(id)
          if (!article) {
            article = await this.service.loadDraft(id)
          }
        } else {
          article = await this.service.loadDraft(id)
        }
        if (!article) {
          return renderError404(req, res, resource)
        }
        article.publishedAt = formatDateTime(article.publishedAt, dateFormat)
        render(req, res, view, {
          resource,
          readonly,
          editMode,
          article: readonly ? article : escape(article),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const article = req.body as Article
    if (article.status === Status.Submitted) {
      const errors = validate<Article>(article, articleModel, resource)
      if (errors.length > 0) {
        return respondError(res, errors)
      }
    }
    const userId = res.locals.userId
    article.updatedBy = userId
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        article.createdBy = userId
        const result = await this.service.create(article)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(article)
        if (isSuccessful(result)) {
          res.status(200).json(result).end()
        } else if (result === 0) {
          res.status(410).json(result).end()
        } else {
          res.status(400).json(result).end()
        }
      }
    } catch (err) {
      handleError(err, res)
    }
  }
  async renderApprove(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    const id = req.params.id
    try {
      const article = await this.service.load(id)
      if (!article) {
        return renderError404(req, res, resource)
      }
      article.publishedAt = formatDateTime(article.publishedAt, dateFormat)
      const permissions = res.locals.permissions as number
      const canApprove = (approve === (approve & permissions))
      render(req, res, "approve-article", {
        resource,
        canApprove,
        article,
      })
    } catch (err) {
      renderError500(req, res, resource, err)
    }
  }
  async approve(req: Request, res: Response) {
    const id = req.params.id as string
    const userId = res.locals.userId
    try {
      const result = await this.service.approve(id, userId)
      if (isSuccessful(result)) {
        res.status(200).json(result).end()
      } else if (result === 0) {
        res.status(410).json(result).end()
      } else {
        res.status(409).json(result).end()
      }
    } catch (err) {
      handleError(err, res)
    }
  }
  async reject(req: Request, res: Response) {
    const id = req.params.id as string
    const userId = res.locals.userId
    try {
      const result = await this.service.reject(id, userId)
      if (isSuccessful(result)) {
        res.status(200).json(result).end()
      } else if (result === 0) {
        res.status(410).json(result).end()
      } else {
        res.status(409).json(result).end()
      }
    } catch (err) {
      handleError(err, res)
    }
  }
}
