function getValues(form: HTMLFormElement | null | undefined, name: string): string[] {
  const v: string[] = []
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        v.push(ele.value)
      }
    }
  }
  return v
}
function getCheckedValues(form: HTMLFormElement | null | undefined, name: string): string[] {
  const v: string[] = []
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name && ele.checked) {
        v.push(ele.value)
      }
    }
  }
  return v
}

function checkAllOnClick(target: HTMLInputElement, name: string) {
  const form = target.form
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        ele.checked = target.checked
      }
    }
  }
}

function checkAll(target: HTMLButtonElement | HTMLInputElement, name: string, v?: boolean) {
  const form = target.form
  if (v === undefined) {
    v = false
  }
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        ele.checked = v
      }
    }
  }
}
function uncheckAll(target: HTMLButtonElement | HTMLInputElement, name: string) {
  checkAll(target, name, false)
}

function toggleHiddenElements(form: HTMLFormElement | null | undefined, names: string[]) {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (names.includes(ele.name)) {
        ele.hidden = !ele.hidden
      }
    }
  }
}

function toggleHiddenOnClick(btn: HTMLButtonElement, name: string) {
  toggleHiddenInputs(btn.form, name)
}

function toggleHiddenInputs(form: HTMLFormElement | null | undefined, name: string) {
  if (form) {
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.name === name) {
        toggleHidden(ele)
      }
    }
  }
}

function toggleAttribute(e: HTMLElement, attr: string): boolean {
  const isAttr = e.getAttribute(attr)
  if (isAttr == null || isAttr === "") {
    e.removeAttribute(attr)
    return true
  } else {
    e.setAttribute(attr, "")
    return false
  }
}

function toggleHidden(e: HTMLElement): boolean {
  return toggleAttribute(e, "hidden")
}

function removeOnClick(e: Event, name: string, parentClass: string) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form
  if (form) {
    const removedList: HTMLElement[] = []
    for (let i = 0; i < form.length; i++) {
      const ele = form[i] as HTMLInputElement
      if (ele.checked && ele.name === name) {
        const parent = findParent(ele, parentClass)
        if (parent) {
          removedList.push(parent)
        }
      }
    }

    const l = removedList.length
    for (let i = 0; i < l; i++) {
      const ele = removedList[i]
      ele.remove()
    }
  }
}

function selectOnClick(btn: HTMLButtonElement, name: string, names: string[]) {
  const select = btn.form?.getAttribute("select")
  toggleHiddenInputs(btn.form, name)
  toggleHiddenElements(btn.form, names)
}
