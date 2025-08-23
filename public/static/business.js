"use strict"
function saveJob(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var valid = validateForm(form)
  if (!valid) {
    return
  }
  var resource = getResource()
  var job = decodeFromForm(form)
  job.skills = getChips("jobForm_chipSkills")
  deleteFields(job, ["txtSkill", "btnAddSkill"])
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
function assignRolesToUser(e) {
  e.preventDefault()
  var target = e.target
  var form = target.form
  var roles = getCheckboxValues(form, "id")
  var resource = getResource()
  var msg = roles.length === 0 ? "{{resource.msg_confirm_assign_roles_to_user}}" : "{{resource.msg_confirm_save}}"
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
