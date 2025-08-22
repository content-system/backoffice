function createChip(container: HTMLElement, text: string, inputContainer?: HTMLElement | null): HTMLElement {
  const chip = document.createElement("div")
  chip.className = "chip"
  chip.textContent = text

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
  if (container) {
    return Array.from(container.querySelectorAll<HTMLElement>(".chip")).map((chip) => {
      const firstChild = chip.firstChild
      return firstChild?.textContent?.trim() ?? ""
    })
  } else {
    return []
  }
}

function addChip(triggerElement: HTMLButtonElement | HTMLInputElement, inputName: string, chipId: string): void {
  const form = triggerElement.form
  if (!form) return

  const input = getElement(form, inputName) as HTMLInputElement
  if (!input) return

  const value = input.value.trim()
  if (!value) return

  const chipList = document.getElementById(chipId)
  if (!chipList) return

  createChip(chipList, value, triggerElement.parentElement)
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
