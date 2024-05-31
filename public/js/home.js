window.onload = init;

function init() {
  handleLoginButton();
  handleRegisterButton();
}

function handleLoginButton() {
  const loginButton = document.getElementById('loginButton');
  loginButton.onclick = function (e) {
    e.preventDefault();
    let loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();

    let tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  };
}

function handleRegisterButton() {
  const loginButton = document.getElementById('registerButton');
  loginButton.onclick = function (e) {
    e.preventDefault();
    let registerModal = new bootstrap.Modal(
      document.getElementById('registerModal'),
    );
    registerModal.show();

    let tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  };
}
