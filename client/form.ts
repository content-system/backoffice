function parseDate(v: string, format?: string): Date {
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

function getDecimalSeparator(ele: HTMLInputElement): string {
  let separator = ele.getAttribute("data-decimal-separator")
  if (!separator) {
    const form = ele.form
    if (form) {
      separator = form.getAttribute("data-decimal-separator")
    }
  }
  return separator ? separator : "."
}
function getGroupSeparator(ele: HTMLInputElement): string | null | undefined {
  let separator = ele.getAttribute("data-group-separator")
  if (!separator) {
    const form = ele.form
    if (form) {
      separator = form.getAttribute("data-group-separator")
    }
  }
  return separator
}

const d = "data-value"
function selectOnChange(ele: HTMLSelectElement, attr?: string): void {
  const at = attr && attr.length > 0 ? attr : d
  if (ele.value === "") {
    ele.removeAttribute(at)
  } else {
    ele.setAttribute(at, ele.value)
  }
}
//detect Ctrl + [a, v, c, x]
function detectCtrlKeyCombination(e: KeyboardEvent) {
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
    for (let i = 0; i < forbiddenKeys.length; i++) {
      if (forbiddenKeys[i] == chr) {
        return true
      }
    }
  }
  return false
}
function digitOnKeyPress(e: KeyboardEvent) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  const key = window.event ? (e as any).keyCode : (e as any).which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var keychar = String.fromCharCode(key)
  var reg = /\d/
  return reg.test(keychar)
}
function integerOnKeyPress(e: KeyboardEvent) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  const key = window.event ? (e as any).keyCode : (e as any).which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var ele = e.target as HTMLInputElement
  var keychar = String.fromCharCode(key)
  if (keychar == "-") {
    if (ele.value.indexOf("-") >= 0 || isNaN(ele.min as any) || parseInt(ele.min) >= 0) {
      return false
    }
    return key
  }
  var reg = /\d/
  return reg.test(keychar)
}
function numberOnKeyPress(e: KeyboardEvent) {
  if (detectCtrlKeyCombination(e)) {
    return true
  }
  const key = window.event ? (e as any).keyCode : (e as any).which
  if (key == 13 || key == 8 || key == 9 || key == 11 || key == 127 || key == "\t") {
    return key
  }
  var ele = e.target as HTMLInputElement
  var keychar = String.fromCharCode(key)
  if (keychar == "-") {
    if (ele.value.indexOf("-") >= 0 || isNaN(ele.min as any) || parseInt(ele.min) >= 0) {
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
function trimTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function addDays(d: Date, n: number): Date {
  const newDate = new Date(d)
  newDate.setDate(newDate.getDate() + n)
  return newDate
}
function formatDate(d: Date | null | undefined, format?: string): string {
  if (!d || !format) {
    return ""
  }
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()

  let out = ""
  let i = 0

  while (i < format.length) {
    const c = format.charCodeAt(i)

    // yyyy / yy
    if (c === 121 /* y */) {
      const len = count(format, i, 121)
      if (len >= 4) {
        out += y.toString()
        i += 4
      } else {
        out += shortYear(y)
        i += 2
      }
      continue
    }

    // MM / M
    if (c === 77 /* M */) {
      const len = count(format, i, 77)
      out += len >= 2 ? pad(m) : m.toString()
      i += len >= 2 ? 2 : 1
      continue
    }

    // dd / d
    if (c === 100 /* d */) {
      const len = count(format, i, 100)
      out += len >= 2 ? pad(day) : day.toString()
      i += len >= 2 ? 2 : 1
      continue
    }

    // literal char
    out += format[i]
    i++
  }
  return out
}
function shortYear(y: number): string {
  return ((y % 100) + 100) % 100 < 10 ? "0" + (((y % 100) + 100) % 100) : "" + (((y % 100) + 100) % 100)
}
function count(s: string, i: number, ch: number): number {
  let n = 0
  while (i + n < s.length && s.charCodeAt(i + n) === ch) {
    n++
  }
  return n
}
function pad(n: number): string {
  return n < 10 ? "0" + n : n.toString()
}
function pad3(n: number): string {
  if (n >= 100) {
    return n.toString()
  }
  return n < 10 ? "00" + n : "0" + n.toString()
}
const et = ""
function formatDateTime(date: Date | null | undefined, dateFormat?: string): any {
  if (!date) {
    return et
  }
  const sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatTime(date)
}
function formatLongDateTime(date: Date | null | undefined, dateFormat?: string): any {
  if (!date) {
    return et
  }
  const sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatLongTime(date)
}
function formatFullDateTime(date: Date | null | undefined, dateFormat?: string, s?: string): any {
  if (!date) {
    return et
  }
  const sd = formatDate(date, dateFormat)
  if (sd.length === 0) {
    return sd
  }
  return sd + " " + formatFullTime(date, s)
}
function formatTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes())
}
function formatLongTime(d: Date): string {
  return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
}
function formatFullTime(d: Date, s?: string): string {
  const se = s && s.length > 0 ? s : "."
  return formatLongTime(d) + se + pad3(d.getMilliseconds())
}

function getValue(form: HTMLFormElement | null | undefined, name: string): string | null {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        return ele.value
      }
    }
  }
  return null
}
function getElement(form: HTMLFormElement | undefined | null, name: string): Element | null {
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

function valueOf(obj: any, key: string): any {
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
function getDirectValue(obj: any, key: string): any {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key]
  }
  return null
}
function setValue(obj: any, key: string, value: any): any {
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
function setKey(_object: any, _isArrayKey: boolean, _key: string, _nextValue: any) {
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

function normalizePhone(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buf = new Array<string>(len)
  let j = 0
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)
    if (c === 43 || (c >= 48 && c <= 57)) {
      buf[j++] = s[i]
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
function normalizeInteger(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buf = new Array<string>(len)
  let j = 0
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}

// Keep a single dot
function removeSeparators(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buffer = new Uint16Array(len) // preallocate max possible
  let write = 0

  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)
    // '0'–'9' (48–57), '.' (46)
    if ((c >= 48 && c <= 57) || c === 46) {
      buffer[write++] = c
    }
  }
  // Convert only the used portion to string
  return String.fromCharCode.apply(null, buffer.subarray(0, write) as any)
}
// Keep digits 0–9 ; Replace , and ٫ (Arabic decimal separator) → . ; Remove everything else => < 100 char: Array<string> version can actually be just as fast or faster due to lower overhead
function normalizeNumber(s?: string | null): string {
  if (!s) {
    return ""
  }
  const len = s.length
  const buf = new Array<string>(len)
  let j = 0
  for (let i = 0; i < len; i++) {
    const c = s.charCodeAt(i)

    if (c >= 48 && c <= 57) {
      buf[j++] = s[i]
    } else if (c === 44 || c === 1643) {
      buf[j++] = "."
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("")
}
function decodeFromElement<T>(parent: HTMLElement | null | undefined, fields: string[]): T {
  const obj = {} as any
  if (parent) {
    for (const field of fields) {
      const ele = parent.querySelector(`input[name="${escapeHTML(field)}"]`) as HTMLInputElement
      if (ele) {
        const type = ele.type
        if (type === "checkbox") {
          obj[field] = ele.checked
        } else if (type === "date") {
          if (ele.value.length === 10) {
            obj[field] = ele.value
          }
        } else if (type === "datetime-local") {
          if (ele.value.length > 0) {
            try {
              const val = new Date(ele.value) // DateUtil.parse(ele.value, 'YYYY-MM-DD');
              obj[field] = val
            } catch (err) { }
          }
        } else {
          const datatype = ele.getAttribute("data-type")
          let v = ele.value.trim()
          if (datatype === "phone" || datatype === "fax") {
            obj[field] = normalizePhone(v)
          } else if (datatype === "integer") {
            if (v) {
              v = normalizeInteger(v)
              const val = isNaN(v as any) ? null : parseFloat(v)
              obj[field] = val
            } else {
              obj[field] = undefined
            }
          } else if (datatype === "number" || datatype === "currency") {
            const decimalSeparator = getDecimalSeparator(ele)
            v = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v) : removeSeparators(v)
            if (v) {
              const val = isNaN(v as any) ? null : parseFloat(v)
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
function decode<T>(form: HTMLFormElement, currencySymbol?: string | null): T {
  const dateFormat = form.getAttribute("data-date-format")
  const obj = {} as T
  const len = form.length
  for (let i = 0; i < len; i++) {
    const ele = form[i] as HTMLInputElement
    let name = ele.getAttribute("name")
    const id = ele.getAttribute("id")
    let val: any
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
      if (nodeName === "INPUT" && type != null) {
        nodeName = type.toUpperCase()
      }
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && ele.getAttribute("data-skip") !== "true") {
        switch (type) {
          case "checkbox":
            if (id && name !== id) {
              // obj[name] = !obj[name] ? [] : obj[name];
              val = valueOf(obj, name) // val = obj[name];
              if (!val) {
                val = []
              }
              if (ele.checked) {
                val.push(ele.value)
                // obj[name].push(ele.value);
              } else {
                // tslint:disable-next-line: triple-equals
                val = val.filter((item: string) => item != ele.value)
              }
            } else {
              val = ele.value !== "on" ? ele.value : ele.checked
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
          const d = parseDate(val, dateFormat)
          val = d.toString() === "Invalid Date" ? null : d
        }
        const datatype = ele.getAttribute("data-type")
        let v = ele.value
        if (datatype === "phone" || datatype === "fax") {
          val = normalizePhone(v)
        } else if (datatype === "integer") {
          const n0 = normalizeInteger(v)
          val = isNaN(n0 as any) ? undefined : parseFloat(v)
        } else if (datatype === "number" || datatype === "currency") {
          const decimalSeparator = getDecimalSeparator(ele)
          const n0 = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v) : removeSeparators(v)
          val = isNaN(n0 as any) ? undefined : parseFloat(v)
        }
        setValue(obj, name, val) // obj[name] = val;
      }
    }
  }
  form.querySelectorAll(".chip-list").forEach((divChip) => {
    const name = divChip.getAttribute("data-name")
    if (name && name.length > 0) {
      const dv = divChip.getAttribute("data-value")
      if (dv) {
        const v = getChipObjects(divChip, dv, divChip.getAttribute("data-text"), divChip.getAttribute("data-star"))
        setValue(obj, name, v)
      } else {
        const v = getChipsByElement(divChip)
        setValue(obj, name, v)
      }
    }
  })
  return obj
}
function getChips(chipId: string): string[] {
  const container = document.getElementById(chipId)
  return getChipsByElement(container)
}
function getChipsByElement(container?: Element | null): string[] {
  if (container) {
    return Array.from(container.querySelectorAll<HTMLElement>(".chip")).map((chip) => {
      const v = chip.getAttribute("data-value")
      return v ? v.trim() : ""
    })
  } else {
    return []
  }
}
function getChipObjects(container: Element | null | undefined, value: string, text?: string | null, star?: string | null): any[] {
  if (container) {
    return Array.from(container.querySelectorAll<HTMLElement>(".chip")).map((chip) => {
      const obj: any = {}
      const v = chip.getAttribute("data-value")
      obj[value] = v ? v.trim() : ""

      if (text) {
        obj[text] = chip.firstChild?.textContent
      }

      if (star) {
        const i = chip.querySelector("i.star.highlight")
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

function removeMessage(ele?: Element | null): boolean {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-warning", "alert-info"])
    ele.innerHTML = ""
    return true
  }
  return false
}

function hideElement(ele: HTMLElement | null | undefined): boolean {
  if (ele) {
    ele.hidden = true
    return true
  }
  return false
}
function unhideElement(ele: HTMLElement | null | undefined): boolean {
  if (ele) {
    ele.hidden = false
    return true
  }
  return false
}
function isHidden(ele: HTMLElement | null | undefined): boolean {
  if (ele) {
    return (ele.hidden as boolean) || ele.style.display === "none"
  }
  return true
}

function clearMessage(e: Event) {
  const ele = e.target as HTMLInputElement
  if (ele && ele.parentElement) {
    removeClasses(ele.parentElement, ["alert-error", "alert-warning", "alert-info"])
    ele.parentElement.innerText = ""
  }
}
function showErrorMessage(ele: Element | null, msg: string): boolean {
  if (ele) {
    removeClasses(ele, ["alert-warning", "alert-info"])
    if (!ele.classList.contains("alert-error")) {
      ele.classList.add("alert-error")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showErrorMessageOfForm(form: HTMLFormElement, msg: string): boolean {
  const ele = form.querySelector(".message")
  return showErrorMessage(ele, msg)
}
function showWarningMessage(ele: Element | null, msg: string): boolean {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-info"])
    if (!ele.classList.contains("alert-warning")) {
      ele.classList.add("alert-warning")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showWarningMessageOfForm(form: HTMLFormElement, msg: string): boolean {
  const ele = form.querySelector(".message")
  return showWarningMessage(ele, msg)
}
function showInfoMessage(ele: Element | null, msg: string): boolean {
  if (ele) {
    removeClasses(ele, ["alert-error", "alert-warning"])
    if (!ele.classList.contains("alert-info")) {
      ele.classList.add("alert-info")
    }
    ele.innerHTML = msg + '<span onclick="clearMessage(event)"></span>'
  }
  return false
}
function showInfoMessageOfForm(form: HTMLFormElement, msg: string): boolean {
  const ele = form.querySelector(".message")
  return showInfoMessage(ele, msg)
}

function setInputValue(form: HTMLFormElement | null | undefined, name: string, value: string): boolean {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        ele.value = value
        return true
      }
    }
  }
  return false
}

function getHttpHeaders(): any {
  const token = getToken()
  const lang = getLang()
  if (lang) {
    if (token && token.length > 0) {
      return {
        "Content-Type": "application/json;charset=utf-8", // Ensure the server understands the content type
        "Content-Language": lang,
        Authorization: `Bearer ${token}`, // Include the JWT
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
        "Content-Type": "application/json;charset=utf-8", // Ensure the server understands the content type
        Authorization: `Bearer ${token}`, // Include the JWT
      }
    } else {
      return {
        "Content-Type": "application/json;charset=utf-8",
      }
    }
  }
}
function getConfirmMessage(ele: HTMLButtonElement, resource: StringMap): string {
  let confirmMsg = ele.getAttribute("data-message")
  return confirmMsg ? confirmMsg : resource.msg_confirm_save
}

function deleteFields(obj: any, fields: string[]) {
  const l = fields.length
  for (let i = 0; i < l; i++) {
    delete obj[fields[i]]
  }
}
function submitFormData(e: Event, partId?: string) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
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
              const pageId = partId && partId.length > 0 ? partId : resources.pageBody
              const pageBody = document.getElementById(pageId)
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
function handlePostError(response: Response, resource: StringMap) {
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
function getSuccessMessage(ele: HTMLButtonElement, resource: StringMap): string {
  let successMsg = ele.getAttribute("data-success")
  return successMsg ? successMsg : resource.msg_save_success
}
function submitForm(e: Event, skipValidate?: boolean, skipConfirm?: boolean, f1?: string, v1?: string | number, f2?: string, v2?: string | number) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  if (skipValidate) {
    const valid = validateForm(form)
    if (!valid) {
      return
    }
  }
  const resource = getResource()
  const successMsg = getSuccessMessage(target, resource)
  if (skipConfirm) {
    handleSubmitForm(form, successMsg, f1, v1, f2, v2)
  } else {
    const confirmMsg = getConfirmMessage(target, resource)
    showConfirm(confirmMsg, () => {
      handleSubmitForm(form, successMsg, f1, v1, f2, v2)
    })
  }
}
function handleSubmitForm(form: HTMLFormElement, successMsg: string, f1?: string, v1?: string | number, f2?: string, v2?: string | number) {
  showLoading()
  const data: any = decode(form)
  if (f1 && f1.length > 0) {
    data[f1] = v1
  }
  if (f2 && f2.length > 0) {
    data[f2] = v2
  }
  const resource = getResource()
  const url = getCurrentURL()
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(data), // Convert the form data to JSON format
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
}
function handleJsonError(response: Response, resource: StringMap, form: HTMLFormElement, showErrors?: (errs: ErrorMessage[]) => void, allErrors?: boolean) {
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
