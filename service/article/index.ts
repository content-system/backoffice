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
  format,
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
import { Log, Manager, Search } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { write } from "security-express"
import { formatDateTime, getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { Article, ArticleFilter, articleModel, ArticleRepository, ArticleService } from "./article"
export * from "./article"

export class SqlArticleRepository extends Repository<Article, string> implements ArticleRepository {
  constructor(db: DB) {
    super(db, "articles", articleModel)
  }
}
export class ArticleUseCase extends Manager<Article, string, ArticleFilter> implements ArticleService {
  constructor(search: Search<Article, ArticleFilter>, repository: ArticleRepository) {
    super(search, repository)
  }
}

const fields = ["title", "publishedAt", "description"]
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
    let filter: ArticleFilter = {
      limit: resources.defaultLimit,
      q: "",
    }
    if (hasSearch(req)) {
      filter = fromRequest<ArticleFilter>(req)
      format(filter, ["publishedAt"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    this.service
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        for (const item of result.list) {
          item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
        }
        const search = getSearch(req.url)
        res.render(getView(req, "articles"), {
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
    const dateFormat = getDateFormat(lang)
    const id = req.params["id"]
    const editMode = id !== "new"
    if (!editMode) {
      res.render(getView(req, "article"), {
        resource,
        article: {},
        editMode,
      })
    } else {
      this.service
        .load(id)
        .then((article) => {
          if (!article) {
            res.render(getView(req, "error"), buildError404(resource, res))
          } else {
            const permissions = res.locals.permissions as number
            const readonly = write != (write | permissions)
            article.publishedAt = formatDateTime(article.publishedAt, dateFormat)
            res.render(getView(req, "article"), {
              resource,
              article: escape(article),
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
    const article = req.body
    const errors = validate<Article>(article, articleModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(errors).end()
    } else {
      const id = req.params["id"]
      const editMode = id !== "new"
      if (!editMode) {
        this.service
          .create(article)
          .then((result) => {
            if (result === 0) {
              res.status(410).end()
            } else {
              res.status(201).json(article).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      } else {
        this.service
          .update(article)
          .then((result) => {
            if (result === 0) {
              res.status(410).end()
            } else {
              res.status(200).json(article).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      }
    }
  }
}

export function useArticleController(db: DB, log: Log): ArticleController {
  const builder = new SearchBuilder<Article, ArticleFilter>(db.query, "articles", articleModel, db.driver)
  const repository = new SqlArticleRepository(db)
  const service = new ArticleUseCase(builder.search, repository)
  return new ArticleController(service, log)
}
