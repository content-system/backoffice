import { Request, Response } from "express"

import { query } from "express-ext"
import { en as adminEN } from "./admin/en"
import { vi as adminVI } from "./admin/vi"
import { en as authenticationEN } from "./authentication/en"
import { vi as authenticationVI } from "./authentication/vi"
import { en as commonEN } from "./en"
import { vi as commonVI } from "./vi"

export interface Resource {
  resource(): StringMap
  value(key: string, param?: any): string
  format(f: string, ...args: any[]): string
}
export interface StringMap {
  [key: string]: string
}
export interface Resources {
  [key: string]: StringMap
}

const en: StringMap = {
  ...commonEN,
  ...authenticationEN,
  ...adminEN,
}
const vi: StringMap = {
  ...commonVI,
  ...authenticationVI,
  ...adminVI,
}

export const resources: Resources = {
  en: en,
  vi: vi,
}

export function getDateFormat(lang?: string): string {
  if (lang === "vi") {
    return "D/M/YYYY"
  }
  return "M/D/YYYY"
}
export function queryLang(req: Request): string {
  const lang = query(req, "lang")
  return lang && lang.length > 0 ? lang : "en"
}
export function getLang(req: Request, res: Response): string {
  let lang = res.locals.lang
  if (!lang) {
    lang = query(req, "lang")
    if (lang !== "vi") {
      lang = "en"
    }
  }
  return lang
}
export function getResource(lang: string | Request): StringMap {
  if (lang) {
    if (typeof lang === "string") {
      const r = resources[lang]
      if (r) {
        return r
      }
    } else {
      const l = query(lang, "lang")
      if (l) {
        const r = resources[l]
        if (r) {
          return r
        }
      }
    }
  }
  return resources["en"]
}
export function getResourceByLang(lang: string): StringMap {
  if (lang) {
    const r = resources[lang]
    if (r) {
      return r
    }
  }
  return resources["en"]
}

export function buildError404(resource: StringMap, res: Response): any {
  return {
    message: {
      title: resource.error_404_title,
      description: resource.error_404_message,
    },
    menu: res.locals.menu,
  }
}
export function buildError500(resource: StringMap, res: Response): any {
  return {
    message: {
      title: resource.error_500_title,
      description: resource.error_500_message,
    },
    menu: res.locals.menu,
  }
}
export function buildError(res: Response, title: string, description: string, resource?: StringMap): any {
  return {
    message: {
      title,
      description,
    },
    menu: res.locals.menu,
    resource,
  }
}
