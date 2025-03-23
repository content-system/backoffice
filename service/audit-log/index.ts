import { Request, Response } from "express"
import {
  addDays,
  addSeconds,
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  cloneFilter,
  escapeArray,
  format,
  fromRequest,
  getSearch,
  getView,
  hasSearch,
  queryLimit,
  queryPage,
  resources,
  toString,
} from "express-ext"
import { Log, Search } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { formatFullDateTime, getDateFormat } from "ui-formatter"
import { buildError500, getLang, getResource } from "../resources"
import { AuditLog, AuditLogFilter, auditLogModel } from "./audit-log"

export * from "./audit-log"

const fields = ["id", "timestamp", "resource", "action", "status", "userId", "ip", "remark"]

export class AuditLogController {
  constructor(private search: Search<AuditLog, AuditLogFilter>, private log: Log) {
    this.render = this.render.bind(this)
  }
  render(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    const now = new Date()
    let filter: AuditLogFilter = {
      limit: resources.defaultLimit,
      time: {
        min: addDays(now, -3),
        max: addSeconds(now, 300),
      },
    }
    if (hasSearch(req)) {
      filter = fromRequest<AuditLogFilter>(req, ["status"])
      format(filter, ["timestamp"])
    }
    const page = queryPage(req, filter)
    const limit = queryLimit(req)
    this.search(cloneFilter(filter, limit, page), limit, page)
      .then((result) => {
        for (const item of result.list) {
          item.time = formatFullDateTime(item.time, dateFormat)
        }
        const list = escapeArray(result.list)
        const search = getSearch(req.url)
        res.render(getView(req, "audit-logs"), {
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
}

export function useAuditLogController(db: DB, log: Log): AuditLogController {
  const builder = new SearchBuilder<AuditLog, AuditLogFilter>(db.query, "audit_logs", auditLogModel, db.driver)
  // const getAuditLog = useGet<AuditLog, string>(db.query, "audit_logs", auditLogModel, db.param)
  // return useSearchController(log, builder.search, getAuditLog, ["status"], ["timestamp"])
  return new AuditLogController(builder.search, log)
}
