function changeMenu(e: Event) {
  const body = document.getElementById("sysBody")
  if (body) {
    const menu = body.classList.toggle("top-menu")
    let ele = e.target as HTMLElement
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement as HTMLElement
      }
      const attr = menu ? "data-sidebar" : "data-menu"
      const icon = menu ? "view_list" : "credit_card"
      const i = ele.querySelector("i")
      if (i) {
        i.innerText = icon
      }
      const text = ele.getAttribute(attr)
      if (text) {
        const span = ele.querySelector("span")
        if (span) {
          span.innerHTML = text
        }
      }
    }
  }
}
function changeMode(e: Event) {
  const body = document.getElementById("sysBody")
  if (body) {
    const dark = body.classList.toggle("dark")
    let ele = e.target as HTMLElement
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement as HTMLElement
      }
      const attr = dark ? "data-light" : "data-dark"
      const icon = dark ? "radio_button_checked" : "timelapse"
      const i = ele.querySelector("i")
      if (i) {
        i.innerText = icon
      }
      const text = ele.getAttribute(attr)
      if (text) {
        const span = ele.querySelector("span")
        if (span) {
          span.innerHTML = text
        }
      }
    }
  }
}
function toggleMenu(e: Event) {
  const p = findParent(e.target as HTMLElement, "sidebar-parent")
  if (p) {
    p.classList.toggle("menu-on")
  }
}
function toggleUniversalSearch(e: Event) {
  const p = findParent(e.target as HTMLElement, "sidebar-parent")
  if (p) {
    p.classList.toggle("search")
  }
}

function toggleMenuItem(e: Event) {
  e.preventDefault()
  let target = e.target as HTMLElement
  const nul = target.nextElementSibling
  if (nul) {
    const elI = target.querySelector(".menu-item > i.entity-icon")
    if (elI) {
      if (nul.classList.contains("expanded")) {
        nul.classList.remove("expanded")
        elI.classList.add("up")
        elI.classList.remove("down")
      } else {
        if (resources.autoCollapse) {
          const nav = findParentNode(target, "NAV")
          if (nav) {
            const items = nav.querySelectorAll(".open")
            const l = items.length
            for (let i = 0; i < l; i++) {
              const item = items[i] as HTMLElement
              if (item) {
                item.classList.remove("open")
                const nu10 = item.querySelector(".expanded")
                if (nu10) {
                  nu10.classList.remove("expanded")
                }
                const el2 = item.querySelector(".entity-icon")
                if (el2) {
                  el2.classList.add("up")
                  el2.classList.remove("down")
                }
              }
            }
          }
        }
        nul.classList.add("expanded")
        elI.classList.remove("up")
        elI.classList.add("down")
      }
    }
  }
  const parent = findParentNode(target, "LI")
  if (parent) {
    parent.classList.toggle("open")
  }
}
const cacheScript = new Map<string, string>()
function navigate(e: Event, ignoreLang?: boolean) {
  e.preventDefault()
  const target = e.target as HTMLElement
  const link = findParentNode(target, "A") as HTMLLinkElement
  const resource = getResource()
  if (link) {
    histories.push(window.location.origin + window.location.pathname + window.location.search)
    if (histories.length > historyMax) {
      histories.shift()
    }
    const search = window.location.search.length > 0 ? window.location.search.substring(1) : ""
    const lang = getField(search, "lang")
    let url = link.href
    if (!ignoreLang && lang.length > 0) {
      url = url + (url.indexOf("?") > 0 ? "&" : "?") + lang
    }
    const lang1 = lang.length > 0 && !ignoreLang ? "&" + lang : ""
    const newUrl = url + (url.indexOf("?") > 0 ? "&" : "?") + "partial=true" + lang1
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
                const span = link.querySelector("span")
                const title = span ? span.innerText : link.innerText
                window.history.pushState({ pageTitle: title }, "", url)
                pageBody.querySelectorAll("script").forEach((oldScript) => {
                  const isInitScript = oldScript.getAttribute("data-init-script")
                  if (isInitScript === "true") {
                    const newScript = document.createElement("script")
                    if (oldScript.src) {
                      // external script
                      newScript.src = oldScript.src
                    } else {
                      // inline script
                      newScript.textContent = oldScript.textContent
                    }
                    document.body.appendChild(newScript)
                    oldScript.remove()
                  } else {
                    const scriptId = oldScript.getAttribute("id")
                    if (scriptId && scriptId.length > 0) {
                      const loaded = cacheScript.get(scriptId)
                      if (!loaded) {
                        cacheScript.set(scriptId, "Y")
                        const newScript = document.createElement("script")
                        newScript.id = scriptId
                        if (oldScript.src) {
                          // external script
                          newScript.src = oldScript.src
                        } else {
                          // inline script
                          newScript.textContent = oldScript.textContent
                        }
                        document.body.appendChild(newScript)
                        oldScript.remove()
                      }
                    }
                  }
                })
                afterLoaded(pageBody)
                setTimeout(function () {
                  resources.load(pageBody)
                }, 0)
                setTimeout(function () {
                  const parent = findParentNode(target, "LI")
                  if (parent) {
                    const nav = findParentNode(parent, "NAV")
                    if (nav) {
                      let elI = nav.querySelector(".active")
                      if (elI) {
                        elI.classList.remove("active")
                      }
                      elI = nav.querySelector(".active")
                      if (elI) {
                        elI.classList.remove("active")
                      }
                      elI = nav.querySelector(".active")
                      if (elI) {
                        elI.classList.remove("active")
                      }
                    }
                    parent.classList.add("active")
                    const pp = parent.parentElement?.parentElement
                    if (pp && pp.nodeName === "LI") {
                      pp.classList.add("active")
                    }
                  }
                }, 0)
              }
              hideLoading()
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else {
          hideLoading()
          handleGetError(response, resource)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  }
}
function getFirstPath(url: string): string {
  const s = url.substring(8)
  const i = s.indexOf("/")
  if (i < 0 || s.length - i <= 1) {
    return "/"
  }
  const j = s.indexOf("/", i + 1)
  if (j > 0) {
    return s.substring(i, j)
  } else {
    return s.substring(i)
  }
}
