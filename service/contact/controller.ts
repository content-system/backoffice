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
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  queryNumber,
  resources,
  respondError,
} from "express-ext"
import { nanoid } from "nanoid"
import { Log } from "onecore"
import { write } from "security-express"
import { formatDateTime, formatPhone, getDateFormat } from "ui-formatter"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError404, renderError500 } from "../template"
import { Contact, ContactFilter, contactModel, ContactService } from "./contact"

const fields = ["name", "email", "phone", "company", "country"]
export class ContactController {
  constructor(private service: ContactService, private log: Log) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const dateFormat = getDateFormat(lang)
    let filter: ContactFilter = {
      limit: resources.defaultLimit,
    }
    if (hasSearch(req)) {
      filter = fromRequest<ContactFilter>(req)
      format(filter, ["submittedAt"])
    }
    const page = queryNumber(req, resources.page, 1)
    const limit = queryNumber(req, resources.limit, resources.defaultLimit)
    const offset = getOffset(limit, page)
    this.service.search(cloneFilter(filter, limit, page), limit, page).then((result) => {
      const list = escapeArray(result.list, offset, "sequence")
      for (const item of list) {
        item.submittedAt = formatDateTime(item.submittedAt, dateFormat)
      }
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "contacts", {
        resource,
        readonly,
        dateFormat,
        limits: resources.limits,
        filter,
        list,
        pages: buildPages(limit, result.total),
        pageSearch: buildPageSearch(search),
        sort: buildSortSearch(search, fields, filter.sort),
        message: buildMessage(resource, list, limit, page, result.total),
      })
    }).catch((err) => renderError500(req, res, resource, err))
  }
  view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    this.service.load(id).then((contact) => {
      if (!contact) {
        renderError404(req, res, resource)
      } else {
        contact.phone = formatPhone(contact.phone)
        const permissions = res.locals.permissions as number
        const readonly = write != (write & permissions)
        render(req, res, "contact", {
          resource,
          readonly,
          contact: escape(contact)
        })
      }
    }).catch((err) => renderError500(req, res, resource, err))
  }
  submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const contact = req.body
    const errors = validate<Contact>(contact, contactModel, resource)
    if (errors.length > 0) {
      respondError(res, errors)
    } else {
      const id = req.params.id
      const editMode = id !== "new"
      if (!editMode) {
        contact.id = nanoid(10)
        contact.submittedAt = new Date()
        this.service.create(contact).then((result) => {
          if (result === 0) {
            res.status(409).end()
          } else {
            res.status(201).json(contact).end()
          }
        }).catch((err) => handleError(err, res, this.log))
      } else {
        this.service.update(contact).then((result) => {
          if (result === 0) {
            res.status(410).end()
          } else {
            res.status(200).json(contact).end()
          }
        }).catch((err) => handleError(err, res, this.log))
      }
    }
  }
}
