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
      alert("Invalid  login. Try again");
    }
  });
}

// ---Logout Button (add this button in your index.html)---
// <button id="logoutBtn">Logout</button>
document.getElementById("logoutBtn")?.addEventListener("click",() => {
  localStorage.removeItem("taskAppLoggedIn");
  window.location.href ="login.html";
});