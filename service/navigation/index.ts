import { Privilege } from "authen-service"
import { NextFunction, Request, Response } from "express"
import { StringMap } from "onecore"

function renderSingleItem(item: Privilege, r: StringMap): string {
  let name = item.name
  if (r && item.resource) {
    const x = r[item.resource]
    name = !x || x === "" ? item.name : x
  }
  const ignoreLang = ", true"
  return `<li><a class="menu-item" href="${item.path}" onclick="navigate(event${ignoreLang})"><i class="material-icons">${item.icon}</i><span>${name}</span></a></li>`
}
function renderArray(item: Privilege[], r: StringMap): string {
  return item.map((i) => renderSingleItem(i, r)).join("")
}
function renderItem(item: Privilege, r: StringMap): string {
  if (item.children && item.children.length > 0) {
    let name = item.name
    if (r && item.resource) {
      const x = r[item.resource]
      name = !x || x === "" ? item.name : x
    }
    return `<li class="open">
  <div class="menu-item" onclick="toggleMenuItem(event)">
    <i class="material-icons">${item.icon}</i><span>${name}</span><i class="entity-icon down"></i>
  </div>
  <ul class="sub-list expanded">${renderArray(item.children, r)}</ul>
</li>`
  } else {
    return renderSingleItem(item, r)
  }
}
export function renderItems(items: Privilege[], r: StringMap): string {
  return items.map((i) => renderItem(i, r)).join("")
}

export class MenuBuilder {
  constructor(
    private getResource: (lang: string) => StringMap,
    private load: (userId: string) => Promise<Privilege[]>,
    private langs: string[],
    private defaultLang: string,
  ) {
    this.build = this.build.bind(this)
  }
  build(req: Request, res: Response, next: NextFunction) {
    console.log("payload " + JSON.stringify(res.locals.account))
    const lang = res.locals.account.lang
    const userId = res.locals.account.id
    res.locals.lang = lang
    res.locals.userId = userId
    if (isPartial(req)) {
      next()
    } else {
      this.load(userId)
        .then((items) => {
          const r = this.getResource(lang)
          res.locals.menu = renderItems(items, r)
          console.log("menu " + JSON.stringify(res.locals.menu))
          next()
        })
        .catch((err) => {
          next(err)
        })
    }
  }
}
export function query(req: Request, name: string): string {
  const p = req.query[name]
  if (!p || p.toString().length === 0) {
    return ""
  }
  return p.toString()
}
export function isPartial(req: Request): boolean {
  const p = req.query["partial"]
  if (p && p.toString() === "true") {
    return true
  }
  return false
}
