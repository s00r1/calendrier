export function showRequestError(msg) {
  const errorMessageDiv = document.getElementById('error-message');
  if (errorMessageDiv) {
    const item = document.createElement('div');
    item.className = 'error-item';
    const label = document.createElement('span');
    label.textContent = msg;
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.className = 'error-close';
    close.addEventListener('click', () => item.remove());
    item.appendChild(label);
    item.appendChild(close);
    errorMessageDiv.appendChild(item);
  } else {
    alert(msg);
  }
}
