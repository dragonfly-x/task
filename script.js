/* =====================================================================
   TaskMaster - script.js
   Concepts: DOM selection, events, arrays, objects, localStorage
   ===================================================================== */

   // ---Auth   Guard ---//
   const isLoginpage = window.location.pathname.includes("login.html");
   const isLoggedIn = localStorage.getItem("taskAppLoggedIn");

   if (!isLoggedIn && !isLoginpage) {
    //  not logged in   and not on login  page -> force to login
    window.location.href = "login.html";
   }

   if (isLoggedIn &&  isLoginpage) {
    // already logged in but trying to go to login ->  send to app
    window.location.href = "index.html";
   }
   // ---End Guard---//


"use strict"; // Strict mode catches common coding mistakes

/* ---------- 1. SELECT ELEMENTS FROM THE PAGE (DOM) ---------- */
const form          = document.getElementById("task-form");
const input         = document.getElementById("task-input");
const prioritySel   = document.getElementById("priority-select");
const list          = document.getElementById("task-list");
const emptyMsg      = document.getElementById("empty-message");
const stats         = document.getElementById("stats");
const clearBtn      = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");

/* ---------- 2. APPLICATION STATE ---------- */
// "tasks" is an array of objects: { id, text, priority, completed }
// We try to load saved tasks first; if none exist we start with [].
let tasks = loadTasks();
let currentFilter = "all"; // can be "all", "active" or "completed"

/* ---------- 3. LOCAL STORAGE (save data in the browser) ---------- */
function loadTasks() {
  const saved = localStorage.getItem("taskmaster-tasks"); // returns text or null
  return saved ? JSON.parse(saved) : [];  // JSON.parse: text -> array
}

function saveTasks() {
  // JSON.stringify: array -> text (localStorage can only store text)
  localStorage.setItem("taskmaster-tasks", JSON.stringify(tasks));
}

/* ---------- 4. ADD A TASK ---------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();              // stop the page from reloading

  const text = input.value.trim();     // trim removes extra spaces
  if (text === "") return;             // ignore empty tasks

  const newTask = {
    id: Date.now(),                    // unique number based on current time
    text: text,
    priority: prioritySel.value,
    completed: false
  };

  tasks.push(newTask);                 // add to the array
  saveTasks();                         // persist the change
  render();                            // redraw the screen

  form.reset();                        // clear the form
  prioritySel.value = "medium";        // restore default priority
  input.focus();                       // ready for the next task
});

/* ---------- 5. TOGGLE / DELETE (helper functions) ---------- */
function toggleTask(id) {
  // find the task with this id and flip its completed value
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  // filter keeps every task EXCEPT the one with this id
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

/* ---------- 6. FILTERS ---------- */
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;      // reads data-filter="..."

    // move the "active" highlight to the clicked button
    filterButtons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    render();
  });
});

function getVisibleTasks() {
  if (currentFilter === "active")    return tasks.filter(t => !t.completed);
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  return tasks;                              // "all"
}

/* ---------- 7. CLEAR COMPLETED ---------- */
clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(t => !t.completed);   // arrow function shorthand
  saveTasks();
  render();
});

/* ---------- 8. RENDER: build the list on screen ---------- */
function render() {
  list.innerHTML = "";                       // empty the list first

  const visible = getVisibleTasks();

  visible.forEach(function (task) {
    // create the <li> element
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " done" : "");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    // task text (textContent is SAFE: it never runs user HTML/JS)
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(task.id));

    // priority badge
    const badge = document.createElement("span");
    badge.className = "badge " + task.priority;
    badge.textContent = task.priority;

    // delete button
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "X";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => deleteTask(task.id));

    // put everything inside the <li>, then the <li> inside the <ul>
    li.append(checkbox, span, badge, del);
    list.appendChild(li);
  });

  // show or hide the "no tasks" message
  emptyMsg.hidden = visible.length > 0;

  // update the footer counter
  const left = tasks.filter(t => !t.completed).length;
  stats.textContent = left + (left === 1 ? " task left" : " tasks left");
}

/* ---------- 9. START THE APP ---------- */
render(); // draw saved tasks when the page first loads

//  --- Login Logic ---//
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit",(e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // add a temporary email and password
    if (email === "arthurtest1@gmail.com" && password ==="zigzagline") {
      localStorage.setItem("taskAppLoggedIn","true");
      localStorage.setItem("userEmail",email);
      window.location.href = "index.html";
    } else {
      alert("Invalid  login. Try arthurtest1@gmail.com / zigzagline");
    }
  });
}

// ---Logout Button (add this button in your index.html)---
// <button id="logoutBtn">Logout</button>
document.getElementById("logoutBtn")?.addEventListener("click",() => {
  localStorage.removeItem("taskAppLoggedIn");
  window.location.href ="login.html";
});