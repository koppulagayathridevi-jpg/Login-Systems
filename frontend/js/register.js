
const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


           

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


            

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "https://login-systems-backend-tlz3.onrender.com/api/register",
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