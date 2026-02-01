import { Request, Response } from "express"
import { buildError404, buildError500, generateChips, generateTags, getView, toString } from "express-ext"
import fs from "fs"
import nunjucks, { Template } from "nunjucks"
import { Log, StringMap } from "onecore"
import path from "path"
import { datetimeToString, formatDate, formatDateTime, formatLongDateTime, formatNumber, formatPhone, isChecked, isNotEmpty } from "ui-formatter"

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
    return '{% extends "layout.html" %}{% block content %}{% include "pages/' + name + '.html" %}{% endblock %}'
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
    obj.isChecked = isChecked
    obj.isNotEmpty = isNotEmpty
    obj.datetimeToString = datetimeToString
    obj.formatLongDateTime = formatLongDateTime
    obj.formatDateTime = formatDateTime
    obj.formatDate = formatDate
    obj.formatPhone = formatPhone
    obj.formatNumber = formatNumber
    obj.generateTags = generateTags
    obj.generateChips = generateChips
  }
  const html = compiledTemplate.render(obj)
  res.send(html)
}

export function renderError(req: Request, res: Response, obj?: any): void {
  res.render(getView(req, "error"), obj)
}

export function renderError403(req: Request, res: Response, resource: StringMap): void {
  if (resources.log) {
    resources.log("Have no permission to access this page " + req.url)
  }
  res.render(getView(req, "error"), buildError403(resource, res))
}
export function renderError404(req: Request, res: Response, resource: StringMap): void {
  res.render(getView(req, "error"), buildError404(resource, res))
}
export function renderError500(req: Request, res: Response, resource: StringMap, err: any): void {
  if (resources.log) {
    resources.log(toString(err))
  }
  res.render(getView(req, "error"), buildError500(resource, res))
}

export function buildError403(resource: StringMap, res: Response): any {
  return {
    message: {
      title: resource.error_404_title,
      description: resource.error_404_message,
    },
    menu: res.locals.menu,
  }
}