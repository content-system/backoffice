"use strict"
var resources = (function () {
  function resources() {}
  resources.autoCollapse = false
  resources.refreshLoad = true
  resources.login = "/login"
  resources.redirect = "redirectUrl"
  resources.defaultLimit = 12
  resources.max = 20
  resources.containerClass = "form-input"
  resources.pageBody = "pageBody"
  resources.hiddenMessage = "hidden-message"
  resources.token = "token"
  resources.partial = "partial"
  resources.subPartial = "sub"
  resources.page = "page"
  resources.limit = "limit"
  resources.fields = "fields"
  resources.num1 = / |,|\$|€|£|¥|'|٬|،| /g
  resources.num2 = / |\.|\$|€|£|¥|'|٬|،| /g
  resources.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i
  resources.phone = /^\d{5,14}$/
  resources.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  resources.url = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  resources.digit = /^\d+$/
  resources.amount = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/
  resources.digitAndDash = /^[0-9-]*$/
  resources.digitAndChar = /^\w*\d*$/
  resources.checkNumber = /^\d{0,8}$/
  resources.percentage = /^[1-9][0-9]?$|^100$/
  resources.ipv4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
  resources.usPostcode = /(^\d{5}$)|(^\d{5}-\d{4}$)/
  resources.caPostcode =
    /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/
  resources.ipv6 =
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
  return resources
})()
function getCurrentURL() {
  return window.location.origin + window.location.pathname
}
function removeLast(url) {
  var i = url.lastIndexOf("/")
  if (i > 0) {
    return url.substring(0, i)
  }
  return url
}
function getRedirect() {
  var loc = window.location.href
  if (loc.length < 8) {
    return ""
  }
  var i = loc.indexOf("/", 9)
  if (i < 0) {
    return ""
  }
  return loc.substring(i)
}
function buildLoginUrl() {
  var r = getRedirect()
  if (r.length === 0) {
    return resources.login
  } else {
    return resources.login + "?" + resources.redirect + "=" + encodeURIComponent(r)
  }
}
var eleHtml
var isGetHtml = false
function getLang() {
  if (!isGetHtml) {
    eleHtml = document.querySelector("html")
    isGetHtml = true
  }
  if (isGetHtml && eleHtml) {
    var lang = eleHtml.getAttribute("lang")
    if (lang && lang.length > 0) {
      return lang
    }
  }
  return undefined
}
function getToken() {
  if (resources.token && resources.token.length === 0) {
    var token = localStorage.getItem(resources.token)
    return token
  }
  return undefined
}
function getHeaders() {
  var header = {}
  var lang = getLang()
  if (lang) {
    header["Content-Language"] = lang
  }
  var token = getToken()
  if (token && token.length > 0) {
    header["Authorization"] = "Bearer " + token
  }
  return header
}
function handleGetError(response, resource) {
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
function handleError(err, msg) {
  hideLoading()
  console.log("Error: " + err)
  alertError(msg, err)
}
function removeParent(target) {
  var parent = target.parentElement
  if (parent) {
    parent.remove()
  }
}
var histories = []
var historyMax = 10
function goBack(partId) {
  var url = histories.pop()
  if (url) {
    var newUrl = url + (url.indexOf("?") >= 0 ? "&" : "?") + "partial=true"
    showLoading()
    fetch(newUrl, { method: "GET", headers: getHeaders() })
      .then(function (response) {
        if (response.ok) {
          response
            .text()
            .then(function (data) {
              var pageId = partId && partId.length > 0 ? partId : resources.pageBody
              var pageBody = document.getElementById(pageId)
              if (pageBody) {
                pageBody.innerHTML = data
                window.history.pushState({ pageTitle: "" }, "", url)
                afterLoaded(pageBody)
              }
              hideLoading()
            })
            .catch(function (err) {
              return handleError(err, resource.error_response_body)
            })
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  }
}
function getField(search, fieldName) {
  var i = search.indexOf(fieldName + "=")
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
  var j = search.indexOf("&", i + fieldName.length)
  return j >= 0 ? search.substring(i, j) : search.substring(i)
}
function findParent(e, className, nodeName) {
  if (!e) {
    return null
  }
  if (nodeName && e.nodeName === nodeName) {
    return e
  }
  var p = e
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
function findParentNode(e, nodeName) {
  if (!e) {
    return null
  }
  if (e.nodeName == nodeName || e.getAttribute("data-field")) {
    return e
  }
  var p = e
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
function toggleClass(e, className) {
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
function addClass(ele, className) {
  if (ele) {
    if (!ele.classList.contains(className)) {
      ele.classList.add(className)
      return true
    }
  }
  return false
}
function addClasses(ele, classes) {
  var count = 0
  if (ele) {
    for (var i = 0; i < classes.length; i++) {
      if (addClass(ele, classes[i])) {
        count++
      }
    }
  }
  return count
}
function removeClass(ele, className) {
  if (ele) {
    if (ele && ele.classList.contains(className)) {
      ele.classList.remove(className)
      return true
    }
  }
  return false
}
function removeClasses(ele, classes) {
  var count = 0
  if (ele) {
    for (var i = 0; i < classes.length; i++) {
      if (removeClass(ele, classes[i])) {
        count++
      }
    }
  }
  return count
}
function afterLoaded(pageBody) {
  if (pageBody) {
    setTimeout(function () {
      var forms = pageBody.querySelectorAll("form")
      for (var i = 0; i < forms.length; i++) {
        if (forms[i].getAttribute("aria-readonly") == "true") {
          setReadOnly(forms[i])
        } else {
          registerEvents(forms[i])
        }
      }
      var msg = getHiddenMessage(forms, resources.hiddenMessage)
      if (msg && msg.length > 0) {
        toast(msg)
      }
    }, 0)
  }
}
function setReadOnly(form) {
  var args = []
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i]
  }
  if (!form) {
    return
  }
  var len = form.length
  for (var i = 0; i < len; i++) {
    var ctrl = form[i]
    var name_1 = ctrl.getAttribute("name")
    var skip = false
    if (name_1 != null && name_1.length > 0 && name_1 !== "btnBack") {
      if (arguments.length > 1) {
        for (var j = 1; j < arguments.length; j++) {
          if (arguments[j] === name_1) {
            skip = true
          }
        }
      }
      if (skip === false) {
        var nodeName = ctrl.nodeName
        var type = ctrl.getAttribute("type")
        if (nodeName === "INPUT" && type !== null) {
          nodeName = type.toUpperCase()
        }
        if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && nodeName !== "SELECT") {
          switch (type) {
            case "checkbox":
              ctrl.disabled = true
              break
            case "radio":
              ctrl.disabled = true
              break
            default:
              ctrl.readOnly = true
          }
        } else {
          ctrl.disabled = true
        }
      }
    }
  }
}
function getHiddenMessage(nodes, name, i) {
  var index = i !== undefined && i >= 0 ? i : 0
  if (nodes.length > index) {
    var form = nodes[index]
    var n = name && name.length > 0 ? name : "hidden-message"
    var ele = form.querySelector("." + n)
    if (ele) {
      return ele.innerHTML
    }
  }
  return null
}
function getContainer(ele) {
  return findParent(ele, resources.containerClass, "LABEL")
}
function handleMaterialFocus(ele) {
  if (ele.disabled || ele.readOnly) {
    return
  }
  if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
    addClass(getContainer(ele), "focused")
  }
}
function materialOnFocus(event) {
  var ele = event.currentTarget
  if (ele.disabled || ele.readOnly) {
    return
  }
  setTimeout(function () {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      addClass(getContainer(ele), "focused")
    }
  }, 0)
}
function materialOnBlur(event) {
  var ele = event.currentTarget
  setTimeout(function () {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      removeClasses(getContainer(ele), ["focused", "focus"])
    }
  }, 0)
}
function registerEvents(form) {
  var len = form.length
  for (var i = 0; i < len; i++) {
    var ele = form[i]
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      var type = ele.getAttribute("type")
      if (type != null) {
        type = type.toLowerCase()
      }
      if (ele.nodeName === "INPUT" && (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset")) {
        continue
      } else {
        var parent_1 = ele.parentElement
        var required = ele.getAttribute("required")
        if (parent_1) {
          if (parent_1.nodeName === "LABEL" && required != null && required !== undefined && required != "false" && !parent_1.classList.contains("required")) {
            parent_1.classList.add("required")
          } else if (parent_1.classList.contains("form-group") || parent_1.classList.contains("field")) {
            var firstChild = parent_1.firstChild
            if (firstChild && firstChild.nodeName === "LABEL") {
              if (!firstChild.classList.contains("required")) {
                firstChild.classList.add("required")
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
var debounceTimer
function textChange(event, url) {
  var target = event.target
  if (target) {
    var keyword_1 = target.value.trim()
    var datalist_1 = target.list
    if (datalist_1) {
      if (keyword_1.length < 2) {
        datalist_1.innerHTML = ""
        return
      }
      var pw = datalist_1.getAttribute("data-keyword")
      if (!pw || !keyword_1.startsWith(pw)) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(function () {
          fetchList(keyword_1, url, datalist_1)
        }, 200)
      }
    }
  }
}
var controller
function fetchList(keyword, url, datalist) {
  if (controller) {
    controller.abort()
  }
  controller = new AbortController()
  fetch(url + "?q=" + encodeURIComponent(keyword) + "&max=" + resources.max, { signal: controller.signal })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("API error")
      }
      return response.json()
    })
    .then(function (data) {
      datalist.innerHTML = ""
      data.forEach(function (item) {
        var option = document.createElement("option")
        option.value = item
        datalist.appendChild(option)
      })
      datalist.setAttribute("data-keyword", keyword)
    })
    .catch(function (err) {
      console.error("Failed to load data:", err)
      datalist.innerHTML = ""
    })
}
