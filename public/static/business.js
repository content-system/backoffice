"use strict"
function saveJob(e) {
  e.preventDefault()
  const target = e.target
  const form = target.form
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  let job = decodeFromForm(form)
  job.skills = getChips("chipSkills")
  deleteFields(job, ["txtSkill", "btnAddSkill"])
  showConfirm(resource.msg_confirm_save, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(job),
    })
      .then((response) => {
        hideLoading()
        if (response.ok) {
          alertSuccess(getSuccessMessage(target, resource))
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}
