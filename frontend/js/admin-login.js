
// ============================================
// ADMIN LOGIN
// ============================================

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("adminUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("adminPassword")
                    .value
                    .trim();


            // ========================================
            // VALIDATION
            // ========================================

            if (
                username === "" ||
                password === ""
            ) {

                alert(
                    "Please enter username and password."
                );

                return;
            }


            try {

                // ========================================
                // LOGIN REQUEST
                // ========================================

                const response =
                    await fetch(
                        "https://login-systems-backend-tlz3.onrender.com/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email: username,
                                password: password

                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Admin login response:",
                    data
                );


                // ========================================
                // CHECK LOGIN
                // ========================================

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Invalid login credentials."
                    );

                    return;

                }


                // ========================================
                // CHECK ADMIN ROLE
                // ========================================

                if (
                    !data.user ||
                    data.user.role !== "admin"
                ) {

                    alert(
                        "Access denied. Admin account required."
                    );

                    return;

                }


                // ========================================
                // STORE AUTHENTICATION
                // ========================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                // ========================================
                // SUCCESS
                // ========================================

                alert(
                    "Admin login successful!"
                );


                window.location.href =
                    "admin-dashboard.html";


            } catch (error) {

                console.error(
                    "Admin Login Error:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}