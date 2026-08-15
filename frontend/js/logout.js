// ============================================
// USER LOGOUT
// ============================================

console.log("logout.js loaded successfully");


const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmLogout =
            confirm("Are you sure you want to logout?");


        if (confirmLogout) {

            alert("You have been logged out.");

            window.location.href = "login.html";

        }

    });

}