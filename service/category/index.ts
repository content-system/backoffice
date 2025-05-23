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
  getSearch,
  handleError,
  hasSearch,
  queryNumber,
  resources,
  respondError,
} from "express-ext"
import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError404, renderError500 } from "../template"
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
        render(req, res, "categorys", {
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
    const id = req.params["id"]
    this.categoryService
      .load(id)
      .then((category) => {
        if (!category) {
          renderError404(req, res, resource)
        } else {
          render(req, res, "category", {
            resource,
            category: escape(category),
          })
        }
      })
      .catch((err) => renderError500(req, res, resource, err))
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const category = req.body
    const errors = validate<Category>(category, categoryModel, resource)
    if (errors.length > 0) {
      respondError(res, errors)
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
