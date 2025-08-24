"use strict"
function createChip(container, value, text, inputContainer) {
  var chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text
  chip.setAttribute("data-value", value)
  var close = document.createElement("span")
  close.className = "close"
  close.onclick = function () {
    return chip.remove()
  }
  chip.appendChild(close)
  if (inputContainer) {
    container.insertBefore(chip, inputContainer)
  } else {
    container.appendChild(chip)
  }
  return chip
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
function addChip(triggerElement, inputName, chipId) {
  var _a
  var input
  if (triggerElement.nodeName === "INPUT") {
    input = triggerElement
  } else {
    var form = triggerElement.form
    if (!form) return
    if (inputName) {
      input = getElement(form, inputName)
    } else {
      input = (_a = triggerElement.parentElement) === null || _a === void 0 ? void 0 : _a.firstElementChild
    }
  }
  if (!input) return
  var value = input.value.trim()
  if (!value) return
  var chipList
  if (chipId) {
    chipList = document.getElementById(chipId)
  } else {
    chipList = findParent(triggerElement, "chip-list")
  }
  if (!chipList) return
  createChip(chipList, value, value, triggerElement.parentElement)
  input.value = ""
}
function chipOnKeydown(e, chipId) {
  if (e.key === "Enter") {
    e.preventDefault()
    var target = e.target
    if (!target.readOnly && !target.disabled) {
      addChip(target, target.name, chipId)
    }
  }
}
function removeChip(e) {
  var target = e.target
  if (target.tagName === "SPAN") {
    target = target.parentElement
  }
  target.remove()
}
