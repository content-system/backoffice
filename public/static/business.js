"use strict"
function approve(e) {
  e.preventDefault()
  var resource = getResource()
  showConfirm(resource.msg_confirm_approve, function () {
    var url = getCurrentURL()
    showLoading()
    fetch(url, {
      method: "PATCH",
      headers: getHttpHeaders(),
    })
      .then(function (response) {
        hideLoading()
        if (response.ok) {
          toast(resource.msg_approve_success)
          goBack()
        } else {
          if (response.status === 401) {
            window.location.href = buildLoginUrl()
          } else if (response.status === 410) {
            alertError(resource.error_not_found)
          } else if (response.status === 409) {
            response
              .json()
              .then(function (result) {
                if (result === -2) {
                  alertError(resource.msg_approver_conflict)
                } else {
                  alertError(resource.msg_approve_conflict)
                }
              })
              .catch(function (err) {
                return handleError(err, resource.error_response_body)
              })
            alertWarning(resource.article_save_fail)
          }
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  })
}
function reject(e) {
  e.preventDefault()
  var resource = getResource()
  showConfirm(resource.msg_confirm_reject, function () {
    var url = getCurrentURL()
    url = removeLast(url) + "/reject"
    showLoading()
    fetch(url, {
      method: "PATCH",
      headers: getHttpHeaders(),
    })
      .then(function (response) {
        hideLoading()
        if (response.ok) {
          toast(resource.msg_reject_success)
          goBack()
        } else {
          if (response.status === 401) {
            window.location.href = buildLoginUrl()
          } else if (response.status === 410) {
            alertError(resource.error_not_found)
          } else if (response.status === 409) {
            response
              .json()
              .then(function (result) {
                if (result === -2) {
                  alertError(resource.msg_approver_conflict)
                } else {
                  alertError(resource.msg_reject_conflict)
                }
              })
              .catch(function (err) {
                return handleError(err, resource.error_response_body)
              })
            alertWarning(resource.article_save_fail)
          }
        }
      })
      .catch(function (err) {
        return handleError(err, resource.error_network)
      })
  })
}
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
          var html = contentView.form.quill.root.innerHTML
          html = html.replace(/ class=\"ql-indent-\\d+\"/g, "")
          contentView.value = html
        }
        contentView.style.display = "block"
        editor.style.display = "none"
        toolbar_1.style.display = "none"
      }
    }
  }
}
