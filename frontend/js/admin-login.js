// // ============================================
// // ADMIN LOGIN
// // ============================================

// const adminLoginForm =
//     document.getElementById("adminLoginForm");


// if (adminLoginForm) {

//     adminLoginForm.addEventListener(
//         "submit",
//         function (event) {

//             event.preventDefault();


//             const username =
//                 document
//                     .getElementById("adminUsername")
//                     .value
//                     .trim();


//             const password =
//                 document
//                     .getElementById("adminPassword")
//                     .value
//                     .trim();


//             // Temporary admin credentials

//             const adminUsername = "Gayathri";

//             const adminPassword = "gayathri123";


//             if (
//                 username === "" ||
//                 password === ""
//             ) {

//                 alert(
//                     "Please enter username and password."
//                 );

//                 return;
//             }


//             if (
//                 username === adminUsername &&
//                 password === adminPassword
//             ) {

//                 localStorage.setItem(
//                     "adminLoggedIn",
//                     "true"
//                 );


//                 alert(
//                     "Admin login successful!"
//                 );


//                 window.location.href =
//                     "admin-dashboard.html";


//             } else {

//                 alert(
//                     "Invalid admin username or password."
//                 );

//             }

//         }
//     );

// }

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
                        "http://localhost:5000/api/login",
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