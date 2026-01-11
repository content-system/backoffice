"use strict"
function loadAjax(url, container, handleSuccess, handleFail) {
  fetch(url, {
    method: "GET",
    headers: getHttpHeaders(),
  })
    .then(function (response) {
      if (response.ok) {
        response
          .text()
          .then(function (data) {
            container.innerHTML = data
            if (handleSuccess) {
              handleSuccess()
            }
          })
          .catch(function (err) {
            if (handleFail) {
              handleFail()
            }
            handleError(err, resource.error_response_body)
          })
      } else {
        if (response.status === 401) {
          if (handleFail) {
            handleFail()
          }
          window.location.href = buildLoginUrl()
        } else {
          if (handleFail) {
            handleFail()
          }
          if (response.status === 403) {
            alertError(resource.error_403)
          } else if (response.status === 404) {
            alertError(resource.error_404)
          } else {
            console.error("Error: ", response.statusText)
            alertError(resource.error_ajax, response.statusText)
          }
        }
      }
    })
    .catch(function (err) {
      return handleError(err, resource.error_network)
    })
}
function hideOtherElements(form, target, className) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele !== target && ele.classList.contains(className)) {
        ele.hidden = true
      }
    }
  }
}
function showOtherElements(form, target, className) {
  if (form) {
    for (var i = 0; i < form.length; i++) {
      var ele = form[i]
      if (ele !== target && ele.classList.contains(className)) {
        ele.hidden = false
      }
    }
  }
}
function editPart(target, containerId, partialName, toggleClassName) {
  var container = document.getElementById(containerId)
  if (container) {
    var url = getCurrentURL() + "/" + partialName
    var form_1 = target.form
    if (container) {
      showLoading()
      loadAjax(
        url,
        container,
        function () {
          hideLoading()
          if (form_1 && toggleClassName) {
            hideOtherElements(form_1, target, toggleClassName)
          }
        },
        hideLoading,
      )
    }
  }
}
function closePart(target, containerId, partialName, toggleClassName) {
  var container = document.getElementById(containerId)
  if (container) {
    var url = getCurrentURL() + "/" + partialName
    var form_2 = target.form
    if (container) {
      showLoading()
      loadAjax(
        url,
        container,
        function () {
          hideLoading()
          if (form_2 && toggleClassName) {
            showOtherElements(form_2, target, toggleClassName)
          }
        },
        hideLoading,
      )
    }
  }
}
function submitPartialForm(e, containerId, successPartialName, toggleClassName, confirm) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var valid = validateForm(form)
  if (!valid) {
    return
  }
  var data = decode(form)
  var url = getCurrentURL()
  if (confirm) {
    var confirmMsg = getConfirmMessage(target, resource)
    showConfirm(confirmMsg, function () {
      callSubmitPartialForm(url, target, data, containerId, successPartialName, toggleClassName)
    })
  } else {
    callSubmitPartialForm(url, target, data, containerId, successPartialName, toggleClassName)
  }
}
function callSubmitPartialForm(url, target, data, containerId, successPartialName, toggleClassName) {
  var form = target.form
  var resource = getResource()
  var successMsg = getSuccessMessage(target, resource)
  showLoading()
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(data),
  })
    .then(function (response) {
      hideLoading()
      if (response.ok) {
        if (containerId) {
          var container_1 = document.getElementById(containerId)
          if (container_1) {
            var contentType = response.headers.get("Content-Type")
            if (contentType && contentType.includes("text/html")) {
              response
                .text()
                .then(function (data) {
                  container_1.innerHTML = data
                  if (toggleClassName) {
                    showOtherElements(form, undefined, toggleClassName)
                  }
                })
                .catch(function (err) {
                  return handleError(err, resource.error_response_body)
                })
            } else {
              loadAjax(url + "/" + successPartialName, container_1)
              if (toggleClassName) {
                showOtherElements(form, undefined, toggleClassName)
              }
            }
          }
        } else {
          alertSuccess(successMsg)
        }
      } else {
        handleJsonError(response, resource, form)
      }
    })
    .catch(function (err) {
      return handleError(err, resource.error_network)
    })
}
