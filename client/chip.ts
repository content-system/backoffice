function createChip(container: HTMLElement, value: string, text: string, inputContainer?: HTMLElement | null): HTMLElement {
  const chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text
  chip.setAttribute("data-value", value)

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

function addChip(triggerElement: HTMLButtonElement | HTMLInputElement, inputName?: string, chipId?: string): void {
  let input: HTMLInputElement
  if (triggerElement.nodeName === "INPUT") {
    input = triggerElement as HTMLInputElement
  } else {
    const form = triggerElement.form
    if (!form) return
    if (inputName) {
      input = getElement(form, inputName) as HTMLInputElement
    } else {
      input = triggerElement.parentElement?.firstElementChild as HTMLInputElement
    }
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

  createChip(chipList, value, value, triggerElement.parentElement)
  input.value = ""
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
