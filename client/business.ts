interface Job {
  id: string
  title: string
  description: string
  publishedAt?: Date
  expiredAt?: Date
  position?: string
  quantity?: number
  location?: string
  applicantCount?: number
  skills?: string[]
  minSalary?: number
  maxSalary?: number
  companyId?: string
  status: string
}

function saveJob(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  let job = decodeFromForm<Job>(form)
  job.skills = getChips("jobForm_chipSkills")
  deleteFields(job, ["txtSkill", "btnAddSkill"])
  showConfirm(resource.msg_confirm_save, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(job), // Convert the form data to JSON format
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

interface Article {
  id: string
  title: string
  description?: string
  thumbnail?: string
  publishedAt: Date
  tags?: string[]
  type?: string
  content: string
  author?: string
  status?: string
}
function saveArticle(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const valid = validateForm(form)
  if (!valid) {
    return
  }
  const resource = getResource()
  let job = decodeFromForm<Article>(form)
  job.tags = getChips("articleForm_chipTags")
  deleteFields(job, ["txtTag", "btnAddTag"])
  showConfirm(resource.msg_confirm_save, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "POST",
      headers: getHttpHeaders(),
      body: JSON.stringify(job), // Convert the form data to JSON format
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

function assignRolesToUser(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const roles = getCheckboxValues(form, "id")
  const resource = getResource()
  const msg = roles.length === 0 ? "{{resource.msg_confirm_assign_roles_to_user}}" : "{{resource.msg_confirm_save}}"
  showConfirm(msg, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "PATCH",
      headers: getHttpHeaders(),
      body: JSON.stringify(roles), // Convert the form data to JSON format
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
