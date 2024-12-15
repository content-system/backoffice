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
function clearText(e: Event, name?: string) {
  const n = name && name.length > 0 ? name : "q"
  const btn = e.target as HTMLInputElement
  const q = getElement(btn.form, n) as HTMLInputElement
  if (q) {
    btn.hidden = true
    q.value = ""
  }
}
function clearMessage(e: Event) {
  const ele = e.target as HTMLInputElement
  if (ele && ele.parentElement) {
    removeClasses(ele.parentElement, ["alert-error", "alert-warning", "alert-info"])
    ele.parentElement.innerText = ""
  }
}
function qOnChange(e: Event) {
  const text = e.target as HTMLInputElement
  const form = text.form
  if (form) {
    const btn = form.querySelector(".btn-remove-text") as HTMLButtonElement
    if (btn) {
      btn.hidden = !(text.value.length > 0)
    }
  }
}
function toggleSearch(e: Event) {
  const btn = e.target as HTMLInputElement
  const form = btn.form
  if (form) {
    const advanceSearch = form.querySelector(".advance-search") as HTMLElement
    if (advanceSearch) {
      const onStatus = toggleClass(btn, "on")
      advanceSearch.hidden = !onStatus
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
function navigate(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLElement
  const link = findParentNode(target, "A") as HTMLLinkElement
  const resource = getResource()
  if (link) {
    const url = link.href
    fetch(url + "?partial=true", { method: "GET" })
      .then((response) => {
        if (response.ok) {
          response.text().then((data) => {
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
                  const elI = nav.querySelector(".active")
                  if (elI) {
                    elI.classList.remove("active")
                  }
                }
                parent.classList.add("active")
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
          alertError(resource.error_submit_failed, undefined, undefined, response.statusText)
        }
      })
      .catch((err) => {
        console.log("Error: " + err)
        alertError(resource.error_submitting_form, undefined, undefined, err)
      })
  }
}

window.onload = function () {
  setTimeout(function () {
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
    const sysNav = document.getElementById("sysNav") as HTMLElement
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
          }
          return
        }
      }
    }
  }, 50)
}
