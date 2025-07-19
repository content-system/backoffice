var sysNo = document.getElementById("sysNo")
if (sysNo) {
  sysNo.addEventListener("click", function () {
    var sysAlert = document.getElementById("sysAlert")
    if (sysAlert) {
      sysAlert.style.display = "none"
    }
    var input = sysYes["activeElement"]
    if (input) {
      try {
        input.focus()
      } catch (err) {}
    }
    sysYes["activeElement"] = undefined
  })
}
var sysYes = document.getElementById("sysYes")
if (sysYes) {
  sysYes.addEventListener("click", function () {
    var sysAlert = document.getElementById("sysAlert")
    if (sysAlert) {
      sysAlert.style.display = "none"
    }
    var input = sysYes["activeElement"]
    if (input) {
      try {
        input.focus()
      } catch (err) {}
    }
    sysYes["activeElement"] = undefined
  })
}
var yesOnClick = function () {
  var sysAlert = document.getElementById("sysAlert")
  if (sysAlert) {
    sysAlert.style.display = "none"
  }
  if (window.fyesOnClick) {
    window.fyesOnClick()
  }
  var input = sysYes["activeElement"]
  if (input) {
    try {
      input.focus()
    } catch (err) {}
  }
  sysYes["activeElement"] = undefined
}
var noOnClick = function () {
  var sysAlert = document.getElementById("sysAlert")
  if (sysAlert) {
    sysAlert.style.display = "none"
  }
  if (window.fnoOnClick) {
    window.fnoOnClick()
  }
  var input = sysYes["activeElement"]
  if (input) {
    try {
      input.focus()
    } catch (err) {}
  }
  sysYes["activeElement"] = undefined
}
function fadeIn(ele, display) {
  ele.style.opacity = "0"
  ele.style.display = display || "block"
  ;(function fade() {
    var val = parseFloat(ele.style.opacity)
    val += 0.1
    if (!(val > 1)) {
      ele.style.opacity = val.toString()
      requestAnimationFrame(fade)
    }
  })()
}
function fadeOut(ele) {
  ele.style.opacity = "1"
  ;(function fade() {
    var val = parseFloat(ele.style.opacity)
    val = -0.1
    if (val < 0) {
      ele.style.display = "none"
    } else {
      requestAnimationFrame(fade)
    }
  })()
}
var sysToast = document.getElementById("sysToast")
function toast(msg) {
  sysToast.innerHTML = msg
  fadeIn(sysToast)
  setTimeout(function () {
    fadeOut(sysToast)
  }, 1340)
}
var sysLoading = document.getElementById("sysLoading")
function showLoading(isFirstTime) {
  if (sysLoading) {
    sysLoading.style.display = "block"
    if (isFirstTime) {
      sysLoading.classList.add("dark")
    } else {
      sysLoading.classList.remove("dark")
    }
  }
}
function hideLoading() {
  if (sysLoading) {
    sysLoading.style.display = "none"
  }
}
function escapeHTML(text) {
  if (!text) {
    return ""
  }
  var isIgnore = text.indexOf("<br />") >= 0
  if (text.indexOf('"') >= 0) {
    text = text.replace(/"/g, "&quot;")
  }
  if (text.indexOf("&") >= 0) {
    text = text.replace(/&/g, "&amp;")
  }
  if (text.indexOf(">") >= 0) {
    text = text.replace(/>/g, "&gt;")
  }
  if (text.indexOf("<") >= 0) {
    text = text.replace(/</g, "&lt;")
  }
  // Ignore escaping if </br> tag is present
  if (isIgnore) {
    text = text.replace(/&lt;br \/&gt;/g, "<br />")
  }
  return text
}
function showAlert(msg, header, type, iconType, btnLeftText, btnRightText, yesCallback, noCallback, detail) {
  var sysAlert = document.getElementById("sysAlert")
  var sysMessage = document.getElementById("sysMessage")
  var sysMessageHeader = document.getElementById("sysMessageHeader")
  var sysErrorDetail = document.getElementById("sysErrorDetail")
  var sysErrorDetailText = document.getElementById("sysErrorDetailText")
  var sysErrorDetailCaret = document.getElementById("sysErrorDetailCaret")
  // const sysYes = document.getElementById("sysYes") as HTMLElement
  // const sysNo = document.getElementById("sysNo") as HTMLElement
  if (type === "Alert") {
    btnRightText = btnRightText !== undefined ? btnRightText : sysYes.getAttribute("data-ok")
    if (!sysAlert.classList.contains("alert-only")) {
      sysAlert.classList.add("alert-only")
    }
  } else {
    btnLeftText = btnLeftText ? btnLeftText : sysNo.getAttribute("data-text")
    btnRightText = btnRightText !== undefined ? btnRightText : sysYes.getAttribute("data-text")
    sysAlert.classList.remove("alert-only")
  }
  if (sysErrorDetail && sysErrorDetailCaret && sysErrorDetailText) {
    if (!detail) {
      sysErrorDetailCaret.style.display = "none"
      sysErrorDetail.style.display = "none"
      sysErrorDetailText.innerHTML = ""
    } else {
      sysErrorDetailCaret.style.display = "inline-block"
      sysErrorDetail.style.display = "inline-block"
      sysErrorDetailText.innerHTML = escapeHTML(detail)
    }
  }
  sysMessage.innerHTML = escapeHTML(msg)
  sysMessageHeader.innerHTML = escapeHTML(header)
  sysAlert.classList.remove("success-icon", "success-icon", "info-icon", "confirm-icon", "danger-icon", "warning-icon")
  if (iconType === "Alert") {
    if (!sysAlert.classList.contains("warning-icon")) {
      sysAlert.classList.add("warning-icon")
    }
  } else if (iconType === "Success") {
    if (!sysAlert.classList.contains("success-icon")) {
      sysAlert.classList.add("success-icon")
    }
  } else if (iconType === "Info") {
    if (!sysAlert.classList.contains("info-icon")) {
      sysAlert.classList.add("info-icon")
    }
  } else if (iconType === "Confirm") {
    if (!sysAlert.classList.contains("confirm-icon")) {
      sysAlert.classList.add("confirm-icon")
    }
  } else if (iconType === "Warning") {
    if (!sysAlert.classList.contains("warning-icon")) {
      sysAlert.classList.add("warning-icon")
    }
  } else if (iconType === "Error") {
    if (!sysAlert.classList.contains("danger-icon")) {
      sysAlert.classList.add("danger-icon")
    }
  }
  var activeElement = window.document.activeElement
  sysYes.innerHTML = escapeHTML(btnRightText)
  sysNo.innerHTML = escapeHTML(btnLeftText)
  sysYes["activeElement"] = activeElement
  sysAlert.style.display = "flex"
  window.fyesOnClick = yesCallback
  window.fnoOnClick = noCallback
  sysYes.focus()
}
var sysMessageHeader = document.getElementById("sysMessageHeader")
function showConfirm(msg, yesCallback, header, btnLeftText, btnRightText, noCallback) {
  var h = header ? header : sysMessageHeader.getAttribute("data-confirm")
  showAlert(msg, h, "Confirm", "Confirm", btnLeftText, btnRightText, yesCallback, noCallback)
}
function alertError(msg, detail, callback, header) {
  var h = header ? header : sysMessageHeader.getAttribute("data-error")
  var buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Error", "", buttonText, callback, undefined, detail)
}
function alertWarning(msg, callback, header) {
  var h = header ? header : sysMessageHeader.getAttribute("data-warning")
  var buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Warning", "", buttonText, callback, undefined)
}
function alertInfo(msg, callback, header) {
  var h = header ? header : sysMessageHeader.getAttribute("data-info")
  var buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Info", "", buttonText, callback, undefined)
}
function alertSuccess(msg, callback, header) {
  var h = header ? header : sysMessageHeader.getAttribute("data-success")
  var buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Success", "", buttonText, callback, undefined)
}

// tslint:disable-next-line:class-name
var resources = /** @class */ (function () {
  function resources() {}
  resources.load = function (pageBody) {}
  resources.login = "/login"
  resources.redirect = "redirectUrl"
  resources.defaultLimit = 12
  resources.containerClass = "form-input"
  resources.hiddenMessage = "hidden-message"
  resources.token = "token"
  resources.num1 = / |,|\$|€|£|¥|'|٬|،| /g
  resources.num2 = / |\.|\$|€|£|¥|'|٬|،| /g
  resources.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i
  resources.phone = /^\d{5,14}$/
  resources.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  resources.url = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
  resources.digit = /^\d+$/
  resources.amount = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/ // const regExp = /\d+\.\d+/;
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
  var token = localStorage.getItem(resources.token)
  return token
}
function getHeaders() {
  var token = getToken()
  var lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return { "Content-Language": lang, Authorization: "Bearer " + token } // Include the JWT
    } else {
      return { "Content-Language": lang }
    }
  } else {
    if (token && token.length > 0) {
      return { Authorization: "Bearer " + token } // Include the JWT
    } else {
      return {}
    }
  }
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
var histories = []
var historyMax = 10
function goBack() {
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
              var pageBody = document.getElementById("pageBody")
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
        registerEvents(forms[i])
      }
      var msg = getHiddenMessage(forms, resources.hiddenMessage)
      if (msg && msg.length > 0) {
        toast(msg)
      }
    }, 0)
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
          if (
            parent_1.nodeName === "LABEL" &&
            // tslint:disable-next-line:triple-equals
            required != null &&
            required !== undefined &&
            required != "false" &&
            !parent_1.classList.contains("required")
          ) {
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

function addErrorMessage(ele, msg, directParent) {
  if (!ele) {
    return
  }
  if (!msg) {
    msg = "Error"
  }
  addClass(ele, "invalid")
  // addClass(ele, "ng-touched")
  var parent = directParent ? ele.parentElement : getContainer(ele)
  if (parent === null) {
    return
  }
  addClass(parent, "invalid")
  var span = parent.querySelector(".span-error")
  if (span) {
    if (span.innerHTML !== msg) {
      span.innerHTML = msg
    }
  } else {
    var spanError = document.createElement("span")
    spanError.classList.add("span-error")
    spanError.innerHTML = msg
    parent.appendChild(spanError)
  }
}
function showFormError(form, errors, focusFirst, directParent, includeId) {
  if (!form || !errors || errors.length === 0) {
    return []
  }
  var errorCtrl = null
  var errs = []
  var length = errors.length
  var len = form.length
  for (var i = 0; i < length; i++) {
    var hasControl = false
    for (var j = 0; j < len; j++) {
      var ele = form[j]
      var dataField = ele.getAttribute("data-field")
      if (dataField === errors[i].field || ele.name === errors[i].field) {
        addErrorMessage(ele, errors[i].message, directParent)
        hasControl = true
        if (!errorCtrl) {
          errorCtrl = ele
        }
      }
    }
    if (hasControl === false) {
      if (includeId) {
        var ele = document.getElementById(errors[i].field)
        if (ele) {
          addErrorMessage(ele, errors[i].message, directParent)
        } else {
          errs.push(errors[i])
        }
      } else {
        errs.push(errors[i])
      }
    }
  }
  if (focusFirst !== false) {
    focusFirst = true
  }
  if (errorCtrl && focusFirst === true) {
    errorCtrl.focus()
    errorCtrl.scrollIntoView()
  }
  return errs
}
var errorArr = ["valid", "invalid", "ng-invalid", "ng-touched"]
function removeError(ele, directParent) {
  if (!ele) {
    return
  }
  removeClasses(ele, errorArr)
  var parent = directParent ? ele.parentElement : getContainer(ele)
  if (parent) {
    removeClasses(parent, errorArr)
    var span = parent.querySelector(".span-error")
    if (span !== null && span !== undefined) {
      parent.removeChild(span)
    }
  }
}
function removeErrors(form) {
  if (form) {
    var len = form.length
    for (var i = 0; i < len; i++) {
      var ele = form[i]
      removeError(ele)
    }
  }
}
// tslint:disable-next-line:class-name
var formatter = /** @class */ (function () {
  function formatter() {}
  formatter.removePhoneFormat = function (phone) {
    if (phone) {
      return phone.replace(formatter.phone, "")
    } else {
      return phone
    }
  }
  formatter.removeFaxFormat = function (fax) {
    if (fax) {
      return fax.replace(formatter.phone, "")
    } else {
      return fax
    }
  }
  formatter.formatPhone = function (phone) {
    if (!phone) {
      return ""
    }
    // reformat phone number
    // 555 123-4567 or (+1) 555 123-4567
    var s = phone
    var x = formatter.removePhoneFormat(phone)
    if (x.length === 10) {
      var USNumber = x.match(formatter.usPhone)
      if (USNumber != null) {
        s = USNumber[1] + " " + USNumber[2] + "-" + USNumber[3]
      }
    } else if (x.length <= 3 && x.length > 0) {
      s = x
    } else if (x.length > 3 && x.length < 7) {
      s = x.substring(0, 3) + " " + x.substring(3, x.length)
    } else if (x.length >= 7 && x.length < 10) {
      s = x.substring(0, 3) + " " + x.substring(3, 6) + "-" + x.substring(6, x.length)
    } else if (x.length >= 11) {
      var l = x.length
      s = x.substring(0, l - 7) + " " + x.substring(l - 7, l - 4) + "-" + x.substring(l - 4, l)
      // formatedPhone = `(+${phoneNumber.charAt(0)}) ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length - 1)}`;
    }
    return s
  }
  formatter.formatFax = function (fax) {
    if (!fax) {
      return ""
    }
    // reformat phone number
    // 035-456745 or 02-1234567
    var s = fax
    var x = formatter.removePhoneFormat(fax)
    var l = x.length
    if (l <= 6) {
      s = x
    } else {
      if (x.substring(0, 2) !== "02") {
        if (l <= 9) {
          s = x.substring(0, l - 6) + "-" + x.substring(l - 6, l)
        } else {
          s = x.substring(0, l - 9) + "-" + x.substring(l - 9, l - 6) + "-" + x.substring(l - 6, l)
        }
      } else {
        if (l <= 9) {
          s = x.substring(0, l - 7) + "-" + x.substring(l - 7, l)
        } else {
          s = x.substring(0, l - 9) + "-" + x.substring(l - 9, l - 7) + "-" + x.substring(l - 7, l)
        }
      }
    }
    return s
  }
  // private static _preg = / |\+|\-|\.|\(|\)/g;
  formatter.phone = / |\-|\.|\(|\)/g
  formatter.usPhone = /(\d{3})(\d{3})(\d{4})/
  return formatter
})()
// tslint:disable-next-line:class-name
var tel = /** @class */ (function () {
  function tel() {}
  tel.isPhone = function (str) {
    if (!str || str.length === 0 || str === "+") {
      return false
    }
    if (str.charAt(0) !== "+") {
      return resources.phone.test(str)
    } else {
      var phoneNumber = str.substring(1)
      if (!resources.phonecodes) {
        return resources.phone.test(phoneNumber)
      } else {
        if (resources.phone.test(phoneNumber)) {
          for (var degit = 1; degit <= 3; degit++) {
            var countryCode = phoneNumber.substring(0, degit)
            if (countryCode in resources.phonecodes) {
              return true
            }
          }
          return false
        } else {
          return false
        }
      }
    }
  }
  tel.isFax = function (fax) {
    return tel.isPhone(fax)
  }
  return tel
})()
function isPhone(str) {
  return tel.isPhone(str)
}
function isFax(str) {
  return tel.isFax(str)
}
function isUrl(url) {
  if (!url || url.length === 0) {
    return false
  }
  return resources.url.test(url)
}
function isEmail(email) {
  if (!email || email.length === 0) {
    return false
  }
  return resources.email.test(email)
}
function isUsername(username) {
  if (!username || username.length === 0) {
    return false
  }
  var valid = resources.email.test(username)
  if (valid) {
    return valid
  }
  return resources.email.test(username + "@gmail.com")
}
function isPercentage(v) {
  return resources.percentage.test(v)
}
function isIPv6(ipv6) {
  if (!ipv6 || ipv6.length === 0) {
    return false
  }
  return resources.ipv6.test(ipv6)
}
function isIPv4(ipv4) {
  if (!ipv4 || ipv4.length === 0) {
    return false
  }
  return resources.ipv4.test(ipv4)
}
function isEmpty(str) {
  return !str || str === ""
}
function isValidPattern(v, pattern, flags) {
  if (!isEmpty(pattern)) {
    if (flags === null) {
      flags = undefined
    }
    var p = new RegExp(pattern, flags)
    return p.test(v)
  } else {
    return false
  }
}
function isValidCode(str) {
  return resources.digitAndChar.test(str)
}
function isDashCode(str) {
  if (!str || str.length === 0) {
    return false
  }
  var len = str.length - 1
  for (var i = 0; i <= len; i++) {
    var chr = str.charAt(i)
    if (!((chr >= "0" && chr <= "9") || (chr >= "A" && chr <= "Z") || (chr >= "a" && chr <= "z") || chr === "-")) {
      return false
    }
  }
  return true
}
function isDigitOnly(v) {
  if (!v) {
    return false
  }
  return resources.digit.test(v)
}
function isDashDigit(v) {
  return resources.digitAndDash.test(v)
}
function isCheckNumber(v) {
  return resources.checkNumber.test(v)
}
function isAmountNumber(v) {
  return resources.amount.test(v)
}
function isUSPostalCode(postcode) {
  return resources.usPostcode.test(postcode)
}
function isCAPostalCode(postcode) {
  return resources.caPostcode.test(postcode)
}
function format() {
  var args = []
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i]
  }
  var formatted = args[0]
  if (!formatted || formatted === "") {
    return ""
  }
  if (args.length > 1 && Array.isArray(args[1])) {
    var params = args[1]
    for (var i = 0; i < params.length; i++) {
      var regexp = new RegExp("\\{" + i + "\\}", "gi")
      formatted = formatted.replace(regexp, params[i])
    }
  } else {
    for (var i = 1; i < args.length; i++) {
      var regexp = new RegExp("\\{" + (i - 1) + "\\}", "gi")
      formatted = formatted.replace(regexp, args[i])
    }
  }
  return formatted
}
function getLabel(ele) {
  if (!ele) {
    return ""
  }
  var l = ele.getAttribute("data-label")
  if (l) {
    return l
  }
  var parent = getContainer(ele)
  if (parent) {
    if (parent.nodeName === "LABEL") {
      var first = parent.childNodes[0]
      if (first.nodeType === 3) {
        return first.nodeValue ? first.nodeValue : ""
      }
    } else {
      var firstChild = parent.firstChild
      if (firstChild && firstChild.nodeName === "LABEL") {
        return firstChild.innerHTML
      }
    }
  }
  return ""
}
function checkRequiredElements(form, names) {
  var resource = getResource()
  var eleMsg = form.querySelector(".message")
  if (eleMsg) {
    for (var i = 0; i < names.length; i++) {
      var ele = getElement(form, names[i])
      if (ele) {
        if (ele.value === "") {
          var label = getLabel(ele)
          var msg = format(resource.error_required, label)
          showErrorMessage(eleMsg, msg)
          return false
        }
      }
    }
  }
  return true
}
function checkRequired(ele, label, r) {
  var value = ele.value
  if (ele.required) {
    if (value.length === 0) {
      if (!label) {
        label = getLabel(ele)
      }
      var resource_1 = r ? r : getResource()
      var msg = format(resource_1.error_required, label)
      addErrorMessage(ele, msg)
      return msg
    }
  }
  return null
}
function checkMaxLength(ele, label, r) {
  if (ele.maxLength >= 0 && ele.value.length > ele.maxLength) {
    if (!label) {
      label = getLabel(ele)
    }
    var resource_2 = r ? r : getResource()
    var msg = format(resource_2.error_maxlength, label, ele.maxLength)
    addErrorMessage(ele, msg)
    return msg
  }
  return null
}
function checkMinLength(ele, label, r) {
  if (ele.minLength >= 0 && ele.value.length < ele.minLength) {
    if (!label) {
      label = getLabel(ele)
    }
    var resource_3 = r ? r : getResource()
    var msg = format(resource_3.error_minlength, label, ele.maxLength)
    addErrorMessage(ele, msg)
    return msg
  }
  return null
}
function validOnBlur(event) {
  var ele = event.target
  if (!ele || ele.readOnly || ele.disabled) {
    return
  }
  materialOnBlur(event)
  removeError(ele)
}
function requiredOnBlur(event) {
  var ele = event.target
  if (!ele || ele.readOnly || ele.disabled) {
    return
  }
  materialOnBlur(event)
  removeError(ele)
  setTimeout(function () {
    ele.value = ele.value.trim()
    checkRequired(ele)
  }, 40)
}
function checkOnBlur(event, key, check, formatF) {
  var ele = event.currentTarget
  if (!ele || ele.readOnly || ele.disabled) {
    return
  }
  materialOnBlur(event)
  removeError(ele)
  setTimeout(function () {
    ele.value = ele.value.trim()
    var label = getLabel(ele)
    var resource = getResource()
    if (checkRequired(ele, label, resource) || checkMinLength(ele, label, resource) || checkMaxLength(ele, label, resource)) {
      return
    }
    var value = ele.value
    if (formatF) {
      value = formatF(value)
    }
    if (value.length > 0 && !check(value)) {
      var msg = format(resource[key], label, ele.maxLength)
      addErrorMessage(ele, msg)
    }
  }, 40)
}
function emailOnBlur(event) {
  checkOnBlur(event, "error_email", isEmail)
}
function urlOnBlur(event) {
  checkOnBlur(event, "error_url", isUrl)
}
function phoneOnBlur(event) {
  checkOnBlur(event, "error_phone", tel.isPhone, formatter.removePhoneFormat)
}
function faxOnBlur(event) {
  checkOnBlur(event, "error_fax", tel.isFax, formatter.removeFaxFormat)
}
function ipv4OnBlur(event) {
  checkOnBlur(event, "error_ipv4", isIPv4)
}
function ipv6OnBlur(event) {
  checkOnBlur(event, "error_ipv6", isIPv6)
}
function patternOnBlur(event) {
  var ele = event.currentTarget
  if (!ele || ele.readOnly || ele.disabled) {
    return
  }
  materialOnBlur(event)
  removeError(ele)
  setTimeout(function () {
    ele.value = ele.value.trim()
    if (checkRequired(ele)) {
      return
    }
    var value = ele.value
    if (value.length > 0 && ele.pattern && ele.pattern.length > 0) {
      var flags = ele.getAttribute("data-flags")
      if (!isValidPattern(value, ele.pattern, flags)) {
        var msg = ele.getAttribute("data-error-message")
        if (!msg) {
          msg = "Pattern Error"
        }
        addErrorMessage(ele, msg)
      }
    }
  }, 40)
}
function dateOnBlur(event, dateOnly) {
  var target = event.currentTarget
  if (!target || target.readOnly || target.disabled) {
    return true
  }
  materialOnBlur(event)
  removeError(target)
  var label = getLabel(target)
  var resource = getResource()
  checkDate(target, label, resource, dateOnly)
}
function checkDate(ele, label, resource, dateOnly) {
  var v = new Date(ele.value)
  if (isNaN(v.getTime())) {
    var msg = format(resource.error_date, label)
    addErrorMessage(ele, msg)
    return msg
  } else {
    if (ele.min.length > 0) {
      if (ele.min === "now") {
        var d_1 = new Date()
        if (v < d_1) {
          if (v < d_1) {
            var msg = format(resource.error_from_now, label)
            addErrorMessage(ele, msg)
            return msg
          }
        }
      } else if (ele.min === "tomorrow") {
        var d_2 = addDays(trimTime(new Date()), 1)
        if (v < d_2) {
          var msg = format(resource.error_from_tomorrow, label)
          addErrorMessage(ele, msg)
          return msg
        }
      } else {
        var d_3 = new Date(ele.min)
        if (!isNaN(d_3.getTime())) {
          var v2 = dateOnly ? formatDate(d_3, "YYYY-MM-DD") : formatLongDateTime(d_3, "YYYY-MM-DD")
          var msg = format(resource.error_from, label, v2)
          addErrorMessage(ele, msg)
          return msg
        }
      }
    }
    if (ele.max.length > 0) {
      if (ele.max === "now") {
        var d_4 = new Date()
        if (v < d_4) {
          if (v < d_4) {
            var msg = format(resource.error_after_now, label)
            addErrorMessage(ele, msg)
            return msg
          }
        }
      } else if (ele.max === "tomorrow") {
        var d_5 = addDays(trimTime(new Date()), 1)
        if (v < d_5) {
          var msg = format(resource.error_after_tomorrow, label)
          addErrorMessage(ele, msg)
          return msg
        }
      } else {
        var d_6 = new Date(ele.max)
        if (!isNaN(d_6.getTime())) {
          var v2 = dateOnly ? formatDate(d_6, "YYYY-MM-DD") : formatLongDateTime(d_6, "YYYY-MM-DD")
          var msg = format(resource.error_after, label, v2)
          addErrorMessage(ele, msg)
          return msg
        }
      }
    }
    var minField = ele.getAttribute("min-field")
    if (minField && minField.length > 0) {
      var form = ele.form
      if (form) {
        var minElement = getElement(form, minField)
        if (minElement && minElement.value.length > 0) {
          var min = new Date(minElement.value)
          if (v < min) {
            var minLabel = getLabel(minElement)
            var msg = format(resource.error_from, label, minLabel)
            addErrorMessage(minElement, msg)
            return msg
          }
        }
      }
    }
  }
  return null
}
function isCommaSeparator(locale) {
  if (!locale) {
    return false
  }
  return typeof locale === "string" ? locale !== "." : locale.decimalSeparator !== "."
}
function correctNumber(v, locale, keepFormat) {
  var l = v.length
  if (l === 0) {
    return v
  }
  var arr = []
  var i = 0
  if ((v[i] >= "0" && v[i] <= "9") || v[i] === "-") {
    arr.push(v[i])
  }
  if (l === 1) {
    return arr.join("")
  }
  var separator = "."
  if (isCommaSeparator(locale)) {
    separator = ","
    v = v.replace(resources.num2, "")
  } else {
    v = v.replace(resources.num1, "")
  }
  for (i = 1; i < l; i++) {
    if ((v[i] >= "0" && v[i] <= "9") || v[i] == separator) {
      arr.push(v[i])
    }
  }
  var r = arr.join("")
  if (keepFormat) {
    return r
  }
  if (r.indexOf(",") >= 0) {
    r = r.replace(",", ".")
  }
  return r
}
function numberOnFocus(event) {
  var ele = event.currentTarget
  handleMaterialFocus(ele)
  if (ele.readOnly || ele.disabled || ele.value.length === 0) {
    return
  } else {
    var separator = getDecimalSeparator(ele)
    var v = correctNumber(ele.value, separator, true)
    if (v !== ele.value) {
      ele.value = v
    }
  }
}
function validateMinMax(ele, n, label, resource, locale) {
  if (ele.min.length > 0) {
    var min = parseFloat(ele.min)
    if (n < min) {
      var msg = format(resource.error_min, label, min)
      if (ele.max.length > 0) {
        var max = parseFloat(ele.max)
        if (max === min) {
          msg = format(resource.error_equal, label, max)
        }
      }
      addErrorMessage(ele, msg)
      return false
    }
  }
  if (ele.max.length > 0) {
    var max = parseFloat(ele.max)
    if (n > max) {
      var msg = format(resource.error_max, label, max)
      addErrorMessage(ele, msg)
      return false
    }
  }
  var minField = ele.getAttribute("min-field")
  if (minField && minField.length > 0) {
    var form = ele.form
    if (form) {
      var minElement = getElement(form, minField)
      if (minElement) {
        var smin2 = correctNumber(minElement.value, locale) // const smin2 = minElement.value.replace(this._nreg, '');
        if (smin2.length > 0 && !isNaN(smin2)) {
          var min2 = parseFloat(smin2)
          if (n < min2) {
            var minLabel = getLabel(minElement)
            var msg = format(resource.error_min, label, minLabel)
            addErrorMessage(ele, msg)
            return false
          }
        }
      }
    }
  }
  return true
}
function checkNumberEvent(event, locale) {
  var target = event.currentTarget
  if (!target || target.readOnly || target.disabled) {
    return true
  }
  materialOnBlur(event)
  removeError(target)
  target.value = target.value.trim()
  return checkNumber(target, locale)
}
function checkNumber(target, locale, r) {
  var value = correctNumber(target.value, locale)
  var label = getLabel(target)
  if (checkRequired(target, label)) {
    return false
  }
  var resource = r ? r : getResource()
  if (value.length > 0) {
    if (isNaN(value)) {
      var msg = format(resource.error_number, label)
      addErrorMessage(target, msg)
      return false
    } else if (target.getAttribute("data-type") === "integer") {
      var msg = format(resource.error_integer, label)
      addErrorMessage(target, msg)
      return false
    }
    var n = parseFloat(value)
    if (!validateMinMax(target, n, label, resource, locale)) {
      return false
    }
    removeError(target)
    return value
  }
  return true
}
function checkNumberOnBlur(event) {
  var target = event.currentTarget
  var separator = target.getAttribute("data-decimal-separator")
  var v = checkNumberEvent(event, separator)
  if (typeof v === "string") {
    target.value = v
  }
}
function numberOnBlur(event) {
  var target = event.currentTarget
  var separator = target.getAttribute("data-decimal-separator")
  var v = checkNumberEvent(event, separator)
  if (typeof v === "string") {
    var attr = target.getAttribute("data-scale")
    var scale = attr && attr.length > 0 ? parseInt(attr, 10) : undefined
    var n = parseFloat(v)
    target.value = formatNumber(n, scale, separator)
  }
}
function currencyOnBlur(event) {
  var target = event.currentTarget
  var separator = target.getAttribute("data-decimal-separator")
  var v = checkNumberEvent(event, separator)
  if (typeof v === "string") {
    var attr = target.getAttribute("data-scale")
    var scale = attr && attr.length > 0 ? parseInt(attr, 10) : undefined
    var n = parseFloat(v)
    var value = formatNumber(n, scale, separator)
    target.value = formatCurrency(value, target)
  }
}
function formatCurrency(v, ele) {
  var symbol = ele.getAttribute("data-currency-symbol")
  if (!symbol) {
    return v
  } else {
    var pattern = ele.getAttribute("data-currency-pattern")
    if (!pattern) {
      return symbol + v
    } else if (pattern === "1") {
      return v + symbol
    } else if (pattern === "2") {
      return symbol + " " + v
    } else if (pattern === "3") {
      return v + " " + symbol
    } else {
      return symbol + v
    }
  }
}
function formatNumber(v, scale, d, g) {
  if (!v) {
    return ""
  }
  if (!d && !g) {
    g = ","
    d = "."
  } else if (!g) {
    g = d === "," ? "." : ","
  }
  var s = scale === 0 || scale ? v.toFixed(scale) : v.toString()
  var x = s.split(".", 2)
  var y = x[0]
  var arr = []
  var len = y.length - 1
  for (var k = 0; k < len; k++) {
    arr.push(y[len - k])
    if ((k + 1) % 3 === 0) {
      arr.push(g)
    }
  }
  arr.push(y[0])
  if (x.length === 1) {
    return arr.reverse().join("")
  } else {
    return arr.reverse().join("") + d + x[1]
  }
}
function validateOnBlur(event, includeReadOnly) {
  var target = event.target
  if (!target || (target.readOnly && includeReadOnly === false) || target.disabled || target.hidden || target.style.display === "none") {
    return
  }
  materialOnBlur(event)
  removeError(target)
  validateElement(event.target, undefined, includeReadOnly)
}
function validateElement(ele, locale, includeReadOnly) {
  if (!ele) {
    return null
  }
  if (!ele || (ele.readOnly && includeReadOnly === false) || ele.disabled || ele.hidden || ele.style.display === "none") {
    return null
  }
  var nodeName = ele.nodeName
  if (nodeName === "INPUT") {
    var type = ele.getAttribute("type")
    if (type !== null) {
      nodeName = type.toUpperCase()
    }
  }
  if (ele.tagName === "SELECT") {
    nodeName = "SELECT"
  }
  if (nodeName === "BUTTON" || nodeName === "RESET" || nodeName === "SUBMIT") {
    return null
  }
  var parent = getContainer(ele)
  if (parent) {
    if (parent.hidden || parent.style.display === "none") {
      return null
    } else {
      var p = findParent(parent, "SECTION")
      if (p && (p.hidden || p.style.display === "none")) {
        return null
      }
    }
  }
  var value = ele.value
  var label = getLabel(ele)
  var resource = getResource()
  var msg0 = checkRequired(ele, label, resource)
  if (msg0) {
    return msg0
  }
  msg0 = checkMinLength(ele, label, resource)
  if (msg0) {
    return msg0
  }
  msg0 = checkMaxLength(ele, label, resource)
  if (msg0) {
    return msg0
  }
  if (!value || value === "") {
    return null
  }
  var ctype = ele.getAttribute("type")
  if (ctype) {
    ctype = ctype.toLowerCase()
  }
  var datatype = ele.getAttribute("data-type")
  if (ctype === "email") {
    datatype = "email"
  } else if (ctype === "url") {
    datatype = "url"
  } else if (!datatype) {
    if (ctype === "number") {
      datatype = "number"
    } else if (ctype === "date" || ctype === "datetime-local") {
      datatype = "date"
    }
  }
  if (ele.pattern && ele.pattern.length > 0) {
    var flags = ele.getAttribute("data-flags")
    if (!isValidPattern(value, ele.pattern, flags)) {
      var msg = ele.getAttribute("data-error-message")
      if (!msg) {
        msg = "Pattern Error"
      }
      addErrorMessage(ele, msg)
      return msg
    }
  }
  if (datatype === "email") {
    if (value.length > 0 && !isEmail(value)) {
      var msg = format(resource.error_email, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "number" || datatype === "integer" || datatype === "currency" || datatype === "string-currency" || datatype === "percentage") {
    var v = checkNumber(ele, locale, resource)
    var separator = getDecimalSeparator(ele)
    if (typeof v === "string") {
      var attr = ele.getAttribute("data-scale")
      var scale = attr && attr.length > 0 ? parseInt(attr, 10) : undefined
      var n = parseFloat(v)
      if (datatype === "currency" || datatype === "string-currency") {
        ele.value = formatCurrency(value, ele)
      } else {
        ele.value = formatNumber(n, scale, separator)
      }
    }
  } else if (ctype === "date" || ctype === "datetime-local" || ctype === "datetime") {
    var msg = checkDate(ele, label, resource, ctype === "date")
    if (msg) {
      return msg
    }
  } else if (datatype === "url") {
    if (!isUrl(value)) {
      var msg = format(resource.error_url, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "phone") {
    var phoneStr = formatter.removePhoneFormat(value)
    if (!tel.isPhone(phoneStr)) {
      var msg = format(resource.error_phone, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "fax") {
    var phoneStr = formatter.removeFaxFormat(value)
    if (!tel.isFax(phoneStr)) {
      var msg = format(resource.error_fax, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "code") {
    if (!isValidCode(value)) {
      var msg = format(resource.error_code, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "dash-code") {
    if (!isDashCode(value)) {
      var msg = format(resource.error_dash_code, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "digit") {
    if (!isDigitOnly(value)) {
      var msg = format(resource.error_digit, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "dash-digit") {
    if (!isDashDigit(value)) {
      var msg = format(resource.error_dash_digit, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "routing-number") {
    // business-tax-id
    if (!isDashDigit(value)) {
      var msg = format(resource.error_routing_number, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "check-number") {
    if (!isCheckNumber(value)) {
      var msg = format(resource.error_check_number, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "post-code") {
    var countryCode = ele.getAttribute("data-country-code")
    if (countryCode) {
      countryCode = countryCode.toUpperCase()
      if (countryCode === "US" || countryCode === "USA") {
        if (!isUSPostalCode(value)) {
          var msg = format(resource.error_us_post_code, label)
          addErrorMessage(ele, msg)
          return msg
        }
      } else if (countryCode === "CA" || countryCode === "CAN") {
        if (!isCAPostalCode(value)) {
          var msg = format(resource.error_ca_post_code, label)
          addErrorMessage(ele, msg)
          return msg
        }
      } else {
        if (!isDashCode(value)) {
          var msg = format(resource.error_post_code, label)
          addErrorMessage(ele, msg)
          return msg
        }
      }
    }
  } else if (datatype === "ipv4") {
    if (!isIPv4(value)) {
      var msg = format(resource.error_ipv4, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "ipv6") {
    if (!isIPv6(value)) {
      var msg = format(resource.error_ipv6, label)
      addErrorMessage(ele, msg)
      return msg
    }
  }
  removeError(ele)
  return null
}
function isValidForm(form, focusFirst, scroll) {
  var valid = true
  var i = 0
  var len = form.length
  for (i = 0; i < len; i++) {
    var ele = form[i]
    var parent_1 = ele.parentElement
    if (ele.classList.contains("invalid") || ele.classList.contains("ng-invalid") || (parent_1 && parent_1.classList.contains("invalid"))) {
      if (focusFirst !== false && !focusFirst) {
        focusFirst = true
      }
      if (ele && focusFirst) {
        ele.focus()
        if (scroll) {
          ele.scrollIntoView()
        }
      }
      return false
    }
  }
  return valid
}
function validateForm(form, locale, focusFirst, scroll, includeReadOnly) {
  if (!form) {
    return true
  }
  var valid = true
  var errorCtrl = null
  var errorShown = false
  var divMessage = form.querySelector(".message")
  var len = form.length
  for (var i = 0; i < len; i++) {
    var ele = form[i]
    var type = ele.getAttribute("type")
    if (type != null) {
      type = type.toLowerCase()
    }
    if (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset") {
      continue
    } else {
      var msg = validateElement(ele, locale, includeReadOnly)
      if (msg) {
        if (divMessage && !errorShown) {
          if (!divMessage.classList.contains("alert-error")) {
            divMessage.classList.add("alert-error")
          }
          errorShown = true
          divMessage.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
        }
        valid = false
        if (!errorCtrl) {
          errorCtrl = ele
        }
      } else {
        removeError(ele)
      }
    }
  }
  if (focusFirst !== false && !focusFirst) {
    focusFirst = true
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus()
    if (scroll === true) {
      errorCtrl.scrollIntoView()
    }
  }
  return valid
}
function validateElements(elements, locale) {
  var valid = true
  var errorCtrl = null
  for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
    var c = elements_1[_i]
    if (!validateElement(c, locale)) {
      valid = false
      if (!errorCtrl) {
        errorCtrl = c
      }
    } else {
      removeError(c)
    }
  }
  if (errorCtrl !== null) {
    errorCtrl.focus()
    errorCtrl.scrollIntoView()
  }
  return valid
}

var r1 = / |,|\$|€|£|¥|'|٬|،| /g
var r2 = / |\.|\$|€|£|¥|'|٬|،| /g
function parseDate(v, format) {
  if (!format || format.length === 0) {
    format = "MM/DD/YYYY"
  } else {
    format = format.toUpperCase()
  }
  var dateItems = format.split(/\/|\.| |-/)
  var valueItems = v.split(/\/|\.| |-/)
  var imonth = dateItems.indexOf("M")
  var iday = dateItems.indexOf("D")
  var iyear = dateItems.indexOf("YYYY")
  if (imonth === -1) {
    imonth = dateItems.indexOf("MM")
  }
  if (iday === -1) {
    iday = dateItems.indexOf("DD")
  }
  if (iyear === -1) {
    iyear = dateItems.indexOf("YY")
  }
  var month = parseInt(valueItems[imonth], 10) - 1
  var year = parseInt(valueItems[iyear], 10)
  if (year < 100) {
    year += 2000
  }
  var day = parseInt(valueItems[iday], 10)
  return new Date(year, month, day)
}
function getDecimalSeparator(ele) {
  var separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    var form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator === "," ? "," : "."
}
var d = "data-value"
function selectOnChange(ele, attr) {
  var at = attr && attr.length > 0 ? attr : d
  if (ele.value === "") {
    ele.removeAttribute(at)
  } else {
    ele.setAttribute(at, ele.value)
  }
}
//detect Ctrl + [a, v, c, x]
function detectCtrlKeyCombination(e) {
  // list all CTRL + key combinations
  var forbiddenKeys = new Array("v", "a", "x", "c")
  var key
  var isCtrl
  var browser = navigator.appName
  if (browser == "Microsoft Internet Explorer") {
    key = e.keyCode
    // IE
    if (e.ctrlKey) {
      isCtrl = true
    } else {
      isCtrl = false
    }
  } else {
    if (browser == "Netscape") {
      key = e.which
      // firefox, Netscape
      if (e.ctrlKey) isCtrl = true
      else isCtrl = false
    } else return true
  }
  // if ctrl is pressed check if other key is in forbidenKeys array
  if (isCtrl) {
    var chr = String.fromCharCode(key).toLowerCase()
    for (var i = 0; i < forbiddenKeys.length; i++) {
      if (forbiddenKeys[i] == chr) {
        return true
      }
    }
  }
  return false
}
function digitOnKeyPress(e) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  var key = window.event ? e.keyCode : e.which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var keychar = String.fromCharCode(key)
  var reg = /\d/
  return reg.test(keychar)
}
function integerOnKeyPress(e) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  var key = window.event ? e.keyCode : e.which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var ele = e.target
  var keychar = String.fromCharCode(key)
  if (keychar == "-") {
    if (ele.value.indexOf("-") >= 0 || isNaN(ele.min) || parseInt(ele.min) >= 0) {
      return false
    }
    return key
  }
  var reg = /\d/
  return reg.test(keychar)
}
function numberOnKeyPress(e) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  var key = window.event ? e.keyCode : e.which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var ele = e.target
  var keychar = String.fromCharCode(key)
  if (keychar == "-") {
    if (ele.value.indexOf("-") >= 0 || isNaN(ele.min) || parseInt(ele.min) >= 0) {
      return false
    }
    return key
  }
  if (keychar == "." || keychar == ",") {
    if (ele.value.indexOf(keychar) >= 0 || keychar !== getDecimalSeparator(ele)) {
      return false
    }
    return key
  }
  var reg = /\d/
  return reg.test(keychar)
}
function trimTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function addDays(d, n) {
  var newDate = new Date(d)
  newDate.setDate(newDate.getDate() + n)
  return newDate
}
function formatDate(d, dateFormat, full, upper) {
  if (!d) {
    return ""
  }
  var format = dateFormat && dateFormat.length > 0 ? dateFormat : "M/D/YYYY"
  if (upper) {
    format = format.toUpperCase()
  }
  var arr = ["", "", ""]
  var items = format.split(/\/|\.| |-/)
  var iday = items.indexOf("D")
  var im = items.indexOf("M")
  var iyear = items.indexOf("YYYY")
  var fm = full ? full : false
  var fd = full ? full : false
  var fy = true
  if (iday === -1) {
    iday = items.indexOf("DD")
    fd = true
  }
  if (im === -1) {
    im = items.indexOf("MM")
    fm = true
  }
  if (iyear === -1) {
    iyear = items.indexOf("YY")
    fy = full ? full : false
  }
  arr[iday] = getD(d.getDate(), fd)
  arr[im] = getD(d.getMonth() + 1, fm)
  arr[iyear] = getYear(d.getFullYear(), fy)
  var s = detectSeparator(format)
  var e = detectLastSeparator(format)
  var l = items.length === 4 ? format[format.length - 1] : ""
  return arr[0] + s + arr[1] + e + arr[2] + l
}
function detectSeparator(format) {
  var len = format.length
  for (var i = 0; i < len; i++) {
    var c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function detectLastSeparator(format) {
  var len = format.length - 3
  for (var i = len; i > -0; i--) {
    var c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function getYear(y, full) {
  if (full || (y <= 99 && y >= -99)) {
    return y.toString()
  }
  var s = y.toString()
  return s.substring(s.length - 2)
}
function getD(n, fu) {
  return fu ? pad(n) : n.toString()
}
function formatLongTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
function pad(n) {
  return n < 10 ? "0" + n : n.toString()
}
function pad3(n) {
  if (n >= 100) {
    return n.toString()
  }
  return n < 10 ? "00" + n : "0" + n.toString()
}
function formatLongDateTime(date, dateFormat, full, upper) {
  if (!date) {
    return ""
  }
  var sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
function getValue(form, name) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        return ele.value
      }
    }
  }
  return null
}
function getElement(form, name) {
  if (form) {
    var l = form.length
    for (var i = 0; i < l; i++) {
      var e = form[i]
      if (e.getAttribute("name") === name) {
        return e
      }
    }
  }
  return null
}
function valueOf(obj, key) {
  var mapper = key.split(".").map(function (item) {
    return item.replace(/\[/g, ".[").replace(/\[|\]/g, "")
  })
  var reSplit = mapper.join(".").split(".")
  return reSplit.reduce(function (acc, current, index, source) {
    var value = getDirectValue(acc, current)
    if (!value) {
      source.splice(1)
    }
    return value
  }, obj)
}
function getDirectValue(obj, key) {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key]
  }
  return null
}
function setValue(obj, key, value) {
  var replaceKey = key.replace(/\[/g, ".[").replace(/\.\./g, ".")
  if (replaceKey.indexOf(".") === 0) {
    replaceKey = replaceKey.slice(1, replaceKey.length)
  }
  var keys = replaceKey.split(".")
  var firstKey = keys.shift()
  if (!firstKey) {
    return
  }
  var isArrayKey = /\[([0-9]+)\]/.test(firstKey)
  if (keys.length > 0) {
    var firstKeyValue = obj[firstKey] || {}
    var returnValue = setValue(firstKeyValue, keys.join("."), value)
    return setKey(obj, isArrayKey, firstKey, returnValue)
  }
  return setKey(obj, isArrayKey, firstKey, value)
}
function setKey(_object, _isArrayKey, _key, _nextValue) {
  if (_isArrayKey) {
    if (_object.length > _key) {
      _object[_key] = _nextValue
    } else {
      _object.push(_nextValue)
    }
  } else {
    _object[_key] = _nextValue
  }
  return _object
}
function decodeFromForm(form, currencySymbol) {
  var dateFormat = form.getAttribute("data-date-format")
  var obj = {}
  var len = form.length
  var _loop_1 = function (i) {
    var ele = form[i]
    var name_1 = ele.getAttribute("name")
    var id = ele.getAttribute("id")
    var val = void 0
    var isDate = false
    var dataField = ele.getAttribute("data-field")
    if (dataField && dataField.length > 0) {
      name_1 = dataField
    } else if ((!name_1 || name_1 === "") && ele.parentElement && ele.parentElement.classList.contains("DayPickerInput")) {
      if (ele.parentElement.parentElement) {
        dataField = ele.parentElement.parentElement.getAttribute("data-field")
        isDate = true
        name_1 = dataField
      }
    }
    if (isDate === false && ele.getAttribute("data-type") === "date") {
      isDate = true
    }
    if (name_1 != null && name_1 !== "") {
      var nodeName = ele.nodeName
      var type = ele.getAttribute("type")
      if (nodeName === "INPUT" && type !== null) {
        nodeName = type.toUpperCase()
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT") {
        switch (type) {
          case "checkbox":
            if (id && name_1 !== id) {
              // obj[name] = !obj[name] ? [] : obj[name];
              val = valueOf(obj, name_1) // val = obj[name];
              if (!val) {
                val = []
              }
              if (ele.checked) {
                val.push(ele.value)
                // obj[name].push(ele.value);
              } else {
                // tslint:disable-next-line: triple-equals
                val = val.filter(function (item) {
                  return item != ele.value
                })
              }
            } else {
              val = ele.value.length > 0 ? ele.value : ele.checked
            }
            setValue(obj, name_1, val)
            return "continue"
          case "radio":
            if (ele.checked) {
              val = ele.value.length > 0 ? ele.value : ele.checked
              setValue(obj, name_1, val)
            }
            return "continue"
          case "date":
            val = ele.value.length === 10 ? ele.value : null
            break
          case "datetime-local":
            if (ele.value.length > 0) {
              try {
                val = new Date(ele.value) // DateUtil.parse(ele.value, 'YYYY-MM-DD');
              } catch (err) {
                val = null
              }
            } else {
              val = null
            }
            break
          default:
            val = ele.value
        }
        if (isDate && dateFormat && dateFormat.length > 0) {
          var d_1 = parseDate(val, dateFormat)
          val = d_1.toString() === "Invalid Date" ? null : d_1
        }
        var datatype = ele.getAttribute("data-type")
        var v = ele.value
        var symbol = void 0
        if (datatype === "currency" || datatype === "string-currency") {
          symbol = ele.getAttribute("data-currency-symbol")
          if (!symbol) {
            symbol = currencySymbol
          }
          if (symbol && symbol.length > 0 && v.indexOf(symbol) >= 0) {
            v = v.replace(symbol, "")
          }
        }
        if (type === "number" || datatype === "currency" || datatype === "integer" || datatype === "number") {
          var decimalSeparator = getDecimalSeparator(ele)
          v = decimalSeparator === "," ? v.replace(r2, "") : (v = v.replace(r1, ""))
          val = isNaN(v) ? null : parseFloat(v)
        }
        setValue(obj, name_1, val) // obj[name] = val;
      }
    }
  }
  for (var i = 0; i < len; i++) {
    _loop_1(i)
  }
  return obj
}
function removeMessage(ele) {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-warning", "alert-info"])
    ele.innerHTML = ""
    return true
  }
  return false
}
function hideElement(ele) {
  if (ele) {
    ele.hidden = true
    return true
  }
  return false
}
function unhideElement(ele) {
  if (ele) {
    ele.hidden = false
    return true
  }
  return false
}
function isHidden(ele) {
  if (ele) {
    return ele.hidden || ele.style.display === "none"
  }
  return true
}
function showErrorMessage(ele, msg) {
  if (ele) {
    removeClasses(ele, ["alert-warning", "alert-info"])
    if (!ele.classList.contains("alert-error")) {
      ele.classList.add("alert-error")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showErrorMessageOfForm(form, msg) {
  var ele = form.querySelector(".message")
  return showErrorMessage(ele, msg)
}
function showWarningMessage(ele, msg) {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-info"])
    if (!ele.classList.contains("alert-warning")) {
      ele.classList.add("alert-warning")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showWarningMessageOfForm(form, msg) {
  var ele = form.querySelector(".message")
  return showWarningMessage(ele, msg)
}
function showInfoMessage(ele, msg) {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-warning"])
    if (!ele.classList.contains("alert-info")) {
      ele.classList.add("alert-info")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showInfoMessageOfForm(form, msg) {
  var ele = form.querySelector(".message")
  return showInfoMessage(ele, msg)
}
function setInputValue(form, name, value) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        ele.value = value
        return true
      }
    }
  }
  return false
}
function getHttpHeaders() {
  var token = getToken()
  var lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return {
        "Content-Type": "application/json;charset=utf-8",
        "Content-Language": lang,
        Authorization: "Bearer " + token,
      }
    } else {
      return {
        "Content-Type": "application/json;charset=utf-8",
        "Content-Language": lang,
      }
    }
  } else {
    if (token && token.length > 0) {
      return {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + token,
      }
    } else {
      return {
        "Content-Type": "application/json;charset=utf-8",
      }
    }
  }
}
function getConfirmMessage(ele, resource) {
  var confirmMsg = ele.getAttribute("data-message")
  return confirmMsg ? confirmMsg : resource.msg_confirm_save
}
function submitFormData(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var valid = validateForm(form)
  if (!valid) {
    return
  }
  var resource = getResource()
  var successMsg = target.getAttribute("data-success")
  var confirmMsg = getConfirmMessage(target, resource)
  showConfirm(confirmMsg, function () {
    showLoading()
    var url = getCurrentURL()
    var formData = new FormData(form)
    fetch(url, {
      method: "POST",
      headers: getHttpHeaders(),
      body: formData,
    })
      .then(function (response) {
        if (response.ok) {
          response
            .text()
            .then(function (data) {
              var pageBody = document.getElementById("pageBody")
              if (pageBody) {
                pageBody.innerHTML = data
                afterLoaded(pageBody)
              }
              hideLoading()
              if (successMsg) {
                alertSuccess(successMsg)
              }
            })
            .catch(function (err) {
              return handleError(err, resource.error_response_body)
            })
        } else {
          hideLoading()
          handlePostError(response, resource)
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  })
}
function handlePostError(response, resource) {
  if (response.status === 401) {
    window.location.href = buildLoginUrl()
  } else if (response.status === 403) {
    alertError(resource.error_403)
  } else if (response.status === 409) {
    alertError(resource.error_409)
  } else if (response.status === 410) {
    alertError(resource.error_410)
  } else if (response.status === 400) {
    alertError(resource.error_400, response.statusText)
  } else {
    console.error("Error: ", response.statusText)
    alertError(resource.error_submit_failed, response.statusText)
  }
}
function getSuccessMessage(ele, resource) {
  var successMsg = ele.getAttribute("data-success")
  return successMsg ? successMsg : resource.msg_save_success
}
function submitForm(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var valid = validateForm(form)
  if (!valid) {
    return
  }
  var resource = getResource()
  var successMsg = getSuccessMessage(target, resource)
  var confirmMsg = getConfirmMessage(target, resource)
  showConfirm(confirmMsg, function () {
    showLoading()
    var data = decodeFromForm(form)
    var url = getCurrentURL()
    fetch(url, {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(data),
    })
      .then(function (response) {
        hideLoading()
        if (response.ok) {
          alertSuccess(successMsg)
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  })
}
function handleJsonError(response, resource, form, showErrors, allErrors) {
  if (response.status === 401) {
    window.location.href = buildLoginUrl()
  } else if (response.status === 403) {
    alertError(resource.error_403)
  } else if (response.status === 409) {
    alertError(resource.error_409)
  } else if (response.status === 410) {
    alertError(resource.error_410)
  } else if (response.status === 422) {
    response
      .json()
      .then(function (errors) {
        if (showErrors) {
          if (allErrors) {
            showErrors(errors)
          } else {
            var errs = showFormError(form, errors)
            if (errs && errs.length > 0) {
              showErrors(errs)
            }
          }
        } else {
          showFormError(form, errors)
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_response_body)
      })
  } else if (response.status === 400) {
    alertError(resource.error_400, response.statusText)
  } else {
    alertError(resource.error_submit_failed, response.statusText)
  }
}

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
function navigate(e, ignoreLang) {
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
    if (!ignoreLang && lang.length > 0) {
      url_1 = url_1 + (url_1.indexOf("?") > 0 ? "&" : "?") + lang
    }
    var lang1 = lang.length > 0 && !ignoreLang ? "&" + lang : ""
    var newUrl = url_1 + (url_1.indexOf("?") > 0 ? "&" : "?") + "partial=true" + lang1
    showLoading()
    fetch(newUrl, { method: "GET", headers: getHeaders() })
      .then(function (response) {
        if (response.ok) {
          response
            .text()
            .then(function (data) {
              var pageBody = document.getElementById("pageBody")
              if (pageBody) {
                pageBody.innerHTML = data
                var span = link.querySelector("span")
                var title = span ? span.innerText : link.innerText
                window.history.pushState({ pageTitle: title }, "", url_1)
                afterLoaded(pageBody)
                setTimeout(function () {
                  resources.load(pageBody)
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
