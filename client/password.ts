function changePassword(e: Event) {
  e.preventDefault()
  const resource = getResource()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const eleMessage = form.querySelector(".message") as Element
  const txtUsername = getElement(form, "username") as HTMLInputElement
  const username = txtUsername.value
  if (username === "") {
    const label = getLabel(txtUsername)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtCurrentPassword = getElement(form, "currentPassword") as HTMLInputElement
  const currentPassword = txtCurrentPassword.value
  if (currentPassword === "") {
    const label = getLabel(txtCurrentPassword)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtPassword = getElement(form, "password") as HTMLInputElement
  const passwordLabel = getLabel(txtPassword)
  const password = txtPassword.value
  if (password === "") {
    const msg = format(resource.error_required, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  if (!resources.password.test(password)) {
    const msg = format(resource.error_password, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtConfirmPassword = getElement(form, "confirmPassword") as HTMLInputElement
  const confirmPassword = txtConfirmPassword.value
  if (confirmPassword !== password) {
    const label = getLabel(txtConfirmPassword)
    const msg = format(resource.error_equal, label, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  const user: any = { username, currentPassword, password }
  const txtPasscode = getElement(form, "passcode") as HTMLInputElement
  if (!isHidden(txtPasscode)) {
    const passcode = txtPasscode.value
    if (passcode === "") {
      const label = getLabel(txtPasscode)
      const msg = format(resource.error_required, label)
      showErrorMessage(eleMessage, msg)
      return
    }
    user.passcode = passcode
    user.step = 2
  }
  const url = getCurrentURL()
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          if (result) {
            showInfoMessage(eleMessage, resource.success_change_password)
          } else {
            showErrorMessage(eleMessage, resource.fail_change_password)
          }
        })
      } else {
        if (response.status === 401) {
          response
            .text()
            .then((msg) => {
              showErrorMessage(eleMessage, msg)
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else if (response.status === 409) {
          showErrorMessage(eleMessage, resource.password_duplicate)
        } else if (response.status === 403) {
          if (isHidden(txtPasscode.parentElement)) {
            hideElement(txtCurrentPassword.parentElement)
            hideElement(txtPassword.parentElement)
            hideElement(txtConfirmPassword.parentElement)
            unhideElement(txtPasscode.parentElement)
          } else {
            showErrorMessage(eleMessage, resource.msg_passcode_incorrect)
          }
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      }
    })
    .catch((err) => handleError(err, resource.error_network))
}
function forgotPassword(e: Event) {
  e.preventDefault()
  const resource = getResource()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const eleMessage = form.querySelector(".message") as Element
  const txtContact = getElement(form, "contact") as HTMLInputElement
  const contact = txtContact.value
  if (contact === "") {
    const label = getLabel(txtContact)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  if (!isEmail(contact) && !isUsername(contact)) {
    showErrorMessage(eleMessage, resource.error_contact_exp)
    return
  }
  const url = getCurrentURL()
  const user = { contact }
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) {
        showInfoMessage(eleMessage, resource.success_forgot_password)
      } else {
        if (response.status === 404) {
          showErrorMessage(eleMessage, resource.fail_forgot_password)
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      }
    })
    .catch((err) => handleError(err, resource.error_network))
}
function resetPassword(e: Event) {
  e.preventDefault()
  const resource = getResource()
  const target = e.target as HTMLButtonElement
  const form = target.form as HTMLFormElement
  const eleMessage = form.querySelector(".message") as Element
  const txtUsername = getElement(form, "username") as HTMLInputElement
  const username = txtUsername.value
  if (username === "") {
    const label = getLabel(txtUsername)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtPasscode = getElement(form, "passcode") as HTMLInputElement
  const passcode = txtPasscode.value
  if (passcode === "") {
    const label = getLabel(txtPasscode)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtPassword = getElement(form, "password") as HTMLInputElement
  const passwordLabel = getLabel(txtPassword)
  const password = txtPassword.value
  if (password === "") {
    const msg = format(resource.error_required, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  if (!resources.password.test(password)) {
    const msg = format(resource.error_password, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  const txtConfirmPassword = getElement(form, "confirmPassword") as HTMLInputElement
  const confirmPassword = txtConfirmPassword.value
  if (confirmPassword !== password) {
    const label = getLabel(txtConfirmPassword)
    const msg = format(resource.error_equal, label, passwordLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  const url = getCurrentURL()
  const user = { username, passcode, password }
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) {
        showInfoMessage(eleMessage, resource.success_reset_password)
      } else {
        if (response.status === 401) {
          response
            .text()
            .then((msg) => {
              showErrorMessage(eleMessage, msg)
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else if (response.status === 409) {
          showErrorMessage(eleMessage, resource.password_duplicate)
        } else if (response.status === 403) {
          showErrorMessage(eleMessage, resource.fail_reset_password)
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      }
    })
    .catch((err) => handleError(err, resource.error_network))
}
