"use strict"
function editUserInterests(target) {
  var url = getCurrentURL() + "/interests_update"
  var container = document.getElementById("userInterests")
  var form = target.form
  if (container) {
    showLoading()
    loadAjax(
      url,
      container,
      function () {
        hideLoading()
        hideOtherElements(form, target, "btn-edit")
      },
      hideLoading,
    )
  }
}
function closeUserInterests(target) {
  var url = getCurrentURL() + "/interests"
  var container = document.getElementById("userInterests")
  var form = target.form
  if (container) {
    showLoading()
    loadAjax(
      url,
      container,
      function () {
        hideLoading()
        showOtherElements(form, target, "btn-edit")
      },
      hideLoading,
    )
  }
}
