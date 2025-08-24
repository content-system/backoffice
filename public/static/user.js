function assignRolesToUser(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var roles = getCheckboxValues(form, "id")
  var resource = getResource()
  var msg = roles.length === 0 ? target.getAttribute("data-warning") : resource.msg_confirm_save
  showConfirm(msg, function () {
    showLoading()
    fetch(getCurrentURL(), {
      method: "PATCH",
      headers: getHttpHeaders(),
      body: JSON.stringify(roles),
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
