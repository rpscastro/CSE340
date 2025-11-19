// script.js
function togglePassword() {
  const passwordInput = document.getElementById("password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

function validatePassword() {
  const password = document.getElementById("password").value;
  const minLength = /.{12,}/;
  const hasUpper = /[A-Z]/;
  const hasNumber = /[0-9]/;
  const hasSpecial = /[^A-Za-z0-9]/;

  if (
    !minLength.test(password) ||
    !hasUpper.test(password) ||
    !hasNumber.test(password) ||
    !hasSpecial.test(password)
  ) {
    alert("A senha não atende aos requisitos.");
    return false;
  }

  return true;
}