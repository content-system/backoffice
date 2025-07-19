interface StringMap {
  [key: string]: string
}
interface Phones {
  [key: string]: string
}
interface ErrorMessage {
  field: string
  code: string
  message?: string
}
// tslint:disable-next-line:class-name
class resources {
  static login = "/login"
  static redirect = "redirectUrl"
  static defaultLimit = 12
  static containerClass = "form-input"
  static hiddenMessage = "hidden-message"
  static token = "token"

  static load(pageBody: HTMLElement): void {}

  static num1 = / |,|\$|€|£|¥|'|٬|،| /g
  static num2 = / |\.|\$|€|£|¥|'|٬|،| /g
  static phonecodes?: Phones
  static email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i
  static phone = /^\d{5,14}$/
  static password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  static url = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  static digit = /^\d+$/
  static amount = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/ // const regExp = /\d+\.\d+/;
  static digitAndDash = /^[0-9-]*$/
  static digitAndChar = /^\w*\d*$/
  static checkNumber = /^\d{0,8}$/
  static percentage = /^[1-9][0-9]?$|^100$/
  static ipv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
  static usPostcode = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  static caPostcode =
    /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/

  static ipv6 =
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
}

function getCurrentURL() {
  return window.location.origin + window.location.pathname
}
function getRedirect(): string {
  const loc = window.location.href
  if (loc.length < 8) {
    return ""
  }
  const i = loc.indexOf("/", 9)
  if (i < 0) {
    return ""
  }
  return loc.substring(i)
}
function buildLoginUrl() {
  const r = getRedirect()
  if (r.length === 0) {
    return resources.login
  } else {
    return resources.login + "?" + resources.redirect + "=" + encodeURIComponent(r)
  }
}

let eleHtml: Element | undefined | null
let isGetHtml = false
function getLang(): string | undefined {
  if (!isGetHtml) {
    eleHtml = document.querySelector("html")
    isGetHtml = true
  }
  if (isGetHtml && eleHtml) {
    const lang = eleHtml.getAttribute("lang")
    if (lang && lang.length > 0) {
      return lang
    }
  }
  return undefined
}
function getToken(): string | null {
  const token = localStorage.getItem(resources.token)
  return token
}
function getHeaders(): any {
  const token = getToken()
  const lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return { "Content-Language": lang, Authorization: `Bearer ${token}` } // Include the JWT
    } else {
      return { "Content-Language": lang }
    }
  } else {
    if (token && token.length > 0) {
      return { Authorization: `Bearer ${token}` } // Include the JWT
    } else {
      return {}
    }
  }
}

function handleGetError(response: Response, resource: StringMap) {
  if (response.status === 401) {
    window.location.href = buildLoginUrl()
  } else if (response.status === 403) {
    alertError(resource.error_403, response.statusText)
  } else if (response.status === 404) {
    alertError(resource.error_404, response.statusText)
  } else if (response.status === 400) {
    alertError(resource.error_400, response.statusText)
  } else {
    console.error("Error: ", response.statusText)
    alertError(resource.error_submit_failed, response.statusText)
  }
}
function handleError(err: any, msg: string) {
  hideLoading()
  console.log("Error: " + err)
  alertError(msg, err)
}

