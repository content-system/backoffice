function createChip(container: HTMLElement, value: string, text: string, inputContainer?: HTMLElement | null, star?: boolean): HTMLElement {
  const chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text
  chip.setAttribute("data-value", value)

  if (star) {
    const i = document.createElement("i")
    i.className = "star highlight"
    chip.appendChild(i)
  }
  const close = document.createElement("span")
  close.className = "close"
  close.onclick = () => chip.remove()

  chip.appendChild(close)
  if (inputContainer) {
    container.insertBefore(chip, inputContainer)
  } else {
    container.appendChild(chip)
  }
  return chip
}
function addChip(triggerElement: HTMLButtonElement | HTMLInputElement, inputName?: string, chipId?: string): void {
  let input: HTMLInputElement
  const parent = triggerElement.parentElement
  if (triggerElement.nodeName === "INPUT") {
    input = triggerElement as HTMLInputElement
  } else {
    const form = triggerElement.form
    if (!form) return
    if (inputName) {
      input = getElement(form, inputName) as HTMLInputElement
    } else {
      input = parent?.firstElementChild as HTMLInputElement
    }
  }
  let isCheck: boolean = false
  if (parent) {
    const checkbox = parent.querySelector('input[type="checkbox"]') as HTMLInputElement
    isCheck = checkbox && checkbox.checked
  }
  if (!input) return

  const value = input.value.trim()
  if (!value) return
  let chipList: HTMLElement | null
  if (chipId) {
    chipList = document.getElementById(chipId)
  } else {
    chipList = findParent(triggerElement, "chip-list")
  }
  if (!chipList) return
  if (checkDuplicateChip(chipList, value)) {
    let msg = input.getAttribute("data-duplicate")
    if (!msg) {
      msg = "Duplicate value"
    }
    alertError(msg)
    return
  }
  createChip(chipList, value, value, parent, isCheck)
  input.value = ""
}
function checkDuplicateChip(chipList: HTMLElement, value: string): boolean {
  const chips = chipList.querySelectorAll(".chip")
  for (let i = 0; i < chips.length; i++) {
    const chip = chips[i] as HTMLDivElement
    if (chip.getAttribute("data-value") === value) {
      return true
    }
  }
  return false
}
function chipOnKeydown(e: KeyboardEvent, chipId: string) {
  if (e.key === "Enter") {
    e.preventDefault()
    const target = e.target as HTMLInputElement
    if (!target.readOnly && !target.disabled) {
      addChip(target, target.name, chipId)
    }
  }
}
function removeChip(e: Event) {
  let target = e.target as HTMLElement
  if (target.tagName === "SPAN") {
    target = target.parentElement as HTMLDivElement
  }
  target.remove()
}
