"use strict"
function createChip(container, value, text, inputContainer, star) {
  var chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text
  chip.setAttribute("data-value", value)
  if (star) {
    var i = document.createElement("i")
    i.className = "star highlight"
    chip.appendChild(i)
  }
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
function addChip(triggerElement, inputName, chipId) {
  var input
  var parent = triggerElement.parentElement
  if (triggerElement.nodeName === "INPUT") {
    input = triggerElement
  } else {
    var form = triggerElement.form
    if (!form) return
    if (inputName) {
      input = getElement(form, inputName)
    } else {
      input = parent === null || parent === void 0 ? void 0 : parent.firstElementChild
    }
  }
  var isCheck = false
  if (parent) {
    var checkbox = parent.querySelector('input[type="checkbox"]')
    isCheck = checkbox && checkbox.checked
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
  if (checkDuplicateChip(chipList, value)) {
    var msg = input.getAttribute("data-duplicate")
    if (!msg) {
      msg = "Duplicate value"
    }
    alertError(msg)
    return
  }
  createChip(chipList, value, value, parent, isCheck)
  input.value = ""
}
function checkDuplicateChip(chipList, value) {
  var chips = chipList.querySelectorAll(".chip")
  for (var i = 0; i < chips.length; i++) {
    var chip = chips[i]
    if (chip.getAttribute("data-value") === value) {
      return true
    }
  }
  return false
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
