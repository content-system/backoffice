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
  private menu: string
  private userId: string
  private lang: string
  private account: string
  constructor(
    private getResource: (lang: string) => StringMap,
    private load: (userId: string) => Promise<Privilege[]>,
    menu?: string,
    userId?: string,
    lang?: string,
    account?: string,
  ) {
    this.build = this.build.bind(this)
    this.menu = menu || "menu"
    this.userId = userId || "id"
    this.lang = lang || "lang"
    this.account = account || "account"
  }
  build(req: Request, res: Response, next: NextFunction) {
    console.log("payload " + JSON.stringify(res.locals.account))
    const account = res.locals[this.account]
    if (!account) {
      res.status(403).end(`cannot get ${this.account} from res.locals`)
      return
    }
    const lang = account[this.lang]
    const userId = account[this.userId]
    if (!userId) {
      res.status(403).end(`${this.account} must contain ${this.userId}`)
      return
    }
    if (!lang) {
      res.status(403).end(`${this.account} must contain ${this.lang}`)
      return
    }
    res.locals.lang = lang
    res.locals.userId = userId
    if (isPartial(req)) {
      next()
    } else {
      this.load(userId)
        .then((items) => {
          const r = this.getResource(lang)
          res.locals[this.menu] = renderItems(items, r)
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
