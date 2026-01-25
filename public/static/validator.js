"use strict"
function addErrorMessage(ele, msg, directParent) {
  if (!ele) {
    return
  }
  if (!msg) {
    msg = "Error"
  }
  addClass(ele, "invalid")
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
var formatter = (function () {
  function formatter() {}
  formatter.formatPhone = function (phone) {
    if (!phone) {
      return ""
    }
    var s = phone
    var x = removePhoneFormat(phone)
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
    }
    return s
  }
  formatter.formatFax = function (fax) {
    if (!fax) {
      return ""
    }
    var s = fax
    var x = removeFaxFormat(fax)
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
  formatter.phone = / |\-|\.|\(|\)/g
  formatter.fax = / |\-|\.|\(|\)/g
  formatter.usPhone = /(\d{3})(\d{3})(\d{4})/
  return formatter
})()
function formatPhone(phone) {
  return formatter.formatPhone(phone)
}
function formatFax(fax) {
  return formatter.formatFax(fax)
}
function removePhoneFormat(phone) {
  return phone ? phone.replace(formatter.phone, "") : phone
}
function removeFaxFormat(fax) {
  return fax ? fax.replace(formatter.fax, "") : fax
}
var tel = (function () {
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
    if (value.length > 0 && !check(value)) {
      var msg = format(resource[key], label, ele.maxLength)
      addErrorMessage(ele, msg)
    }
    if (formatF) {
      var value2 = formatF(value)
      if (value2 !== value) {
        ele.value = value2
      }
    }
  }, 40)
}
function emailOnBlur(event) {
  checkOnBlur(event, "error_email", isEmail)
}
function urlOnBlur(event) {
  checkOnBlur(event, "error_url", isUrl)
}
function phoneOnFocus(event) {
  var ele = event.currentTarget
  handleMaterialFocus(ele)
  if (ele.readOnly || ele.disabled || ele.value.length === 0) {
    return
  } else {
    var s = removePhoneFormat(ele.value)
    if (s !== ele.value) {
      ele.value = s
    }
  }
}
function phoneOnBlur(event) {
  checkOnBlur(event, "error_phone", tel.isPhone, formatPhone)
}
function faxOnFocus(event) {
  var ele = event.currentTarget
  handleMaterialFocus(ele)
  if (ele.readOnly || ele.disabled || ele.value.length === 0) {
    return
  } else {
    var s = removeFaxFormat(ele.value)
    if (s !== ele.value) {
      ele.value = s
    }
  }
}
function faxOnBlur(event) {
  checkOnBlur(event, "error_fax", tel.isFax, formatFax)
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
        var smin2 = correctNumber(minElement.value, locale)
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
      var t = target.getAttribute("data-type") === "integer" ? resource.error_integer : resource.error_number
      var msg = format(t, label)
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
  if (v == null) {
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
    var phoneStr = removePhoneFormat(value)
    if (!tel.isPhone(phoneStr)) {
      var msg = format(resource.error_phone, label)
      addErrorMessage(ele, msg)
      return msg
    }
  } else if (datatype === "fax") {
    var phoneStr = removeFaxFormat(value)
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
