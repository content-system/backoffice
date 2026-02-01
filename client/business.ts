function approve(e: Event) {
  e.preventDefault()
  const resource = getResource()
  showConfirm(resource.msg_confirm_approve, () => {
    let url = getCurrentURL()
    showLoading()
    fetch(url, {
      method: "PATCH",
      headers: getHttpHeaders(),
    })
      .then((response) => {
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
              .then((result) => {
                if (result === -2) {
                  alertError(resource.msg_approver_conflict)
                } else {
                  alertError(resource.msg_approve_conflict)
                }
              })
              .catch((err) => handleError(err, resource.error_response_body))
            alertWarning(resource.article_save_fail)
          }
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}
function reject(e: Event) {
  e.preventDefault()
  const resource = getResource()
  showConfirm(resource.msg_confirm_reject, () => {
    let url = getCurrentURL()
    url = removeLast(url) + "/reject"
    showLoading()
    fetch(url, {
      method: "PATCH",
      headers: getHttpHeaders(),
    })
      .then((response) => {
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
              .then((result) => {
                if (result === -2) {
                  alertError(resource.msg_approver_conflict)
                } else {
                  alertError(resource.msg_reject_conflict)
                }
              })
              .catch((err) => handleError(err, resource.error_response_body))
            alertWarning(resource.article_save_fail)
          }
        }
      })
      .catch((err) => handleError(err, resource.error_network))
  })
}

resources.load = function (pageBody: HTMLElement) {
  const checkbox = document.getElementById("roleAssignmentForm_checkAll")
  if (checkbox) {
    checkbox.addEventListener("click", (e) => {
      const target = e.target as HTMLInputElement
      checkAllOnClick(target, "id")
    })
  }
}
function assignRolesToUser(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const roles = getCheckedValues(form, "id")
  const resource = getResource()
  const msg = roles.length === 0 ? (target.getAttribute("data-warning") as string) : resource.msg_confirm_save
  showConfirm(msg, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "PATCH",
      headers: getHttpHeaders(),
      body: JSON.stringify(roles),
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

function assignUsersToRole(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const users = getValues(form, "userId")
  const resource = getResource()
  const msg = users.length === 0 ? (target.getAttribute("data-warning") as string) : resource.msg_confirm_save
  showConfirm(msg, () => {
    showLoading()
    fetch(getCurrentURL(), {
      method: "PATCH",
      headers: getHttpHeaders(),
      body: JSON.stringify(users),
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

function toggleView(target: HTMLButtonElement, viewId: string, editorId: string, toolbarId: string) {
  const form = target.form
  if (form) {
    const contentView = form.querySelector("#" + viewId) as HTMLTextAreaElement
    const editor = form.querySelector("#" + editorId) as HTMLElement
    const toolbar = form.querySelector("#" + toolbarId) as HTMLElement

    if (contentView && editor && toolbar) {
      if (contentView.style.display !== "none") {
        // HTML to Quill
        if (contentView.form) {
          // quill.root.innerHTML = htmlEditor.value
          // quill.setContents(htmlEditor.value)
          contentView.form.quill.clipboard.dangerouslyPasteHTML(contentView.value)
        }
        contentView.style.display = "none"
        editor.style.display = "block"
        toolbar.style.display = "block"
      } else {
        // Quill to HTML
        if (contentView.form) {
          let html = contentView.form.quill.root.innerHTML
          html = html.replace(/ class=\"ql-indent-\\d+\"/g, "")
          contentView.value = html
        }
        contentView.style.display = "block"
        editor.style.display = "none"
        toolbar.style.display = "none"
      }
    }
  }
}

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
  let job = decode<Job>(form)
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
  let job = decode<Article>(form)
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
