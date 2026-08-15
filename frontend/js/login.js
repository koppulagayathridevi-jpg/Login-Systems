

// ============================================
// USER LOGIN
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    // Stop if login form does not exist
    if (!loginForm) {
        return;
    }


    // ============================================
    // LOGIN FORM SUBMIT
    // ============================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // ============================================
        // GET FORM VALUES
        // ============================================

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");


        if (!emailInput || !passwordInput) {

            console.error("Email or password input not found.");

            return;
        }


        const email = emailInput.value.trim();
        const password = passwordInput.value;


        // ============================================
        // VALIDATION
        // ============================================

        if (!email || !password) {

            alert("Please enter email and password.");

            return;
        }


        // Basic email validation

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        try {

            console.log("================================");
            console.log("LOGIN STARTED");
            console.log("Email:", email);
            console.log("================================");


            // ============================================
            // CALL LOGIN API
            // ============================================

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // ============================================
            // READ SERVER RESPONSE
            // ============================================

            const data = await response.json();


            console.log("LOGIN RESPONSE:", data);
            console.log("STATUS:", response.status);


            // ============================================
            // LOGIN FAILED
            // ============================================

            if (!response.ok) {

                console.error(
                    "Login failed:",
                    data.message
                );

                alert(
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }


            // ============================================
            // CHECK JWT TOKEN
            // ============================================

            if (!data.token) {

                console.error(
                    "JWT token missing from server response."
                );

                alert(
                    "Login successful, but authentication token was not received."
                );

                return;
            }


            console.log(
                "JWT token received successfully."
            );


            // ============================================
            // CHECK USER DATA
            // ============================================

            if (!data.user) {

                console.error(
                    "User data missing from server response."
                );

                alert(
                    "Login successful, but user information was not received."
                );

                return;
            }


            console.log(
                "Logged-in user:",
                data.user
            );


            // ============================================
            // CLEAR OLD LOGIN DATA
            // ============================================

            localStorage.removeItem("token");
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("userLoggedIn");


            // ============================================
            // SAVE JWT TOKEN
            // ============================================

            localStorage.setItem(
                "token",
                data.token
            );


            // ============================================
            // SAVE LOGIN STATUS
            // ============================================

            localStorage.setItem(
                "userLoggedIn",
                "true"
            );


            // ============================================
            // SAVE USER INFORMATION
            // ============================================

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data.user)
            );


            // ============================================
            // VERIFY SAVED DATA
            // ============================================

            console.log(
                "Token saved:",
                localStorage.getItem("token")
            );

            console.log(
                "User saved:",
                JSON.parse(
                    localStorage.getItem("loggedInUser")
                )
            );


            // ============================================
            // SUCCESS MESSAGE
            // ============================================

            alert(
                "Login successful! Welcome " +
                (data.user.fullName ||
                 data.user.username ||
                 "User") +
                "!"
            );


            // ============================================
            // REDIRECT TO USER DASHBOARD
            // ============================================

            window.location.href =
                "user-dashboard.html";


        } catch (error) {

            // ============================================
            // NETWORK / SERVER ERROR
            // ============================================

            console.error(
                "LOGIN ERROR:",
                error
            );


            alert(
                "Unable to connect to the server. " +
                "Please make sure your backend is running."
            );

        }

    });

});