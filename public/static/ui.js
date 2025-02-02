"use strict"
const sysNo = document.getElementById("sysNo")
if (sysNo) {
  sysNo.addEventListener("click", function () {
    const sysAlert = document.getElementById("sysAlert")
    if (sysAlert) {
      sysAlert.style.display = "none"
    }
    const input = sysYes["activeElement"]
    if (input) {
      try {
        input.focus()
      } catch (err) {}
    }
    sysYes["activeElement"] = undefined
  })
}
const sysYes = document.getElementById("sysYes")
if (sysYes) {
  sysYes.addEventListener("click", function () {
    const sysAlert = document.getElementById("sysAlert")
    if (sysAlert) {
      sysAlert.style.display = "none"
    }
    const input = sysYes["activeElement"]
    if (input) {
      try {
        input.focus()
      } catch (err) {}
    }
    sysYes["activeElement"] = undefined
  })
}
var yesOnClick = function () {
  const sysAlert = document.getElementById("sysAlert")
  if (sysAlert) {
    sysAlert.style.display = "none"
  }
  if (window.fyesOnClick) {
    window.fyesOnClick()
  }
  const input = sysYes["activeElement"]
  if (input) {
    try {
      input.focus()
    } catch (err) {}
  }
  sysYes["activeElement"] = undefined
}
var noOnClick = function () {
  const sysAlert = document.getElementById("sysAlert")
  if (sysAlert) {
    sysAlert.style.display = "none"
  }
  if (window.fnoOnClick) {
    window.fnoOnClick()
  }
  const input = sysYes["activeElement"]
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
    let val = parseFloat(ele.style.opacity)
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
    let val = parseFloat(ele.style.opacity)
    val = -0.1
    if (val < 0) {
      ele.style.display = "none"
    } else {
      requestAnimationFrame(fade)
    }
  })()
}
const sysToast = document.getElementById("sysToast")
function toast(msg) {
  sysToast.innerHTML = msg
  fadeIn(sysToast)
  setTimeout(() => {
    fadeOut(sysToast)
  }, 1340)
}
const sysLoading = document.getElementById("sysLoading")
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
  const isIgnore = text.indexOf("<br />") >= 0
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
  if (isIgnore) {
    text = text.replace(/&lt;br \/&gt;/g, "<br />")
  }
  return text
}
function showAlert(msg, header, type, iconType, btnLeftText, btnRightText, yesCallback, noCallback, detail) {
  const sysAlert = document.getElementById("sysAlert")
  const sysMessage = document.getElementById("sysMessage")
  const sysMessageHeader = document.getElementById("sysMessageHeader")
  const sysErrorDetail = document.getElementById("sysErrorDetail")
  const sysErrorDetailText = document.getElementById("sysErrorDetailText")
  const sysErrorDetailCaret = document.getElementById("sysErrorDetailCaret")
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
  const activeElement = window.document.activeElement
  sysYes.innerHTML = escapeHTML(btnRightText)
  sysNo.innerHTML = escapeHTML(btnLeftText)
  sysYes["activeElement"] = activeElement
  sysAlert.style.display = "flex"
  window.fyesOnClick = yesCallback
  window.fnoOnClick = noCallback
  sysYes.focus()
}
const sysMessageHeader = document.getElementById("sysMessageHeader")
function showConfirm(msg, yesCallback, header, btnLeftText, btnRightText, noCallback) {
  const h = header ? header : sysMessageHeader.getAttribute("data-confirm")
  showAlert(msg, h, "Confirm", "Confirm", btnLeftText, btnRightText, yesCallback, noCallback)
}
function alertError(msg, detail, callback, header) {
  const h = header ? header : sysMessageHeader.getAttribute("data-error")
  const buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Error", "", buttonText, callback, undefined, detail)
}
function alertWarning(msg, callback, header) {
  const h = header ? header : sysMessageHeader.getAttribute("data-warning")
  const buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Warning", "", buttonText, callback, undefined)
}
function alertInfo(msg, callback, header) {
  const h = header ? header : sysMessageHeader.getAttribute("data-info")
  const buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Info", "", buttonText, callback, undefined)
}
function alertSuccess(msg, callback, header) {
  const h = header ? header : sysMessageHeader.getAttribute("data-success")
  const buttonText = header ? header : sysMessageHeader.getAttribute("data-ok")
  showAlert(msg, h, "Alert", "Success", "", buttonText, callback, undefined)
}
