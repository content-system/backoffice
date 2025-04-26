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
  queryNumber,
  resources,
  toString,
} from "express-ext"
import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { Category, CategoryFilter, categoryModel, CategoryRepository, CategoryService } from "./category"
export * from "./category"

export class SqlCategoryRepository extends Repository<Category, string> implements CategoryRepository {
  constructor(db: DB) {
    super(db, "categories", categoryModel)
  }
}
export class CategoryUseCase extends UseCase<Category, string, CategoryFilter> implements CategoryService {
  constructor(search: Search<Category, CategoryFilter>, repository: CategoryRepository) {
    super(search, repository)
  }
}

const fields = ["title", "publishedAt", "description"]
export class CategoryController {
  constructor(private categoryService: CategoryService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: CategoryFilter = {
      limit: resources.defaultLimit,
      // title: "Java",
    }
    if (hasSearch(req)) {
      filter = fromRequest<CategoryFilter>(req)
      format(filter, ["publishedAt"])
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    this.categoryService
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        const search = getSearch(req.url)
        res.render(getView(req, "categorys"), {
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
    this.categoryService
      .load(id)
      .then((category) => {
        if (!category) {
          res.render(getView(req, "error"), buildError404(resource, res))
        } else {
          res.render(getView(req, "category"), {
            resource,
            category: escape(category),
          })
        }
      })
      .catch((err) => {
        this.log(toString(err))
        res.render(getView(req, "error"), buildError500(resource, res))
      })
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const category = req.body
    const errors = validate<Category>(category, categoryModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(errors).end()
    } else {
      const id = req.params["id"]
      const editMode = id !== "new"
      if (!editMode) {
        this.categoryService
          .create(category)
          .then((result) => {
            if (result === 0) {
              res.status(409).end()
            } else {
              res.status(201).json(category).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      } else {
        this.categoryService
          .update(category)
          .then((result) => {
            if (result === 0) {
              res.status(410).end()
            } else {
              res.status(200).json(category).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      }
    }
  }
}

export function useCategoryController(db: DB, log: Log): CategoryController {
  const builder = new SearchBuilder<Category, CategoryFilter>(db.query, "categorys", categoryModel, db.driver)
  const repository = new SqlCategoryRepository(db)
  const service = new CategoryUseCase(builder.search, repository)
  return new CategoryController(service, log)
}
