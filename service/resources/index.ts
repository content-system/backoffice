import { Request, Response } from "express"

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

export function getResource(req: Request): StringMap {
  // const l = lang ? lang : "en"
  const l = "en"
  const r = resources[l]
  return r ? r : resources["en"]
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
