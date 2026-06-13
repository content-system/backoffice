"use strict"
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
  return separator ? separator : "."
}
function getGroupSeparator(ele) {
  var separator = ele.getAttribute("data-group-separator")
  if (!separator) {
    var form = ele.form
    if (form) {
      separator = form.getAttribute("data-group-separator")
    }
  }
  return separator
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
function formatDate(d, format) {
  if (!d || !format) {
    return ""
  }
  var y = d.getFullYear()
  var m = d.getMonth() + 1
  var day = d.getDate()
  var out = ""
  var i = 0
  while (i < format.length) {
    var c = format.charCodeAt(i)
    if (c === 121) {
      var len = count(format, i, 121)
      if (len >= 4) {
        out += y.toString()
        i += 4
      } else {
        out += shortYear(y)
        i += 2
      }
      continue
    }
    if (c === 77) {
      var len = count(format, i, 77)
      out += len >= 2 ? pad(m) : m.toString()
      i += len >= 2 ? 2 : 1
      continue
    }
    if (c === 100) {
      var len = count(format, i, 100)
      out += len >= 2 ? pad(day) : day.toString()
      i += len >= 2 ? 2 : 1
      continue
    }
    out += format[i]
    i++
  }
  return out
}
function shortYear(y) {
  return ((y % 100) + 100) % 100 < 10 ? "0" + (((y % 100) + 100) % 100) : "" + (((y % 100) + 100) % 100)
}
function count(s, i, ch) {
  var n = 0
  while (i + n < s.length && s.charCodeAt(i + n) === ch) {
    n++
  }
  return n
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
var et = ""
function formatDateTime(date, dateFormat) {
  if (!date) {
    return et
  }
  var sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatTime(date)
}
function formatLongDateTime(date, dateFormat) {
  if (!date) {
    return et
  }
  var sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
function formatFullDateTime(date, dateFormat, s) {
  if (!date) {
    return et
  }
  var sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatFullTime(date, s)
}
function formatTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes())
}
function formatLongTime(d) {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
function formatFullTime(d, s) {
  var se = s && s.length > 0 ? s : "."
  return formatLongTime(d) + se + pad3(d.getMilliseconds())
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
function normalizePhone(s) {
  if (!s) {
    return ""
  }
  var len = s.length
  var buf = new Array(len)
  var j = 0
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i)
    if (c === 43 || (c >= 48 && c <= 57)) {
      buf[j++] = s[i]
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
function normalizeInteger(s) {
  if (!s) {
    return ""
  }
  var len = s.length
  var buf = new Array(len)
  var j = 0
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
function removeSeparators(s) {
  if (!s) {
    return ""
  }
  var len = s.length
  var buffer = new Uint16Array(len)
  var write = 0
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i)
    if ((c >= 48 && c <= 57) || c === 46) {
      buffer[write++] = c
    }
  }
  return String.fromCharCode.apply(null, buffer.subarray(0, write))
}
function normalizeNumber(s) {
  if (!s) {
    return ""
  }
  var len = s.length
  var buf = new Array(len)
  var j = 0
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    } else if (c === 44 || c === 1643) {
      buf[j++] = "."
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
function decodeFromElement(parent, fields) {
  var obj = {}
  if (parent) {
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
      var field = fields_1[_i]
      var ele = parent.querySelector('input[name="' + escapeHTML(field) + '"]')
      if (ele) {
        var type = ele.type
        if (type === "checkbox") {
          obj[field] = ele.checked
        } else if (type === "date") {
          if (ele.value.length === 10) {
            obj[field] = ele.value
          }
        } else if (type === "datetime-local") {
          if (ele.value.length > 0) {
            try {
              var val = new Date(ele.value)
              obj[field] = val
            } catch (err) {}
          }
        } else {
          var datatype = ele.getAttribute("data-type")
          var v = ele.value.trim()
          if (datatype === "phone" || datatype === "fax") {
            obj[field] = normalizePhone(v)
          } else if (datatype === "integer") {
            if (v) {
              v = normalizeInteger(v)
              var val = isNaN(v) ? null : parseFloat(v)
              obj[field] = val
            } else {
              obj[field] = undefined
            }
          } else if (datatype === "number" || datatype === "currency") {
            var decimalSeparator = getDecimalSeparator(ele)
            v = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v) : removeSeparators(v)
            if (v) {
              var val = isNaN(v) ? null : parseFloat(v)
              obj[field] = val
            } else {
              obj[field] = undefined
            }
          } else {
            obj[field] = v
          }
        }
      }
    }
  }
  return obj
}
function decode(form, currencySymbol) {
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
      if (nodeName === "INPUT" && type != null) {
        nodeName = type.toUpperCase()
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && ele.getAttribute("data-skip") !== "true") {
        switch (type) {
          case "checkbox":
            if (id && name_1 !== id) {
              val = valueOf(obj, name_1)
              if (!val) {
                val = []
              }
              if (ele.checked) {
                val.push(ele.value)
              } else {
                val = val.filter(function (item) {
                  return item != ele.value
                })
              }
            } else {
              val = ele.value !== "on" ? ele.value : ele.checked
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
          var d_1 = parseDate(val, dateFormat)
          val = d_1.toString() === "Invalid Date" ? null : d_1
        }
        var datatype = ele.getAttribute("data-type")
        var v = ele.value
        if (datatype === "phone" || datatype === "fax") {
          val = normalizePhone(v)
        } else if (datatype === "integer") {
          var n0 = normalizeInteger(v)
          val = isNaN(n0) ? undefined : parseFloat(v)
        } else if (datatype === "number" || datatype === "currency") {
          var decimalSeparator = getDecimalSeparator(ele)
          var n0 = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v) : removeSeparators(v)
          val = isNaN(n0) ? undefined : parseFloat(v)
        }
        setValue(obj, name_1, val)
      }
    }
  }
  for (var i = 0; i < len; i++) {
    _loop_1(i)
  }
  form.querySelectorAll(".chip-list").forEach(function (divChip) {
    var name = divChip.getAttribute("data-name")
    if (name && name.length > 0) {
      var dv = divChip.getAttribute("data-value")
      if (dv) {
        var v = getChipObjects(divChip, dv, divChip.getAttribute("data-text"), divChip.getAttribute("data-star"))
        setValue(obj, name, v)
      } else {
        var v = getChipsByElement(divChip)
        setValue(obj, name, v)
      }
    }
  })
  return obj
}
function getChips(chipId) {
  var container = document.getElementById(chipId)
  return getChipsByElement(container)
}
function getChipsByElement(container) {
  if (container) {
    return Array.from(container.querySelectorAll(".chip")).map(function (chip) {
      var v = chip.getAttribute("data-value")
      return v ? v.trim() : ""
    })
  } else {
    return []
  }
}
function getChipObjects(container, value, text, star) {
  if (container) {
    return Array.from(container.querySelectorAll(".chip")).map(function (chip) {
      var _a
      var obj = {}
      var v = chip.getAttribute("data-value")
      obj[value] = v ? v.trim() : ""
      if (text) {
        obj[text] = (_a = chip.firstChild) === null || _a === void 0 ? void 0 : _a.textContent
      }
      if (star) {
        var i = chip.querySelector("i.star.highlight")
        if (i) {
          obj[star] = true
        }
      }
      return obj
    })
  } else {
    return []
  }
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
function clearMessage(e) {
  var ele = e.target
  if (ele && ele.parentElement) {
    removeClasses(ele.parentElement, ["alert-error", "alert-warning", "alert-info"])
    ele.parentElement.innerText = ""
  }
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
function deleteFields(obj, fields) {
  var l = fields.length
  for (var i = 0; i < l; i++) {
    delete obj[fields[i]]
  }
}
function submitFormData(e, partId) {
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
              var pageId = partId && partId.length > 0 ? partId : resources.pageBody
              var pageBody = document.getElementById(pageId)
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
function submitForm(e, skipValidate, skipConfirm, f1, v1, f2, v2) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  if (skipValidate) {
    var valid = validateForm(form)
    if (!valid) {
      return
    }
  }
  var resource = getResource()
  var successMsg = getSuccessMessage(target, resource)
  if (skipConfirm) {
    handleSubmitForm(form, successMsg, f1, v1, f2, v2)
  } else {
    var confirmMsg = getConfirmMessage(target, resource)
    showConfirm(confirmMsg, function () {
      handleSubmitForm(form, successMsg, f1, v1, f2, v2)
    })
  }
}
function handleSubmitForm(form, successMsg, f1, v1, f2, v2) {
  showLoading()
  var data = decode(form)
  if (f1 && f1.length > 0) {
    data[f1] = v1
  }
  if (f2 && f2.length > 0) {
    data[f2] = v2
  }
  var resource = getResource()
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
