"use strict"
function changeMenu() {
  const body = document.getElementById("sysBody")
  if (body) {
    body.classList.toggle("top-menu")
  }
}
function changeMode() {
  const body = document.getElementById("sysBody")
  if (body) {
    body.classList.toggle("dark")
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
function navigate(e) {
  e.preventDefault()
  const target = e.target
  const link = findParentNode(target, "A")
  const resource = getResource()
  if (link) {
    histories.push(window.location.origin + window.location.pathname + window.location.search)
    if (histories.length > historyMax) {
      histories.shift()
    }
    const url = link.href
    fetch(url + "?partial=true", { method: "GET", headers: getHeaders() })
      .then((response) => {
        if (response.ok) {
          response.text().then((data) => {
            var _a
            const pageBody = document.getElementById("pageBody")
            if (pageBody) {
              pageBody.innerHTML = data
              const span = link.querySelector("span")
              const title = span ? span.innerText : link.innerText
              window.history.pushState({ pageTitle: title }, "", url)
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
              const forms = pageBody.querySelectorAll("form")
              for (let i = 0; i < forms.length; i++) {
                registerEvents(forms[i])
              }
              setTimeout(function () {
                const msg = getHiddenMessage(forms, resources.hiddenMessage)
                if (msg && msg.length > 0) {
                  toast(msg)
                }
              }, 0)
            }
          })
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      })
      .catch((err) => {
        console.log("Error: " + err)
        alertError(resource.error_submitting_form, err)
      })
  }
}

window.onload = function () {
  setTimeout(function () {
    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * This onload function is called after the page is loaded. It registers form events to all forms on the page,
     * and also adds an active class to the main navigation link that is currently active.
     * @param {Event} e - The event object.
     */
    /******  0a1e4901-1840-48b6-8a28-7dfae29a70e3  *******/ var _a
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
