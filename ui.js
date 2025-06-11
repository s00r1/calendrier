export function showRequestError(msg) {
  const errorMessageDiv = document.getElementById('error-message');
  if (errorMessageDiv) {
    errorMessageDiv.textContent = msg;
  } else {
    alert(msg);
  }
}
