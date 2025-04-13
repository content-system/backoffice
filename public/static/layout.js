"use strict"
function changeMenu(e) {
  const body = document.getElementById("sysBody")
  if (body) {
    const menu = body.classList.toggle("top-menu")
    let ele = e.target
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement
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
function changeMode(e) {
  const body = document.getElementById("sysBody")
  if (body) {
    const dark = body.classList.toggle("dark")
    let ele = e.target
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement
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
function toggleMenu(e) {
  const p = findParent(e.target, "sidebar-parent")
  if (p) {
    p.classList.toggle("menu-on")
  }
}
function toggleUniversalSearch(e) {
  const p = findParent(e.target, "sidebar-parent")
  if (p) {
    p.classList.toggle("search")
  }
}
function toggleMenuItem(e) {
  e.preventDefault()
  let target = e.target
  const nul = target.nextElementSibling
  if (nul) {
    const elI = target.querySelector(".menu-item > i.entity-icon")
    if (elI) {
      if (nul.classList.contains("expanded")) {
        nul.classList.remove("expanded")
        elI.classList.add("up")
        elI.classList.remove("down")
      } else {
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
function getFirstPath(url) {
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
function navigate(e, ignoreLang) {
  e.preventDefault()
  const target = e.target
  const link = findParentNode(target, "A")
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
                afterLoaded(pageBody)
                setTimeout(function () {
                  var _a
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
                    const pp = (_a = parent.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement
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
window.onload = function () {
  setTimeout(function () {
    var _a
    const page = document.getElementById("pageContainer")
    if (page) {
      const forms = page.querySelectorAll("form")
      for (let i = 0; i < forms.length; i++) {
        registerEvents(forms[i])
      }
      setTimeout(function () {
        const msg = getHiddenMessage(forms, resources.hiddenMessage, 1)
        if (msg && msg.length > 0) {
          toast(msg)
        }
      }, 0)
    }
    const sysNav = document.getElementById("sysNav")
    if (sysNav) {
      const firstPath = getFirstPath(window.location.origin + window.location.pathname)
      const activePath = window.location.origin + firstPath
      const elA = sysNav.querySelectorAll("a")
      const l = elA.length
      for (let i = 0; i < l; i++) {
        if (elA[i].href === activePath) {
          const parent = elA[i].parentElement
          if (parent) {
            parent.classList.add("active")
            const pp = (_a = parent.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement
            if (pp && pp.nodeName === "LI") {
              pp.classList.add("active")
            }
          }
          return
        }
      }
    }
  }, 50)
}
