import { Attributes, Filter, TimeRange, ViewSearchService } from "onecore"

export interface AuditLog {
  id: string
  resource: string
  userId: string
  ip: string
  action: string
  time: Date
  email: string
  status: string
  remark?: string
}
export interface AuditLogFilter extends Filter {
  id?: string
  resource?: string
  userId?: string
  ip?: string
  action?: string
  time?: TimeRange
  status?: string
}
export interface AuditLogService extends ViewSearchService<AuditLog, string, AuditLogFilter> {}
export const auditLogModel: Attributes = {
  id: {
    key: true,
    length: 40,
  },
  resource: {
    match: "equal",
  },
  userId: {
    column: "user_id",
    required: true,
    length: 40,
    match: "equal",
  },
  ip: {},
  action: {
    match: "equal",
  },
  timestamp: {
    type: "datetime",
  },
  status: {
    match: "equal",
    length: 1,
  },
  remark: {},
}
