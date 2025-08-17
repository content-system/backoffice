import { Request, Response } from "express"
import { buildError500, checked, getView, toString } from "express-ext"
import fs from "fs"
import nunjucks, { Template } from "nunjucks"
import { Log, StringMap } from "onecore"
import path from "path"
import { datetimeToString, formatDate, formatDateTime, formatLongDateTime, formatNumber, formatPhone } from "ui-formatter"

export class resources {
  static nunjucks: nunjucks.Environment
  static log?: Log
}
export function getTemplateString(name: string, partial?: boolean): string {
  if (partial) {
    const templatePath = path.join("views", "pages/" + name + ".html")
    const template = fs.readFileSync(templatePath, "utf8")
    return template
  } else {
    return '{% extends "layouts/default.html" %}{% block content %}{% include "pages/' + name + '.html" %}{% endblock %}'
  }
}
const cacheTemplate = new Map<string, Template>()
const partialTemplate = new Map<string, Template>()
export function render(req: Request, res: Response, name: string, obj?: any): void {
  const partial = req.query["partial"]
  const isPartial = partial === "true"
  const cache = isPartial ? partialTemplate : cacheTemplate
  let compiledTemplate = cache.get(name)
  if (!compiledTemplate) {
    const template = getTemplateString(name, isPartial)
    compiledTemplate = nunjucks.compile(template, resources.nunjucks)
    cache.set(name, compiledTemplate)
  }
  if (obj) {
    obj.menu = res.locals.menu
    obj.checked = checked
    obj.datetimeToString = datetimeToString
    obj.formatLongDateTime = formatLongDateTime
    obj.formatDateTime = formatDateTime
    obj.formatDate = formatDate
    obj.formatPhone = formatPhone
    obj.formatNumber = formatNumber
  }
  const html = compiledTemplate.render(obj)
  res.send(html)
}

export function renderError(req: Request, res: Response, obj?: any): void {
  res.render(getView(req, "error"), obj)
}
export function renderError404(req: Request, res: Response, resource: StringMap): void {
  renderError404(req, res, resource)
}
export function renderError500(req: Request, res: Response, resource: StringMap, err: any): void {
  if (resources.log) {
    resources.log(toString(err))
  }
  res.render(getView(req, "error"), buildError500(resource, res))
}
