"use strict"
function clearText(e, name) {
  var n = name && name.length > 0 ? name : "q"
  var btn = e.target
  var q = getElement(btn.form, n)
  if (q) {
    btn.hidden = true
    q.value = ""
  }
}
function qOnChange(e) {
  var text = e.target
  var form = text.form
  if (form) {
    var btn = form.querySelector(".btn-remove-text")
    if (btn) {
      btn.hidden = !(text.value.length > 0)
    }
  }
}
function toggleSearch(e) {
  var btn = e.target
  var form = btn.form
  if (form) {
    var advanceSearch = form.querySelector(".advance-search")
    if (advanceSearch) {
      var onStatus = toggleClass(btn, "on")
      advanceSearch.hidden = !onStatus
    }
  }
}
var o = "object"
function trimNull(obj) {
  if (!obj || typeof obj !== o) {
    return obj
  }
  var keys = Object.keys(obj)
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i]
    var v = obj[key]
    if (v === null) {
      delete obj[key]
    } else if (Array.isArray(v) && v.length > 0) {
      var v1 = v[0]
      if (typeof v1 === o && !(v1 instanceof Date)) {
        for (var _a = 0, v_1 = v; _a < v_1.length; _a++) {
          var item = v_1[_a]
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
  var startParams = url.indexOf("?")
  return startParams !== -1 ? url.substring(0, startParams) : url
}
function getPrefix(url) {
  return url.indexOf("?") >= 0 ? "&" : "?"
}
function buildSearchUrl(ft, page, limit, fields) {
  if (!page || page.length === 0) {
    page = resources.page
  }
  if (!limit || limit.length === 0) {
    limit = resources.limit
  }
  if (!fields || fields.length === 0) {
    fields = resources.fields
  }
  var pageIndex = ft.page
  if (pageIndex && !isNaN(pageIndex) && pageIndex <= 1) {
    delete ft.page
  }
  var keys = Object.keys(ft)
  var url = "?" + resources.partial + "=true"
  for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
    var key = keys_2[_i]
    var objValue = ft[key]
    if (objValue) {
      if (key !== fields) {
        if (typeof objValue === "string" || typeof objValue === "number") {
          if (key === page) {
            if (objValue != 1) {
              url += getPrefix(url) + (key + "=" + objValue)
            }
          } else if (key === limit) {
            if (objValue != resources.defaultLimit) {
              url += getPrefix(url) + (key + "=" + objValue)
            }
          } else {
            url += getPrefix(url) + (key + "=" + encodeURIComponent(objValue))
          }
        } else if (typeof objValue === "object") {
          if (objValue instanceof Date) {
            url += getPrefix(url) + (key + "=" + objValue.toISOString())
          } else {
            if (Array.isArray(objValue)) {
              if (objValue.length > 0) {
                var strs = []
                for (var _a = 0, objValue_1 = objValue; _a < objValue_1.length; _a++) {
                  var subValue = objValue_1[_a]
                  if (typeof subValue === "string") {
                    strs.push(encodeURIComponent(subValue))
                  } else if (typeof subValue === "number") {
                    strs.push(subValue.toString())
                  }
                }
                url += getPrefix(url) + (key + "=" + strs.join(","))
              }
            } else {
              var keysLvl2 = Object.keys(objValue)
              for (var _b = 0, keysLvl2_1 = keysLvl2; _b < keysLvl2_1.length; _b++) {
                var key2 = keysLvl2_1[_b]
                var objValueLvl2 = objValue[key2]
                if (objValueLvl2) {
                  if (objValueLvl2 instanceof Date) {
                    url += getPrefix(url) + (key + "." + key2 + "=" + objValueLvl2.toISOString())
                  } else {
                    url += getPrefix(url) + (key + "." + key2 + "=" + encodeURIComponent(objValueLvl2))
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
  var i = search.indexOf(fieldName + "=")
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
  var j = search.indexOf("&", i + fieldName.length)
  return j >= 0 ? search.substring(0, i) + search.substring(j + 1) : search.substring(0, i - 1)
}
function changePage(e, partId) {
  e.preventDefault()
  var target = e.target
  var search = target.search
  if (search.length > 0) {
    search = search.substring(1)
  }
  search = removeField(search, resources.partial)
  search = removeField(search, resources.subPartial)
  var p = getField(search, resources.page)
  if (p === resources.page + "=1") {
    search = removeField(search, resources.page)
  }
  if (!partId) {
    var form = findParentNode(target, "FORM")
    if (form) {
      partId = form.getAttribute("data-part")
    }
  }
  var url = window.location.origin + window.location.pathname
  var sub = ""
  if (partId && partId.length > 0) {
    sub = "&" + resources.subPartial + "=true"
  }
  url = url + (search.length === 0 ? "?" + resources.partial + "=true" + sub : "?" + search + "&" + resources.partial + "=true" + sub)
  var newUrl = window.location.origin + window.location.pathname
  if (search.length > 0) {
    newUrl = newUrl + "?" + search
  }
  var resource = getResource()
  showLoading()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then(function (response) {
      if (response.ok) {
        response
          .text()
          .then(function (data) {
            var pageId = partId && partId.length > 0 ? partId : resources.pageBody
            var pageBody = document.getElementById(pageId)
            if (pageBody) {
              pageBody.innerHTML = data
              afterLoaded(pageBody)
            }
            window.history.pushState(undefined, "Title", newUrl)
            hideLoading()
          })
          .catch(function (err) {
            return handleError(err, resource.error_response_body)
          })
      } else {
        hideLoading()
        handleGetError(response, resource)
      }
    })
    .catch(function (err) {
      return handleError(err, resource.error_network)
    })
}
function search(e, partId) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  if (!partId) {
    partId = form.getAttribute("data-part")
  }
  var initFilter = decode(form)
  var filter = trimNull(initFilter)
  filter.page = 1
  var search = buildSearchUrl(filter)
  if (partId && partId.length > 0) {
    search = search + ("&" + resources.subPartial + "=true")
  }
  var url = getCurrentURL() + search
  var newUrl = getCurrentURL()
  if (search.length > 0) {
    var s = search.substring(1)
    s = removeField(s, resources.partial)
    s = removeField(s, resources.subPartial)
    if (s.length > 0) {
      newUrl = newUrl + "?" + s
    }
  }
  var resource = getResource()
  showLoading()
  fetch(url, {
    method: "GET",
    headers: getHeaders(),
  })
    .then(function (response) {
      if (response.ok) {
        response
          .text()
          .then(function (data) {
            var pageId = partId && partId.length > 0 ? partId : resources.pageBody
            var pageBody = document.getElementById(pageId)
            if (pageBody) {
              pageBody.innerHTML = data
              afterLoaded(pageBody)
            }
            window.history.pushState(undefined, "Title", newUrl)
            hideLoading()
          })
          .catch(function (err) {
            return handleError(err, resource.error_response_body)
          })
      } else {
        hideLoading()
        handleGetError(response, resource)
      }
    })
    .catch(function (err) {
      return handleError(err, resource.error_network)
    })
}
