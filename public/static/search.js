"use strict"
function clearText(e, name) {
  const n = name && name.length > 0 ? name : "q"
  const btn = e.target
  const q = getElement(btn.form, n)
  if (q) {
    btn.hidden = true
    q.value = ""
  }
}
function clearMessage(e) {
  const ele = e.target
  if (ele && ele.parentElement) {
    removeClasses(ele.parentElement, ["alert-error", "alert-warning", "alert-info"])
    ele.parentElement.innerText = ""
  }
}
function qOnChange(e) {
  const text = e.target
  const form = text.form
  if (form) {
    const btn = form.querySelector(".btn-remove-text")
    if (btn) {
      btn.hidden = !(text.value.length > 0)
    }
  }
}
function toggleSearch(e) {
  const btn = e.target
  const form = btn.form
  if (form) {
    const advanceSearch = form.querySelector(".advance-search")
    if (advanceSearch) {
      const onStatus = toggleClass(btn, "on")
      advanceSearch.hidden = !onStatus
    }
  }
}
const o = "object"
function trimNull(obj) {
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
function removeFormatUrl(url) {
  const startParams = url.indexOf("?")
  return startParams !== -1 ? url.substring(0, startParams) : url
}
function getPrefix(url) {
  return url.indexOf("?") >= 0 ? "&" : "?"
}
function buildSearchUrl(ft, page, limit, fields) {
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
  let url = "?partial=true"
  for (const key of keys) {
    const objValue = ft[key]
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
            url += getPrefix(url) + `${key}=${encodeURIComponent(objValue)}`
          }
        } else if (typeof objValue === "object") {
          if (objValue instanceof Date) {
            url += getPrefix(url) + `${key}=${objValue.toISOString()}`
          } else {
            if (Array.isArray(objValue)) {
              if (objValue.length > 0) {
                const strs = []
                for (const subValue of objValue) {
                  if (typeof subValue === "string") {
                    strs.push(encodeURIComponent(subValue))
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
                if (objValueLvl2) {
                  if (objValueLvl2 instanceof Date) {
                    url += getPrefix(url) + `${key}.${key2}=${objValueLvl2.toISOString()}`
                  } else {
                    url += getPrefix(url) + `${key}.${key2}=${encodeURIComponent(objValueLvl2)}`
                  }
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
function removeField(search, fieldName) {
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
function changePage(e) {
  e.preventDefault()
  const target = e.target
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
  showLoading()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then((response) => {
      if (response.ok) {
        response
          .text()
          .then((data) => {
            const pageBody = document.getElementById("pageBody")
            if (pageBody) {
              pageBody.innerHTML = data
              afterLoaded(pageBody)
            }
            window.history.pushState(undefined, "Title", newUrl)
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
function search(e) {
  e.preventDefault()
  const target = e.target
  const form = target.form
  const initFilter = decodeFromForm(form)
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
  showLoading()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then((response) => {
      if (response.ok) {
        response
          .text()
          .then((data) => {
            const pageBody = document.getElementById("pageBody")
            if (pageBody) {
              pageBody.innerHTML = data
              afterLoaded(pageBody)
            }
            window.history.pushState(undefined, "Title", newUrl)
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
