"use strict"
function createChip(container, text) {
  const chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text
  const close = document.createElement("span")
  close.className = "close"
  close.onclick = () => chip.remove()
  chip.appendChild(close)
  container.appendChild(chip)
  return chip
}
function getChips(chipId) {
  const container = document.getElementById(chipId)
  if (container) {
    return Array.from(container.querySelectorAll(".chip")).map((chip) => {
      var _a, _b
      const firstChild = chip.firstChild
      return (_b = (_a = firstChild === null || firstChild === void 0 ? void 0 : firstChild.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !==
        null && _b !== void 0
        ? _b
        : ""
    })
  } else {
    return []
  }
}
function addChip(triggerElement, inputName, chipId) {
  const form = triggerElement.tagName === "FORM" ? triggerElement : triggerElement.form
  if (!form) return
  const input = getElement(form, inputName)
  if (!input) return
  const value = input.value.trim()
  if (!value) return
  const chipList = document.getElementById(chipId)
  if (!chipList) return
  createChip(chipList, value)
  input.value = ""
}
function chipOnKeydown(e, chipId) {
  if (e.key === "Enter") {
    e.preventDefault()
    const target = e.target
    if (!target.readOnly && !target.disabled) {
      addChip(target.form, target.name, chipId)
    }
  }
}
function removeChip(e) {
  let target = e.target
  if (target.tagName === "SPAN") {
    target = target.parentElement
  }
  target.remove()
}
