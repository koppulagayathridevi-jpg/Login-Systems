// // ============================================
// // REGISTER FORM
// // ============================================

// console.log("register.js loaded successfully");

// const registerForm = document.getElementById("registerForm");

// console.log("Register form:", registerForm);


// if (registerForm) {

//     registerForm.addEventListener("submit", function (event) {

//         // Stop the form from refreshing the page
//         event.preventDefault();

//         console.log("Register button clicked");


//         // ============================================
//         // GET VALUES
//         // ============================================

//         const fullname =
//             document.getElementById("fullname").value.trim();

//         const email =
//             document.getElementById("email").value.trim();

//         const username =
//             document.getElementById("username").value.trim();

//         const password =
//             document.getElementById("password").value;

//         const confirmPassword =
//             document.getElementById("confirmPassword").value;


//         // ============================================
//         // VALIDATION
//         // ============================================

//         if (fullname === "") {

//             alert("Please enter your full name.");
//             return;

//         }


//         if (email === "") {

//             alert("Please enter your email.");
//             return;

//         }


//         if (username === "") {

//             alert("Please choose a username.");
//             return;

//         }


//         if (password === "") {

//             alert("Please enter your password.");
//             return;

//         }


//         if (password.length < 6) {

//             alert("Password must be at least 6 characters.");
//             return;

//         }


//         if (confirmPassword === "") {

//             alert("Please confirm your password.");
//             return;

//         }


//         if (password !== confirmPassword) {

//             alert("Passwords do not match.");
//             return;

//         }


//         // ============================================
//         // SUCCESS
//         // ============================================

//         alert("Registration successful!");


//         // Go to login page
//         window.location.href = "login.html";

//     });

// }

// ============================================
// REGISTER FORM
// ============================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get values

            const fullName =
                document
                    .getElementById("fullname")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            // Check passwords

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                fullName:
                                    fullName,

                                email:
                                    email,

                                username:
                                    username,

                                password:
                                    password

                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Registration failed."
                    );

                    return;

                }


                alert(
                    "Registration successful!"
                );


                // Go to login

                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );

                alert(
                    "Unable to connect to server."
                );

            }

        }
    );

}