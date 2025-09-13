"use strict"
function getValues(form, name) {
  var v = []
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        v.push(ele.value)
      }
    }
  }
  return v
}
function getCheckedValues(form, name) {
  var v = []
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name && ele.checked) {
        v.push(ele.value)
      }
    }
  }
  return v
}
function checkAllOnClick(target, name) {
  var form = target.form
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        ele.checked = target.checked
      }
    }
  }
}
function checkAll(target, name, v) {
  if (v === void 0) {
    v = false
  }
  var form = target.form
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        ele.checked = v
      }
    }
  }
}
function uncheckAll(target, name) {
  checkAll(target, name, false)
}
function toggleHiddenElements(form, names) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (names.includes(ele.name)) {
        ele.hidden = !ele.hidden
      }
    }
  }
}
function toggleHiddenOnClick(btn, name) {
  toggleHiddenInput(btn.form, name)
}
function toggleHiddenInput(form, name) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.name === name) {
        toggleHidden(ele)
      }
    }
  }
}
function toggleAttribute(el, attr) {
  if (el.hasAttribute(attr)) {
    el.removeAttribute(attr)
    return false
  } else {
    el.setAttribute(attr, "")
    return true
  }
}
function toggleHidden(e) {
  return toggleAttribute(e, "hidden")
}
function removeOnClick(e, name, parentClass) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  if (form) {
    var removedList = []
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele.checked && ele.name === name) {
        var parent_1 = findParent(ele, parentClass)
        if (parent_1) {
          removedList.push(parent_1)
        }
      }
    }
    var l = removedList.length
    for (var i = 0; i < l; i++) {
      var ele = removedList[i]
      ele.remove()
    }
  }
}
function selectOnClick(btn, name, names) {
  var _a
  var select = (_a = btn.form) === null || _a === void 0 ? void 0 : _a.getAttribute("select")
  toggleHiddenInput(btn.form, name)
  toggleHiddenElements(btn.form, names)
}
