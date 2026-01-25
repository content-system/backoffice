import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  escape,
  escapeArray,
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
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Category, CategoryFilter, categoryModel, CategoryService } from "./category"

function createCategory(): Category {
  const category = {} as Category
  category.status = "A"
  return category
}
const fields = ["id", "name", "path", "icon", "type", "resource", "parent", "sequence", "status"]
export class CategoryController {
  constructor(private service: CategoryService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: CategoryFilter = {
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<CategoryFilter>(req)
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "no")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "categories", {
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
    const id = req.params.id
    const editMode = id !== "new"
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    if (!editMode) {
      if (readonly) {
        return renderError403(req, res, resource)
      }
      const category = createCategory()
      render(req, res, "category", {
        resource,
        editMode,
        category: escape(category),
      })
    } else {
      try {
        const category = await this.service.load(id)
        if (!category) {
          return renderError404(req, res, resource)
        }
        render(req, res, "category", {
          resource,
          readonly,
          editMode,
          category: escape(category),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const category = req.body
    const errors = validate<Category>(category, categoryModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        const result = await this.service.create(category)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(category)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res, this.log)
    }
  }
}
