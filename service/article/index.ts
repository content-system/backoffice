import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  cloneFilter,
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
  respondError,
} from "express-ext"
import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { write } from "security-express"
import { formatDateTime, getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from "./article"
import { buildQuery } from "./query"
export * from "./article"

export class SqlArticleRepository extends Repository<Article, string> implements ArticleRepository {
  constructor(db: DB) {
    super(db, "articles", articleModel)
  }
}
export class ArticleUseCase extends UseCase<Article, string, ArticleFilter> implements ArticleService {
  constructor(search: Search<Article, ArticleFilter>, repository: ArticleRepository) {
    super(search, repository)
  }
}

const fields = ["id", "title", "publishedAt", "description"]
export class ArticleController {
  constructor(private service: ArticleService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ArticleFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<ArticleFilter>(req, ["tags"])
      format(filter, ["publishedAt"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    const offset = getOffset(limit, page)
    this.service.search(cloneFilter(filter, limit, page), limit, page).then((result) => {
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
        sort: buildSortSearch(search, fields, filter.sort),
        message: buildMessage(resource, list, limit, page, result.total),
      })
    }).catch((err) => renderError500(req, res, resource, err))
  }
  view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    const id = req.params.id
    const editMode = id !== "new"
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    if (!editMode) {
      if (readonly) {
        renderError403(req, res, resource)
      } else {
        render(req, res, "article", {
        resource,
        editMode,
        article: {},
      })
      }
    } else {
      this.service.load(id).then((article) => {
        if (!article) {
          renderError404(req, res, resource)
        } else {
          article.publishedAt = formatDateTime(article.publishedAt, dateFormat)
          render(req, res, "article", {
            resource,
            readonly,
            editMode,
            article: escape(article),
          })
        }
      }).catch((err) => renderError500(req, res, resource, err))
    }
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const article = req.body
    const errors = validate<Article>(article, articleModel, resource)
    if (errors.length > 0) {
      respondError(res, errors)
    } else {
      const id = req.params.id
      const editMode = id !== "new"
      if (!editMode) {
        this.service.create(article).then((result) => {
          if (result === 0) {
            res.status(410).end()
          } else {
            res.status(201).json(article).end()
          }
        }).catch((err) => handleError(err, res, this.log))
      } else {
        this.service.update(article).then((result) => {
          if (result === 0) {
            res.status(410).end()
          } else {
            res.status(200).json(article).end()
          }
        }).catch((err) => handleError(err, res, this.log))
      }
    }
  }
}

export function useArticleController(db: DB, log: Log): ArticleController {
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, "articles", articleModel, db.driver, buildQuery)
  const repository = new SqlArticleRepository(db)
  const service = new ArticleUseCase(builder.search, repository)
  return new ArticleController(service, log)
}
