function loadPage(page) {
  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      lucide.createIcons();
      setupTaskHandlers();
    });
}

function toggleLayout(show) {
  const sidebar = document.querySelector(".sidebar");
  const authControls = document.querySelector(".auth-controls");
  if (sidebar) sidebar.style.display = show ? "flex" : "none";
  if (authControls) authControls.style.display = show ? "flex" : "none";
}

window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  if (isLoggedIn) {
    toggleLayout(true);
    loadPage("dashboard.html");
  } else {
    window.location.href = "login.html";
  }
});

document.addEventListener('click', function (e) {
  const link = e.target.closest('.nav-links a');
  if (link && link.hasAttribute('data-page')) {
    e.preventDefault();
    loadPage(link.getAttribute('data-page'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  }
});

// Helper: Current section
function detectSection() {
  const activeLink = document.querySelector('.nav-links a.active');
  if (!activeLink) return "";
  const href = activeLink.getAttribute("data-page") || "";
  if (href.includes("academy")) return "academy";
  if (href.includes("study")) return "study";
  if (href.includes("gaming")) return "gaming";
  if (href.includes("self-growth")) return "self";
  return "";
}

function getCurrentUserData() {
  const users = JSON.parse(localStorage.getItem("allUsers")) || {};
  const email = localStorage.getItem("currentUser");
  return users[email];
}

function saveUserData(updatedUser) {
  const allUsers = JSON.parse(localStorage.getItem("allUsers")) || {};
  const email = localStorage.getItem("currentUser");
  allUsers[email] = updatedUser;
  localStorage.setItem("allUsers", JSON.stringify(allUsers));
}

// Load tasks from user into UL
function loadTasks(section) {
  const user = getCurrentUserData();
  if (!user || !user.tasks || !user.tasks[section]) return;

  const list = document.getElementById("todo-list");
  if (!list) return;

  list.innerHTML = "";
  user.tasks[section].forEach(task => {
    const li = document.createElement("li");
    li.textContent = `${task.text} (${task.date} ${task.time})`;
    list.appendChild(li);
  });
}

// Add task
function handleAdd(section) {
  const input = document.getElementById("todo-input");
  const date = document.getElementById("task-date")?.value || new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const taskText = input?.value.trim();
  if (!taskText) return;

  const user = getCurrentUserData();
  if (!user || !section) return;

  user.tasks[section] = user.tasks[section] || [];
  user.tasks[section].push({ text: taskText, date, time });

  saveUserData(user);
  input.value = "";
  loadTasks(section);
}

// Remind for today’s tasks
function handleReminder(section) {
  const date = document.getElementById("task-date")?.value;
  const msg = document.getElementById("reminder-message");
  const user = getCurrentUserData();

  if (!date || !user || !section || !user.tasks[section]) {
    msg.textContent = "No tasks or invalid date.";
    return;
  }

  const count = user.tasks[section].filter(t => t.date === date).length;
  msg.textContent = count > 0
    ? `You have ${count} task(s) on ${date}`
    : `No tasks found on ${date}`;
}

// Call this after loading any content page
function setupTaskHandlers() {
  const section = detectSection();
  if (!section) return;

  loadTasks(section);

  const addBtn = document.getElementById("add-task-btn");
  if (addBtn) addBtn.onclick = () => handleAdd(section);

  const remindBtn = document.getElementById("remind-btn");
  if (remindBtn) remindBtn.onclick = () => handleReminder(section);
}
