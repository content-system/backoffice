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
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  queryNumber,
  resources,
  respondError,
} from "express-ext"
import { Log, Search, UseCase } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { write } from "security-express"
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

const fields = ["id", "name", "path", "icon", "type", "resource", "parent", "sequence", "status"]
export class CategoryController {
  constructor(private service: CategoryService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: CategoryFilter = {
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<CategoryFilter>(req)
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    const offset = getOffset(limit, page)
    this.service
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list, offset, "no")
        const search = getSearch(req.url)
        render(req, res, "categories", {
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
    this.service
      .load(id)
      .then((category) => {
        if (!category) {
          renderError404(req, res, resource)
        } else {
          const permissions = res.locals.permissions as number
          const readonly = write != (write & permissions)
          render(req, res, "category", {
            resource,
            user: escape(category),
            readonly,
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
        this.service
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
        this.service
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
  const builder = new SearchBuilder<Category, CategoryFilter>(db.query, "categories", categoryModel, db.driver)
  const repository = new SqlCategoryRepository(db)
  const service = new CategoryUseCase(builder.search, repository)
  return new CategoryController(service, log)
}
