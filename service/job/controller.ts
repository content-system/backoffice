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
import { getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Job, JobFilter, jobModel, JobService } from "./job"

const fields = ["id", "title", "publishedAt", "position", "quantity", "location"]
export class JobController {
  constructor(private service: JobService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: JobFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<JobFilter>(req, ["skills"])
      format(filter, ["publishedAt"])
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "jobs", {
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
      render(req, res, "job", {
        resource,
        editMode,
        job: {},
      })
    } else {
      try {
        const job = await this.service.load(id)
        if (!job) {
          return renderError404(req, res, resource)
        }
        render(req, res, "job", {
          resource,
          readonly,
          editMode,
          job: escape(job),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const job = req.body as Job
    const errors = validate<Job>(job, jobModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        const result = await this.service.create(job)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(job)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res, this.log)
    }
  }
}
