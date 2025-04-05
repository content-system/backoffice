"use strict"
const resource = {
  msg_confirm_save: "Are you sure you want to save?",
  msg_save_success: "Data have been saved successfully.",
  error_undefined: "{0} is not allowed to exist.",
  error_exp: "{0} does not match the regular expression.",
  error_type: "Invalid datatype. Type of {0} cannot be {1}.",
  error_boolean: "{0} must be boolean.",
  error_strings: "{0} must be an string array.",
  error_numbers: "{0} must be an number array.",
  error_integers: "{0} must be an number array.",
  error_datetimes: "{0} must be an date time array.",
  error_dates: "{0} must be an date array.",
  error_required: "{0} is required.",
  error_minlength: "{0} cannot be less than {1} characters.",
  error_maxlength: "{0} cannot be greater than {1} characters.",
  error_email: "{0} is not a valid email address.",
  error_integer: "{0} is not a valid integer.",
  error_number: "{0} is not a valid number.",
  error_precision: "{0} has a valid precision. Precision must be less than or equal to {1}",
  error_scale: "{0} has a valid scale. Scale must be less than or equal to {1}",
  error_phone: "{0} is not a valid phone number.",
  error_fax: "{0} is not a valid fax number.",
  error_url: "{0} is not a valid URL.",
  error_ipv4: "{0} is not a valid ipv4.",
  error_ipv6: "{0} is not a valid ipv6.",
  error_digit: "{0} must contain digits only.",
  error_dash_digit: "{0} must contain digits and dash only.",
  error_code: "{0} must contain characters and digits only.",
  error_dash_code: "{0} must contain characters and digits and dash only.",
  error_routing_number: "{0} is not a valid routing number.",
  error_check_number: "{0} is not a valid check number.",
  error_post_code: "{0} is not a valid post code.",
  error_ca_post_code: "{0} is not a valid Canada post code.",
  error_us_post_code: "{0} is not a valid US post code.",
  error_min: "{0} must be greater than or equal to {1}.",
  error_max: "{0} must be less than or equal to {1}.",
  error_gt: "{0} must be greater than {1}.",
  error_lt: "{0} must be less than {1}.",
  error_equal: "{0} must be equal to {1}.",
  error_date: "{0} is not a valid date.",
  error_min_date: "{0} cannot be before {1}.",
  error_max_date: "{0} cannot be after {1}.",
  error_from_now: "{0} must be after now.",
  error_from_tomorrow: "{0} must be from tomorrow.",
  error_from: "{0} must be after {1}.",
  error_after_now: "{0} cannot be after now.",
  error_after_tomorrow: "{0} cannot be after tomorrow.",
  error_after: "{0} cannot be after {1}.",
  error_400: "The server will not process the request due to the malformed request syntax.",
  error_403: "You do not have permission for this page or for this action.",
  error_404: "The page is not found.",
  error_409: "Request could not be processed because of conflict in the current state of the resource.",
  error_submit_failed: "Failed to submit data.",
  error_submitting_form: "An error occurred while submitting the form.",
}
function getResource() {
  return resource
}
