interface SignInResult {
  status: number
}
interface SignInData {
  token: string
}
function signin(e: Event) {
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
  const txtPassword = getElement(form, "password") as HTMLInputElement
  const password = txtPassword.value
  if (password === "") {
    const label = getLabel(txtPassword)
    const msg = format(resource.error_required, label)
    showErrorMessage(eleMessage, msg)
    return
  }
  const map: StringMap = {
    "2": "fail_authentication",
    "3": "fail_expired_password",
    "4": "fail_locked_account",
    "5": "fail_suspended_account",
    "6": "fail_disabled_account",
  }
  const url = getCurrentURL()
  const formData = new FormData(form)
  showLoading()
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        response.json().then((data: SignInData) => {
          localStorage.setItem(resources.token, data.token)
          window.location.href = "/"
        })
      } else {
        if (response.status === 403) {
          response
            .json()
            .then((result: SignInResult) => {
              let key: string | undefined = map["" + result.status]
              const message = key ? resource[key] : resource.fail_authentication
              showErrorMessage(eleMessage, message)
            })
            .catch((err) => handleError(err, resource.error_response_body))
        } else if (response.status === 422) {
          response
            .json()
            .then((errors: ErrorMessage[]) => {
              if (errors && errors.length > 0) {
                showErrorMessage(eleMessage, "" + errors[0].message)
              } else {
                showErrorMessage(eleMessage, resource.fail_authentication)
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
