export interface Job {
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

  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
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
  job.skills = getChips("chipList")
  deleteFields(job, ["skillInput"])
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
          alertSuccess(getSuccessMessage(target, resource))
        } else {
          handleJsonError(response, resource, form)
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}
