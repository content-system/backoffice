function saveArticle(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var valid = validateForm(form)
  if (!valid) {
    return
  }
  var resource = getResource()
  var job = decodeFromForm(form)
  job.tags = getChips("articleForm_chipTags")
  deleteFields(job, ["txtTag", "btnAddTag"])
  showConfirm(resource.msg_confirm_save, function () {
    showLoading()
    fetch(getCurrentURL(), {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(job),
    })
      .then(function (response) {
        hideLoading()
        if (response.ok) {
          alertSuccess(resource.msg_save_success)
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  })
}