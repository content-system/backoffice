import { Request, Response } from "express"
import {
  addDays,
  addSeconds,
  buildPages,
  buildPageSearch,
  buildSortFromRequest,
  buildSortSearch,
  cloneFilter,
  format,
  fromRequest,
  getSearch,
  getView,
  hasSearch,
  queryNumber,
  resources,
} from "express-ext"
import { Log, Search } from "onecore"
import { DB, SearchBuilder } from "query-core"
import { formatFullDateTime, getDateFormat } from "ui-formatter"
import { getResource } from "../resources"
import { AuditLog, AuditLogFilter, auditLogModel } from "./audit-log"

export * from "./audit-log"

const fields = ["id", "timestamp", "resource", "action", "status", "userId", "ip", "remark"]

export class AuditLogController {
  constructor(private search: Search<AuditLog, AuditLogFilter>, private log: Log) {
    this.render = this.render.bind(this)
  }
  render(req: Request, res: Response) {
    const dateFormat = getDateFormat()
    const resource = getResource()
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
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    this.search(cloneFilter(filter, page, limit), limit, page).then((result) => {
      for (const item of result.list) {
        item.time = formatFullDateTime(item.time, dateFormat)
      }
      const search = getSearch(req.url)
      const sort = buildSortFromRequest(req)
      res.render(getView(req, "audit-logs"), {
        resource,
        limits: resources.limits,
        filter,
        list: result.list,
        pages: buildPages(limit, result.total),
        pageSearch: buildPageSearch(search),
        sort: buildSortSearch(search, fields, sort),
      })
    })
  }
}

export function useAuditLogController(db: DB, log: Log): AuditLogController {
  const builder = new SearchBuilder<AuditLog, AuditLogFilter>(db.query, "audit_logs", auditLogModel, db.driver)
  // const getAuditLog = useGet<AuditLog, string>(db.query, "audit_logs", auditLogModel, db.param)
  // return useSearchController(log, builder.search, getAuditLog, ["status"], ["timestamp"])
  return new AuditLogController(builder.search, log)
}
