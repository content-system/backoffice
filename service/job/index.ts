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
  getStatusCode,
  handleError,
  hasSearch,
  queryNumber,
  resources,
} from "express-ext"
import { Log, Manager, Search } from "onecore"
import { DB, Repository, SearchBuilder } from "query-core"
import { formatDateTime, getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError404, renderError500 } from "../template"
import { Job, JobFilter, jobModel, JobRepository, JobService } from "./job"
export * from "./job"

export class SqlJobRepository extends Repository<Job, string> implements JobRepository {
  constructor(db: DB) {
    super(db, "jobs", jobModel)
  }
}
export class JobUseCase extends Manager<Job, string, JobFilter> implements JobService {
  constructor(search: Search<Job, JobFilter>, repository: JobRepository) {
    super(search, repository)
  }
}

const fields = ["title", "publishedAt", "description"]
export class JobController {
  constructor(private jobService: JobService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: JobFilter = {
      limit: resources.defaultLimit,
      // title: "Java",
    }
    if (hasSearch(req)) {
      filter = fromRequest<JobFilter>(req)
      format(filter, ["publishedAt"])
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    this.jobService
      .search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        const list = escapeArray(result.list)
        for (const item of list) {
          item.publishedAt = formatDateTime(item.publishedAt, dateFormat)
        }
        const search = getSearch(req.url)
        render(req, res, "jobs", {
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
    this.jobService
      .load(id)
      .then((job) => {
        if (!job) {
          renderError404(req, res, resource)
        } else {
          render(req, res, "job", { resource, job: escape(job) })
        }
      })
      .catch((err) => renderError500(req, res, resource, err))
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const job = req.body
    const errors = validate<Job>(job, jobModel, resource)
    if (errors.length > 0) {
      res.status(getStatusCode(errors)).json(errors).end()
    } else {
      const id = req.params["id"]
      const editMode = id !== "new"
      if (!editMode) {
        this.jobService
          .create(job)
          .then((result) => {
            if (result === 0) {
              res.status(409).end()
            } else {
              res.status(201).json(job).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      } else {
        this.jobService
          .update(job)
          .then((result) => {
            if (result === 0) {
              res.status(410).end()
            } else {
              res.status(200).json(job).end()
            }
          })
          .catch((err) => handleError(err, res, this.log))
      }
    }
  }
}

export function useJobController(db: DB, log: Log): JobController {
  const builder = new SearchBuilder<Job, JobFilter>(db.query, "jobs", jobModel, db.driver)
  const repository = new SqlJobRepository(db)
  const service = new JobUseCase(builder.search, repository)
  return new JobController(service, log)
}
