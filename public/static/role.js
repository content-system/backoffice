function assignUsersToRole(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var users = getValues(form, "userId")
  var resource = getResource()
  var msg = users.length === 0 ? target.getAttribute("data-warning") : resource.msg_confirm_save
  showConfirm(msg, function () {
    showLoading()
    fetch(getCurrentURL(), {
      method: "PATCH",
      headers: getHttpHeaders(),
      body: JSON.stringify(users),
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