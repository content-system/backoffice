"use strict"
function changeMenu(e) {
  var body = document.getElementById("sysBody")
  if (body) {
    var menu = body.classList.toggle("top-menu")
    var ele = e.target
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement
      }
      var attr = menu ? "data-sidebar" : "data-menu"
      var icon = menu ? "view_list" : "credit_card"
      var i = ele.querySelector("i")
      if (i) {
        i.innerText = icon
      }
      var text = ele.getAttribute(attr)
      if (text) {
        var span = ele.querySelector("span")
        if (span) {
          span.innerHTML = text
        }
      }
    }
  }
}
function changeMode(e) {
  var body = document.getElementById("sysBody")
  if (body) {
    var dark = body.classList.toggle("dark")
    var ele = e.target
    if (ele) {
      if (ele.nodeName !== "LI") {
        ele = ele.parentElement
      }
      var attr = dark ? "data-light" : "data-dark"
      var icon = dark ? "radio_button_checked" : "timelapse"
      var i = ele.querySelector("i")
      if (i) {
        i.innerText = icon
      }
      var text = ele.getAttribute(attr)
      if (text) {
        var span = ele.querySelector("span")
        if (span) {
          span.innerHTML = text
        }
      }
    }
  }
}
function toggleMenu(e) {
  var p = findParent(e.target, "sidebar-parent")
  if (p) {
    p.classList.toggle("menu-on")
  }
}
function toggleUniversalSearch(e) {
  var p = findParent(e.target, "sidebar-parent")
  if (p) {
    p.classList.toggle("search")
  }
}
function toggleMenuItem(e) {
  e.preventDefault()
  var target = e.target
  var nul = target.nextElementSibling
  if (nul) {
    var elI = target.querySelector(".menu-item > i.entity-icon")
    if (elI) {
      if (nul.classList.contains("expanded")) {
        nul.classList.remove("expanded")
        elI.classList.add("up")
        elI.classList.remove("down")
      } else {
        if (resources.autoCollapse) {
          var nav = findParentNode(target, "NAV")
          if (nav) {
            var items = nav.querySelectorAll(".open")
            var l = items.length
            for (var i = 0; i < l; i++) {
              var item = items[i]
              if (item) {
                item.classList.remove("open")
                var nu10 = item.querySelector(".expanded")
                if (nu10) {
                  nu10.classList.remove("expanded")
                }
                var el2 = item.querySelector(".entity-icon")
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
  var parent = findParentNode(target, "LI")
  if (parent) {
    parent.classList.toggle("open")
  }
}
var cacheScript = new Map()
function navigate(e, ignoreLang, partId) {
  e.preventDefault()
  var target = e.target
  var link = findParentNode(target, "A")
  var resource = getResource()
  if (link) {
    histories.push(window.location.origin + window.location.pathname + window.location.search)
    if (histories.length > historyMax) {
      histories.shift()
    }
    var search_1 = window.location.search.length > 0 ? window.location.search.substring(1) : ""
    var lang = getField(search_1, "lang")
    var url_1 = link.href
    var pageId_1 = resources.pageBody
    var sub = ""
    if (partId && partId.length > 0) {
      pageId_1 = partId
      sub = "&" + resources.subPartial + "=true"
    }
    var lang1 = lang.length > 0 && !ignoreLang ? "&" + lang : ""
    var newUrl = url_1 + (url_1.indexOf("?") > 0 ? "&" : "?") + (resources.partial + "=true" + sub) + lang1
    showLoading()
    fetch(newUrl, { method: "GET", headers: getHeaders() })
      .then(function (response) {
        if (response.ok) {
          response
            .text()
            .then(function (data) {
              var pageBody = document.getElementById(pageId_1)
              if (pageBody) {
                pageBody.innerHTML = data
                if (resources.refreshLoad) {
                  resources.load = undefined
                }
                var span = link.querySelector("span")
                var title = span ? span.innerText : link.innerText
                window.history.pushState({ pageTitle: title }, "", url_1)
                var tmpScript = document.getElementById("tmpScript")
                if (tmpScript) {
                  tmpScript.remove()
                }
                pageBody.querySelectorAll("script").forEach(function (oldScript) {
                  var isInitScript = oldScript.getAttribute("data-init-script")
                  if (isInitScript === "true") {
                    var newScript = document.createElement("script")
                    if (oldScript.src) {
                      newScript.src = oldScript.src
                    } else {
                      newScript.textContent = oldScript.textContent
                    }
                    newScript.id = "tmpScript"
                    document.body.appendChild(newScript)
                    oldScript.remove()
                  } else {
                    var scriptId = oldScript.getAttribute("id")
                    if (scriptId && scriptId.length > 0) {
                      var loaded = cacheScript.get(scriptId)
                      if (!loaded) {
                        cacheScript.set(scriptId, "Y")
                        var newScript = document.createElement("script")
                        newScript.id = scriptId
                        if (oldScript.src) {
                          newScript.src = oldScript.src
                        } else {
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
                  if (resources.load) {
                    resources.load(pageBody)
                  }
                }, 0)
                setTimeout(function () {
                  var _a
                  var parent = findParentNode(target, "LI")
                  if (parent) {
                    var nav = findParentNode(parent, "NAV")
                    if (nav) {
                      var elI = nav.querySelector(".active")
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
                    var pp = (_a = parent.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement
                    if (pp && pp.nodeName === "LI") {
                      pp.classList.add("active")
                    }
                  }
                }, 0)
              }
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
}
function getFirstPath(url) {
  var s = url.substring(8)
  var i = s.indexOf("/")
  if (i < 0 || s.length - i <= 1) {
    return "/"
  }
  var j = s.indexOf("/", i + 1)
  if (j > 0) {
    return s.substring(i, j)
  } else {
    return s.substring(i)
  }
}
