"use strict"
const r1 = / |,|\$|€|£|¥|'|٬|،| /g
const r2 = / |\.|\$|€|£|¥|'|٬|،| /g
class resources {}
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
function parseDate(v, format) {
  if (!format || format.length === 0) {
    format = "MM/DD/YYYY"
  } else {
    format = format.toUpperCase()
  }
  const dateItems = format.split(/\/|\.| |-/)
  const valueItems = v.split(/\/|\.| |-/)
  let imonth = dateItems.indexOf("M")
  let iday = dateItems.indexOf("D")
  let iyear = dateItems.indexOf("YYYY")
  if (imonth === -1) {
    imonth = dateItems.indexOf("MM")
  }
  if (iday === -1) {
    iday = dateItems.indexOf("DD")
  }
  if (iyear === -1) {
    iyear = dateItems.indexOf("YY")
  }
  const month = parseInt(valueItems[imonth], 10) - 1
  let year = parseInt(valueItems[iyear], 10)
  if (year < 100) {
    year += 2000
  }
  const day = parseInt(valueItems[iday], 10)
  return new Date(year, month, day)
}
let eleHtml
let isGetHtml = false
function getLang() {
  if (!isGetHtml) {
    eleHtml = document.querySelector("html")
    isGetHtml = true
  }
  if (isGetHtml && eleHtml) {
    const lang = eleHtml.getAttribute("lang")
    if (lang && lang.length > 0) {
      return lang
    }
  }
  return undefined
}
function getCurrentURL() {
  return window.location.origin + window.location.pathname
}
function getRedirect() {
  const loc = window.location.href
  if (loc.length < 8) {
    return ""
  }
  const i = loc.indexOf("/", 9)
  if (i < 0) {
    return ""
  }
  return loc.substring(i)
}
function buildLoginUrl() {
  const r = getRedirect()
  if (r.length === 0) {
    return resources.login
  } else {
    return resources.login + "?" + resources.redirect + "=" + encodeURIComponent(r)
  }
}
function getDecimalSeparator(ele) {
  let separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    const form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator === "," ? "," : "."
}
function afterLoaded(pageBody) {
  if (pageBody) {
    setTimeout(function () {
      const forms = pageBody.querySelectorAll("form")
      for (let i = 0; i < forms.length; i++) {
        registerEvents(forms[i])
      }
      const msg = getHiddenMessage(forms, resources.hiddenMessage)
      if (msg && msg.length > 0) {
        toast(msg)
      }
    }, 0)
  }
}
const histories = []
const historyMax = 10
function goBack() {
  let url = histories.pop()
  if (url) {
    const newUrl = url + (url.indexOf("?") >= 0 ? "&" : "?") + "partial=true"
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
                window.history.pushState({ pageTitle: "" }, "", url)
                afterLoaded(pageBody)
              }
              hideLoading()
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  }
}
const d = "data-value"
function selectOnChange(ele, attr) {
  const at = attr && attr.length > 0 ? attr : d
  if (ele.value === "") {
    ele.removeAttribute(at)
  } else {
    ele.setAttribute(at, ele.value)
  }
}
function detectCtrlKeyCombination(e) {
  var forbiddenKeys = new Array("v", "a", "x", "c")
  var key
  var isCtrl
  var browser = navigator.appName
  if (browser == "Microsoft Internet Explorer") {
    key = e.keyCode
    if (e.ctrlKey) {
      isCtrl = true
    } else {
      isCtrl = false
    }
  } else {
    if (browser == "Netscape") {
      key = e.which
      if (e.ctrlKey) isCtrl = true
      else isCtrl = false
    } else return true
  }
  if (isCtrl) {
    var chr = String.fromCharCode(key).toLowerCase()
    for (let i = 0; i < forbiddenKeys.length; i++) {
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
  const key = window.event ? e.keyCode : e.which
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
  const key = window.event ? e.keyCode : e.which
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
  const key = window.event ? e.keyCode : e.which
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
  const newDate = new Date(d)
  newDate.setDate(newDate.getDate() + n)
  return newDate
}
function formatDate(d, dateFormat, full, upper) {
  if (!d) {
    return ""
  }
  let format = dateFormat && dateFormat.length > 0 ? dateFormat : "M/D/YYYY"
  if (upper) {
    format = format.toUpperCase()
  }
  let arr = ["", "", ""]
  const items = format.split(/\/|\.| |-/)
  let iday = items.indexOf("D")
  let im = items.indexOf("M")
  let iyear = items.indexOf("YYYY")
  let fm = full ? full : false
  let fd = full ? full : false
  let fy = true
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
  const s = detectSeparator(format)
  const e = detectLastSeparator(format)
  const l = items.length === 4 ? format[format.length - 1] : ""
  return arr[0] + s + arr[1] + e + arr[2] + l
}
function detectSeparator(format) {
  const len = format.length
  for (let i = 0; i < len; i++) {
    const c = format[i]
    if (!((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"))) {
      return c
    }
  }
  return "/"
}
function detectLastSeparator(format) {
  const len = format.length - 3
  for (let i = len; i > -0; i--) {
    const c = format[i]
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
  const s = y.toString()
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
  const sd = formatDate(date, dateFormat, full, upper)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
function getValue(form, name) {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i]
      if (ele.name === name) {
        return ele.value
      }
    }
  }
  return null
}
function getElement(form, name) {
  if (form) {
    const l = form.length
    for (let i = 0; i < l; i++) {
      const e = form[i]
      if (e.getAttribute("name") === name) {
        return e
      }
    }
  }
  return null
}
function findParent(e, className, nodeName) {
  if (!e) {
    return null
  }
  if (nodeName && e.nodeName === nodeName) {
    return e
  }
  let p = e
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
  let p = e
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
  let count = 0
  if (ele) {
    for (let i = 0; i < classes.length; i++) {
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
  let count = 0
  if (ele) {
    for (let i = 0; i < classes.length; i++) {
      if (removeClass(ele, classes[i])) {
        count++
      }
    }
  }
  return count
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
  const ele = event.currentTarget
  if (ele.disabled || ele.readOnly) {
    return
  }
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      addClass(getContainer(ele), "focused")
    }
  }, 0)
}
function materialOnBlur(event) {
  const ele = event.currentTarget
  setTimeout(() => {
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      removeClasses(getContainer(ele), ["focused", "focus"])
    }
  }, 0)
}
function registerEvents(form) {
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ele = form[i]
    if (ele.nodeName === "INPUT" || ele.nodeName === "SELECT" || ele.nodeName === "TEXTAREA") {
      let type = ele.getAttribute("type")
      if (type != null) {
        type = type.toLowerCase()
      }
      if (ele.nodeName === "INPUT" && (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset")) {
        continue
      } else {
        const parent = ele.parentElement
        const required = ele.getAttribute("required")
        if (parent) {
          if (parent.nodeName === "LABEL" && required != null && required !== undefined && required != "false" && !parent.classList.contains("required")) {
            parent.classList.add("required")
          } else if (parent.classList.contains("form-group") || parent.classList.contains("field")) {
            const firstChild = parent.firstChild
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
function valueOf(obj, key) {
  const mapper = key.split(".").map((item) => {
    return item.replace(/\[/g, ".[").replace(/\[|\]/g, "")
  })
  const reSplit = mapper.join(".").split(".")
  return reSplit.reduce((acc, current, index, source) => {
    const value = getDirectValue(acc, current)
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
  let replaceKey = key.replace(/\[/g, ".[").replace(/\.\./g, ".")
  if (replaceKey.indexOf(".") === 0) {
    replaceKey = replaceKey.slice(1, replaceKey.length)
  }
  const keys = replaceKey.split(".")
  let firstKey = keys.shift()
  if (!firstKey) {
    return
  }
  const isArrayKey = /\[([0-9]+)\]/.test(firstKey)
  if (keys.length > 0) {
    const firstKeyValue = obj[firstKey] || {}
    const returnValue = setValue(firstKeyValue, keys.join("."), value)
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
  const dateFormat = form.getAttribute("data-date-format")
  const obj = {}
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ele = form[i]
    let name = ele.getAttribute("name")
    const id = ele.getAttribute("id")
    let val
    let isDate = false
    let dataField = ele.getAttribute("data-field")
    if (dataField && dataField.length > 0) {
      name = dataField
    } else if ((!name || name === "") && ele.parentElement && ele.parentElement.classList.contains("DayPickerInput")) {
      if (ele.parentElement.parentElement) {
        dataField = ele.parentElement.parentElement.getAttribute("data-field")
        isDate = true
        name = dataField
      }
    }
    if (isDate === false && ele.getAttribute("data-type") === "date") {
      isDate = true
    }
    if (name != null && name !== "") {
      let nodeName = ele.nodeName
      const type = ele.getAttribute("type")
      if (nodeName === "INPUT" && type !== null) {
        nodeName = type.toUpperCase()
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT") {
        switch (type) {
          case "checkbox":
            if (id && name !== id) {
              val = valueOf(obj, name)
              if (!val) {
                val = []
              }
              if (ele.checked) {
                val.push(ele.value)
              } else {
                val = val.filter((item) => item != ele.value)
              }
            } else {
              val = ele.value.length > 0 ? ele.value : ele.checked
            }
            setValue(obj, name, val)
            continue
          case "radio":
            if (ele.checked) {
              val = ele.value.length > 0 ? ele.value : ele.checked
              setValue(obj, name, val)
            }
            continue
          case "date":
            val = ele.value.length === 10 ? ele.value : null
            break
          case "datetime-local":
            if (ele.value.length > 0) {
              try {
                val = new Date(ele.value)
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
          const d = parseDate(val, dateFormat)
          val = d.toString() === "Invalid Date" ? null : d
        }
        const datatype = ele.getAttribute("data-type")
        let v = ele.value
        let symbol
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
          const decimalSeparator = getDecimalSeparator(ele)
          v = decimalSeparator === "," ? v.replace(r2, "") : (v = v.replace(r1, ""))
          val = isNaN(v) ? null : parseFloat(v)
        }
        setValue(obj, name, val)
      }
    }
  }
  return obj
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
function getHiddenMessage(nodes, name, i) {
  const index = i !== undefined && i >= 0 ? i : 0
  if (nodes.length > index) {
    const form = nodes[index]
    const n = name && name.length > 0 ? name : "hidden-message"
    const ele = form.querySelector("." + n)
    if (ele) {
      return ele.innerHTML
    }
  }
  return null
}
function removeMessage(ele) {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-warning", "alert-info"])
    ele.innerHTML = ""
    return true
  }
  return false
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
  const ele = form.querySelector(".message")
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
  const ele = form.querySelector(".message")
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
  const ele = form.querySelector(".message")
  return showInfoMessage(ele, msg)
}
function checkRequiredElements(form, names) {
  const resource = getResource()
  const eleMsg = form.querySelector(".message")
  if (eleMsg) {
    for (let i = 0; i < names.length; i++) {
      const ele = getElement(form, names[i])
      if (ele) {
        if (ele.value === "") {
          const label = getLabel(ele)
          const msg = format(resource.error_required, label)
          showErrorMessage(eleMsg, msg)
          return false
        }
      }
    }
  }
  return true
}
function setInputValue(form, name, value) {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i]
      if (ele.name === name) {
        ele.value = value
        return true
      }
    }
  }
  return false
}
function getToken() {
  const token = localStorage.getItem(resources.token)
  return token
}
function getHeaders() {
  const token = getToken()
  const lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return { "Content-Language": lang, Authorization: `Bearer ${token}` }
    } else {
      return { "Content-Language": lang }
    }
  } else {
    if (token && token.length > 0) {
      return { Authorization: `Bearer ${token}` }
    } else {
      return {}
    }
  }
}
function getHttpHeaders() {
  const token = getToken()
  const lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return {
        "Content-Type": "application/json;charset=utf-8",
        "Content-Language": lang,
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      }
    } else {
      return {
        "Content-Type": "application/json;charset=utf-8",
      }
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
function getConfirmMessage(ele, resource) {
  let confirmMsg = ele.getAttribute("data-message")
  return confirmMsg ? confirmMsg : resource.msg_confirm_save
}
function handleError(err, msg) {
  hideLoading()
  console.log("Error: " + err)
  alertError(msg, err)
}
function submitFormData(e) {
  e.preventDefault()
  const target = e.target
  const form = target.form
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  let successMsg = target.getAttribute("data-success")
  const confirmMsg = getConfirmMessage(target, resource)
  showConfirm(confirmMsg, () => {
    showLoading()
    const url = getCurrentURL()
    const formData = new FormData(form)
    fetch(url, {
      method: "POST",
      headers: getHttpHeaders(),
      body: formData,
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
              hideLoading()
              if (successMsg) {
                alertSuccess(successMsg)
              }
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else {
          hideLoading()
          handlePostError(response, resource)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
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
  let successMsg = ele.getAttribute("data-success")
  return successMsg ? successMsg : resource.msg_save_success
}
function submitForm(e) {
  e.preventDefault()
  const target = e.target
  const form = target.form
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  const successMsg = getSuccessMessage(target, resource)
  const confirmMsg = getConfirmMessage(target, resource)
  showConfirm(confirmMsg, () => {
    showLoading()
    const data = decodeFromForm(form)
    const url = getCurrentURL()
    fetch(url, {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(data),
    })
      .then((response) => {
        hideLoading()
        if (response.ok) {
          alertSuccess(successMsg)
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
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
      .then((errors) => {
        if (showErrors) {
          if (allErrors) {
            showErrors(errors)
          } else {
            const errs = showFormError(form, errors)
            if (errs && errs.length > 0) {
              showErrors(errs)
            }
          }
        } else {
          showFormError(form, errors)
        }
      })
      .catch((err) => handleError(err, resource.error_response_body))
  } else if (response.status === 400) {
    alertError(resource.error_400, response.statusText)
  } else {
    alertError(resource.error_submit_failed, response.statusText)
  }
}