const histories: string[] = []
const historyMax = 10
function goBack() {
  let url = histories.pop()
  if (url) {
    const newUrl = url + (url.indexOf("?") >= 0 ? "&" : "?") + "partial=true"
    showLoading()
    fetch(newUrl, { method: "GET", headers: getHeaders() })
      .then((response) => {
        if (response.ok) {
          response
            .text()
            .then((data) => {
              const pageBody = document.getElementById("pageBody")
              if (pageBody) {
                pageBody.innerHTML = data
                window.history.pushState({ pageTitle: "" }, "", url)
                afterLoaded(pageBody)
              }
              hideLoading()
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  }
}

function getField(search: string, fieldName: string): string {
  let i = search.indexOf(fieldName + "=")
  if (i < 0) {
    return ""
  }
  if (i > 0) {
    if (search.substring(i - 1, 1) != "&") {
      i = search.indexOf("&" + fieldName + "=")
      if (i < 0) {
        return search
      }
      i = i + 1
    }
  }
  const j = search.indexOf("&", i + fieldName.length)
  return j >= 0 ? search.substring(i, j) : search.substring(i)
}
function findParent(e: HTMLElement | null | undefined, className: string, nodeName?: string): HTMLElement | null {
  if (!e) {
    return null
  }
  if (nodeName && e.nodeName === nodeName) {
    return e
  }
  let p: HTMLElement | null = e
  while (true) {
    p = p.parentElement
    if (!p) {
      return null
    }
    if (p.classList.contains(className)) {
      return p
    }
    if (nodeName && p.nodeName === nodeName) {
      return p
    }
  }
}
function findParentNode(e: HTMLElement | null | undefined, nodeName: string): HTMLElement | null {
  if (!e) {
    return null
  }
  if (e.nodeName == nodeName || e.getAttribute("data-field")) {
    return e
  }
  let p: HTMLElement | null = e
  while (true) {
    p = p.parentElement
    if (!p) {
      return null
    }
    if (p.nodeName == nodeName || p.getAttribute("data-field")) {
      return p
    }
  }
}

function toggleClass(e: HTMLElement | null | undefined, className: string): boolean {
  if (e) {
    if (e.classList.contains(className)) {
      e.classList.remove(className)
      return false
    } else {
      e.classList.add(className)
      return true
    }
  }
  return false
}
function addClass(ele: Element | null | undefined, className: string): boolean {
  if (ele) {
    if (!ele.classList.contains(className)) {
      ele.classList.add(className)
      return true
    }
  }
  return false
}
function addClasses(ele: Element | null | undefined, classes: string[]): number {
  let count = 0
  if (ele) {
    for (let i = 0; i < classes.length; i++) {
      if (addClass(ele, classes[i])) {
        count++
      }
    }
  }
  return count
}
function removeClass(ele: Element | null | undefined, className: string): boolean {
  if (ele) {
    if (ele && ele.classList.contains(className)) {
      ele.classList.remove(className)
      return true
    }
  }
  return false
}
function removeClasses(ele: Element | null | undefined, classes: string[]): number {
  let count = 0
  if (ele) {
    for (let i = 0; i < classes.length; i++) {
      if (removeClass(ele, classes[i])) {
        count++
      }
    }
  }
  return count
}

function afterLoaded(pageBody: HTMLElement) {
  if (pageBody) {
    setTimeout(function () {
      const forms = pageBody.querySelectorAll("form")
      for (let i = 0; i < forms.length; i++) {
        registerEvents(forms[i])
      }
      const msg = getHiddenMessage(forms, resources.hiddenMessage)
      if (msg && msg.length > 0) {
        toast(msg)
      }
    }, 0)
  }
}
function getHiddenMessage(nodes: NodeListOf<HTMLFormElement>, name?: string, i?: number): string | null {
  const index = i !== undefined && i >= 0 ? i : 0
  if (nodes.length > index) {
    const form = nodes[index]
    const n = name && name.length > 0 ? name : "hidden-message"
    const ele = form.querySelector("." + n)
    if (ele) {
      return ele.innerHTML
    }
  }
  return null
}
function getContainer(ele?: HTMLElement | null): HTMLElement | null {
  return findParent(ele, resources.containerClass, "LABEL")
}
function handleMaterialFocus(ele: HTMLInputElement) {
  if (ele.disabled || ele.readOnly) {
    return
  }
  if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
    addClass(getContainer(ele), "focused")
  }
}
function materialOnFocus(event: Event) {
  const ele = event.currentTarget as HTMLInputElement
  if (ele.disabled || ele.readOnly) {
    return
  }
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      addClass(getContainer(ele), "focused")
    }
  }, 0)
}
function materialOnBlur(event: Event): void {
  const ele = event.currentTarget as HTMLInputElement
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      removeClasses(getContainer(ele), ["focused", "focus"])
    }
  }, 0)
}
function registerEvents(form: HTMLFormElement): void {
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ele = form[i] as HTMLInputElement
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      let type = ele.getAttribute("type")
      if (type != null) {
        type = type.toLowerCase()
      }
      if (ele.nodeName === "INPUT" && (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset")) {
        continue
      } else {
        const parent = ele.parentElement
        const required = ele.getAttribute("required")
        if (parent) {
          if (
            parent.nodeName === "LABEL" &&
            // tslint:disable-next-line:triple-equals
            required != null &&
            required !== undefined &&
            required != "false" &&
            !parent.classList.contains("required")
          ) {
            parent.classList.add("required")
          } else if (parent.classList.contains("form-group") || parent.classList.contains("field")) {
            const firstChild = parent.firstChild
            if (firstChild && firstChild.nodeName === "LABEL") {
              if (!(firstChild as HTMLLabelElement).classList.contains("required")) {
                ;(firstChild as HTMLLabelElement).classList.add("required")
              }
            }
          }
        }
        if (ele.getAttribute("onblur") === null && ele.getAttribute("(blur)") === null) {
          ele.onblur = materialOnBlur
        }
        if (ele.getAttribute("onfocus") === null && ele.getAttribute("(focus)") === null) {
          ele.onfocus = materialOnFocus
        }
      }
    }
  }
}
