function signup(e: Event) {
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
  const txtEmail = getElement(form, "email") as HTMLInputElement
  const emailLabel = getLabel(txtEmail)
  const email = txtEmail.value
  if (email === "") {
    const msg = format(resource.error_required, emailLabel)
    showErrorMessage(eleMessage, msg)
    return
  }
  if (!isEmail(email)) {
    const msg = format(resource.error_email, emailLabel)
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
  const user = { username, email, password }
  showLoading()
  fetch(url, {
    method: "POST",
    headers: getHttpHeaders(),
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok) {
        showInfoMessage(eleMessage, resource.success_sign_up)
      } else {
        if (response.status === 409 || response.status === 422) {
          response
            .json()
            .then((errors: ErrorMessage[]) => {
              if (Array.isArray(errors) && errors && errors.length > 0) {
                showErrorMessage(eleMessage, "" + errors[0].message)
              } else {
                showErrorMessage(eleMessage, resource.fail_sign_up)
              }
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else {
          console.error("Error: ", response.statusText)
          alertError(resource.error_submit_failed, response.statusText)
        }
      }
    })
    .catch((err) => handleError(err, resource.error_network))
}
