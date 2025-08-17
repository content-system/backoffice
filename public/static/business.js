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
          alertSuccess(resource.msg_save_success)
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}
function saveArticle(e) {
  e.preventDefault()
  const target = e.target
  const form = target.form
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  let article = decodeFromForm(form)
  article.tags = getChips("chipTags")
  deleteFields(article, ["txtTag", "btnAddTag"])
  showConfirm(resource.msg_confirm_save, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(article),
    })
      .then((response) => {
        hideLoading()
        if (response.ok) {
          alertSuccess(resource.msg_save_success)
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}
