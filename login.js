function validateLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("login-message");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    message.style.color = "red";
    message.textContent = "No user found. Please sign up first.";
    return false;
  }
  if (username === storedUser.username && password === storedUser.password) {
    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "home.html";
    },500);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid username or password.";
  }

  return false; 
}
