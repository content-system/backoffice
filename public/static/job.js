function toggleView(viewId, editorId, toolbarId) {
  var contentView = document.querySelector("#" + viewId)
  var editor = document.querySelector("#" + editorId)
  var toolbar = document.querySelector("#" + toolbarId)
  if (contentView && editor && toolbar) {
    if (contentView.style.display !== "none") {
      if (contentView.form) {
        contentView.form.quill.clipboard.dangerouslyPasteHTML(contentView.value)
      }
      contentView.style.display = "none"
      editor.style.display = "block"
      toolbar.style.display = "block"
    } else {
      if (contentView.form) {
        contentView.value = contentView.form.quill.root.innerHTML
      }
      contentView.style.display = "block"
      editor.style.display = "none"
      toolbar.style.display = "none"
    }
  }
}
