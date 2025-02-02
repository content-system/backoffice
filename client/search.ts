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

const o = "object"
function trimNull(obj: any): any {
  if (!obj || typeof obj !== o) {
    return obj
  }
  const keys = Object.keys(obj)
  for (const key of keys) {
    const v = obj[key]
    if (v === null) {
      delete obj[key]
    } else if (Array.isArray(v) && v.length > 0) {
      const v1 = v[0]
      if (typeof v1 === o && !(v1 instanceof Date)) {
        for (const item of v) {
          trimNull(item)
        }
      }
    } else if (typeof v === o && !(v instanceof Date)) {
      trimNull(obj[key])
    }
  }
  return obj
}
function removeFormatUrl(url: string): string {
  const startParams = url.indexOf("?")
  return startParams !== -1 ? url.substring(0, startParams) : url
}
interface Filter {
  page?: number
  limit?: number
  firstLimit?: number
  fields?: string[]
  sort?: string
}
function getPrefix(url: string): string {
  return url.indexOf("?") >= 0 ? "&" : "?"
}
function buildSearchUrl<F extends Filter>(ft: F, page?: string, limit?: string, fields?: string): string {
  if (!page || page.length === 0) {
    page = "page"
  }
  if (!limit || limit.length === 0) {
    limit = "limit"
  }
  if (!fields || fields.length === 0) {
    fields = "fields"
  }
  const pageIndex = ft.page
  if (pageIndex && !isNaN(pageIndex) && pageIndex <= 1) {
    delete ft.page
  }
  const keys = Object.keys(ft)
  // const currentUrl = window.location.host + window.location.pathname
  let url = "?partial=true"
  for (const key of keys) {
    const objValue = (ft as any)[key]
    if (objValue) {
      if (key !== fields) {
        if (typeof objValue === "string" || typeof objValue === "number") {
          if (key === page) {
            if (objValue != 1) {
              url += getPrefix(url) + `${key}=${objValue}`
            }
          } else if (key === limit) {
            if (objValue != resources.defaultLimit) {
              url += getPrefix(url) + `${key}=${objValue}`
            }
          } else {
            url += getPrefix(url) + `${key}=${objValue}`
          }
        } else if (typeof objValue === "object") {
          if (objValue instanceof Date) {
            url += getPrefix(url) + `${key}=${objValue.toISOString()}`
          } else {
            if (Array.isArray(objValue)) {
              if (objValue.length > 0) {
                const strs: string[] = []
                for (const subValue of objValue) {
                  if (typeof subValue === "string") {
                    strs.push(subValue)
                  } else if (typeof subValue === "number") {
                    strs.push(subValue.toString())
                  }
                }
                url += getPrefix(url) + `${key}=${strs.join(",")}`
              }
            } else {
              const keysLvl2 = Object.keys(objValue)
              for (const key2 of keysLvl2) {
                const objValueLvl2 = objValue[key2]
                if (objValueLvl2 instanceof Date) {
                  url += getPrefix(url) + `${key}.${key2}=${objValueLvl2.toISOString()}`
                } else {
                  url += getPrefix(url) + `${key}.${key2}=${objValueLvl2}`
                }
              }
            }
          }
        }
      }
    }
  }
  return url
}
function removeField(search: string, fieldName: string): string {
  let i = search.indexOf(fieldName + "=")
  if (i < 0) {
    return search
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
  return j >= 0 ? search.substring(0, i) + search.substring(j + 1) : search.substring(0, i - 1)
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
function changePage(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLAnchorElement

  let search = target.search
  if (search.length > 0) {
    search = search.substring(1)
  }
  search = removeField(search, "partial")
  const p = getField(search, "page")
  if (p === "page=1") {
    search = removeField(search, "page")
  }
  let url = window.location.origin + window.location.pathname
  url = url + (search.length === 0 ? "?partial=true" : "?" + search + "&partial=true")

  let newUrl = window.location.origin + window.location.pathname
  if (search.length > 0) {
    newUrl = newUrl + "?" + search
  }
  const resource = getResource()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((data) => {
          const pageBody = document.getElementById("pageBody")
          if (pageBody) {
            pageBody.innerHTML = data
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
          window.history.pushState(undefined, "Title", newUrl)
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

function search(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  const form = target.form as HTMLFormElement
  const initFilter = decodeFromForm<Filter>(form)
  const filter = trimNull(initFilter)
  filter.page = 1
  const search = buildSearchUrl(filter)
  const url = getCurrentURL() + search
  let newUrl = getCurrentURL()
  if (search.length > 0) {
    const s = removeField(search.substring(1), "partial")
    if (s.length > 0) {
      newUrl = newUrl + "?" + s
    }
  }
  const resource = getResource()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then((response) => {
      if (response.ok) {
        response.text().then((data) => {
          const pageBody = document.getElementById("pageBody")
          if (pageBody) {
            pageBody.innerHTML = data
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
          window.history.pushState(undefined, "Title", newUrl)
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
