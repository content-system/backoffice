function toggleView(target, viewId, editorId, toolbarId) {
  var form = target.form
  if (form) {
    var contentView = form.querySelector("#" + viewId)
    var editor = form.querySelector("#" + editorId)
    var toolbar_1 = form.querySelector("#" + toolbarId)
    if (contentView && editor && toolbar_1) {
      if (contentView.style.display !== "none") {
        if (contentView.form) {
          contentView.form.quill.clipboard.dangerouslyPasteHTML(contentView.value)
        }
        contentView.style.display = "none"
        editor.style.display = "block"
        toolbar_1.style.display = "block"
      } else {
        if (contentView.form) {
          contentView.value = contentView.form.quill.root.innerHTML
        }
        contentView.style.display = "block"
        editor.style.display = "none"
        toolbar_1.style.display = "none"
      }
    }
  }
}
