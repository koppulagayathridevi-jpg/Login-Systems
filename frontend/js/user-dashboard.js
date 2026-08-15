
// ============================================================
// USER DASHBOARD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // CONFIGURATION
    // ========================================================
    const API_BASE_URL = "https://login-systems-backend-tlz3.onrender.com/api";


    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const userLoggedIn =
        localStorage.getItem("userLoggedIn");

    const token =
        localStorage.getItem("token");

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    console.log("=================================");
    console.log("USER DASHBOARD");
    console.log("=================================");
    console.log("Logged in:", userLoggedIn);
    console.log("Token exists:", !!token);
    console.log("Saved user:", loggedInUser);


    // --------------------------------------------------------
    // Check login status
    // --------------------------------------------------------

    if (
        userLoggedIn !== "true" ||
        !token ||
        !loggedInUser
    ) {

        console.warn(
            "User authentication information missing."
        );

        alert(
            "Your session has expired. Please login again."
        );

        window.location.href =
            "login.html";

        return;
    }


    // ========================================================
    // GET USER FROM LOCAL STORAGE
    // ========================================================

    let user;

    try {

        user =
            JSON.parse(loggedInUser);

    } catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }


    // ========================================================
    // GET USER ID
    // ========================================================

    const userId =
        user.id ||
        user._id;


    console.log("User object:", user);
    console.log("User ID:", userId);


    if (!userId) {

        console.error(
            "User ID not found."
        );

        alert(
            "Unable to identify your account. Please login again."
        );

        localStorage.clear();

        window.location.href =
            "login.html";

        return;
    }


    // ========================================================
    // DOM ELEMENTS
    // ========================================================

    const welcomeHeading =
        document.querySelector(
            ".welcome-card h1"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileUsername =
        document.getElementById(
            "profileUsername"
        );


    const profileId =
        document.getElementById(
            "profileId"
        );


    const editProfileBtn =
        document.getElementById(
            "editProfileBtn"
        );


    const editProfileForm =
        document.getElementById(
            "editProfileForm"
        );


    const cancelEditBtn =
        document.getElementById(
            "cancelEditBtn"
        );


    const saveProfileBtn =
        document.getElementById(
            "saveProfileBtn"
        );


    const deleteAccountBtn =
        document.getElementById(
            "deleteAccountBtn"
        );


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    // ========================================================
    // API HEADERS
    // ========================================================

    function getAuthHeaders() {

        return {

            "Content-Type":
                "application/json",

            "Authorization":
                `Bearer ${token}`

        };

    }


    // ========================================================
    // HANDLE UNAUTHORIZED RESPONSE
    // ========================================================

    function handleUnauthorized() {

        console.warn(
            "Authentication failed."
        );

        localStorage.removeItem(
            "userLoggedIn"
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        localStorage.removeItem(
            "token"
        );

        alert(
            "Your login session has expired. Please login again."
        );

        window.location.href =
            "login.html";
    }


    // ========================================================
    // DISPLAY WELCOME MESSAGE
    // ========================================================

    function displayWelcome(profile) {

        if (!welcomeHeading) {
            return;
        }


        const name =
            profile.fullName ||
            user.fullName ||
            profile.username ||
            "User";


        welcomeHeading.textContent =
            `Welcome Back, ${name}!`;
    }


    // ========================================================
    // DISPLAY PROFILE
    // ========================================================

    function displayProfile(profile) {

        if (profileName) {

            profileName.textContent =
                profile.fullName ||
                "Not available";
        }


        if (profileEmail) {

            profileEmail.textContent =
                profile.email ||
                "Not available";
        }


        if (profileUsername) {

            profileUsername.textContent =
                profile.username ||
                "Not available";
        }


        if (profileId) {

            profileId.textContent =
                profile._id ||
                profile.id ||
                userId ||
                "Not available";
        }


        displayWelcome(profile);


        console.log(
            "Profile displayed successfully."
        );
    }


    // ========================================================
    // LOAD USER PROFILE
    // ========================================================

    async function loadUserProfile() {

        try {

            const profileURL =
                `${API_BASE_URL}/profile/${userId}`;


            console.log(
                "Profile URL:",
                profileURL
            );


            console.log(
                "Sending authorization token..."
            );


            const response =
                await fetch(
                    profileURL,
                    {
                        method: "GET",

                        headers:
                            getAuthHeaders()
                    }
                );


            console.log(
                "Profile response status:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "Profile response:",
                data
            );


            // ------------------------------------------------
            // Unauthorized
            // ------------------------------------------------

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                handleUnauthorized();

                return;
            }


            // ------------------------------------------------
            // Other errors
            // ------------------------------------------------

            if (!response.ok) {

                console.error(
                    "Profile loading failed:",
                    data.message
                );

                alert(
                    data.message ||
                    "Unable to load user profile."
                );

                return;
            }


            // ------------------------------------------------
            // Get profile
            // ------------------------------------------------

            const profile =
                data.user ||
                data;


            console.log(
                "Profile from MongoDB:",
                profile
            );


            displayProfile(profile);


            // ------------------------------------------------
            // Update localStorage
            // ------------------------------------------------

            const updatedUser = {

                ...user,

                id:
                    profile._id ||
                    profile.id ||
                    userId,

                _id:
                    profile._id ||
                    profile.id ||
                    userId,

                fullName:
                    profile.fullName,

                email:
                    profile.email,

                username:
                    profile.username

            };


            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(updatedUser)
            );


            // Update local variable

            user = updatedUser;


        } catch (error) {

            console.error(
                "Profile fetch error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    }


    // ========================================================
    // EDIT PROFILE
    // ========================================================

    if (editProfileBtn) {

        editProfileBtn.addEventListener(
            "click",
            function () {

                // --------------------------------------------
                // Get current profile values
                // --------------------------------------------

                const currentName =
                    profileName
                        ? profileName.textContent
                        : user.fullName || "";


                const currentUsername =
                    profileUsername
                        ? profileUsername.textContent
                        : user.username || "";


                // --------------------------------------------
                // Get input fields
                // --------------------------------------------

                const editFullName =
                    document.getElementById(
                        "editFullName"
                    );


                const editUsername =
                    document.getElementById(
                        "editUsername"
                    );


                // --------------------------------------------
                // Fill form
                // --------------------------------------------

                if (editFullName) {

                    editFullName.value =
                        currentName;
                }


                if (editUsername) {

                    editUsername.value =
                        currentUsername;
                }


                // --------------------------------------------
                // Show form
                // --------------------------------------------

                if (editProfileForm) {

                    editProfileForm.style.display =
                        "block";
                }


                // --------------------------------------------
                // Hide edit button
                // --------------------------------------------

                editProfileBtn.style.display =
                    "none";
            }
        );
    }


    // ========================================================
    // CANCEL EDIT
    // ========================================================

    if (cancelEditBtn) {

        cancelEditBtn.addEventListener(
            "click",
            function () {

                if (editProfileForm) {

                    editProfileForm.style.display =
                        "none";
                }


                if (editProfileBtn) {

                    editProfileBtn.style.display =
                        "inline-block";
                }
            }
        );
    }


    // ========================================================
    // SAVE PROFILE
    // ========================================================

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            async function () {

                const editFullName =
                    document.getElementById(
                        "editFullName"
                    );


                const editUsername =
                    document.getElementById(
                        "editUsername"
                    );


                const newFullName =
                    editFullName
                        ? editFullName.value.trim()
                        : "";


                const newUsername =
                    editUsername
                        ? editUsername.value.trim()
                        : "";


                // --------------------------------------------
                // Validation
                // --------------------------------------------

                if (
                    newFullName === "" ||
                    newUsername === ""
                ) {

                    alert(
                        "Please fill in all fields."
                    );

                    return;
                }


                // --------------------------------------------
                // Disable button
                // --------------------------------------------

                saveProfileBtn.disabled =
                    true;

                saveProfileBtn.textContent =
                    "Saving...";


                try {

                    const profileURL =
                        `${API_BASE_URL}/profile/${userId}`;


                    console.log(
                        "Updating profile:",
                        profileURL
                    );


                    const response =
                        await fetch(
                            profileURL,
                            {
                                method: "PUT",

                                headers:
                                    getAuthHeaders(),

                                body:
                                    JSON.stringify({

                                        fullName:
                                            newFullName,

                                        username:
                                            newUsername

                                    })
                            }
                        );


                    console.log(
                        "Update status:",
                        response.status
                    );


                    const data =
                        await response.json();


                    console.log(
                        "Update response:",
                        data
                    );


                    // ----------------------------------------
                    // Unauthorized
                    // ----------------------------------------

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        handleUnauthorized();

                        return;
                    }


                    // ----------------------------------------
                    // Other error
                    // ----------------------------------------

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Profile update failed."
                        );

                        return;
                    }


                    // ----------------------------------------
                    // Get updated user
                    // ----------------------------------------

                    const updatedProfile =
                        data.user ||
                        data;


                    // ----------------------------------------
                    // Update display
                    // ----------------------------------------

                    displayProfile(
                        updatedProfile
                    );


                    // ----------------------------------------
                    // Update localStorage
                    // ----------------------------------------

                    const updatedUser = {

                        ...user,

                        id:
                            updatedProfile._id ||
                            updatedProfile.id ||
                            userId,

                        _id:
                            updatedProfile._id ||
                            updatedProfile.id ||
                            userId,

                        fullName:
                            updatedProfile.fullName,

                        email:
                            updatedProfile.email,

                        username:
                            updatedProfile.username

                    };


                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify(updatedUser)
                    );


                    user =
                        updatedUser;


                    // ----------------------------------------
                    // Close edit form
                    // ----------------------------------------

                    if (editProfileForm) {

                        editProfileForm.style.display =
                            "none";
                    }


                    if (editProfileBtn) {

                        editProfileBtn.style.display =
                            "inline-block";
                    }


                    alert(
                        "Profile updated successfully! 🎉"
                    );


                } catch (error) {

                    console.error(
                        "Update profile error:",
                        error
                    );

                    alert(
                        "Unable to update profile. Please try again."
                    );


                } finally {

                    saveProfileBtn.disabled =
                        false;

                    saveProfileBtn.textContent =
                        "💾 Save Changes";
                }
            }
        );
    }


    // ========================================================
    // DELETE ACCOUNT
    // ========================================================

    if (deleteAccountBtn) {

        deleteAccountBtn.addEventListener(
            "click",
            async function () {

                // --------------------------------------------
                // First confirmation
                // --------------------------------------------

                const confirmDelete =
                    confirm(
                        "Are you sure you want to permanently delete your account?"
                    );


                if (!confirmDelete) {

                    return;
                }


                // --------------------------------------------
                // Second confirmation
                // --------------------------------------------

                const finalConfirmation =
                    confirm(
                        "This action cannot be undone. Do you really want to delete your account?"
                    );


                if (!finalConfirmation) {

                    return;
                }


                // --------------------------------------------
                // Disable button
                // --------------------------------------------

                deleteAccountBtn.disabled =
                    true;

                deleteAccountBtn.textContent =
                    "Deleting...";


                try {

                    const profileURL =
                        `${API_BASE_URL}/profile/${userId}`;


                    console.log(
                        "Deleting account:",
                        profileURL
                    );


                    const response =
                        await fetch(
                            profileURL,
                            {
                                method: "DELETE",

                                headers:
                                    getAuthHeaders()
                            }
                        );


                    console.log(
                        "Delete status:",
                        response.status
                    );


                    const data =
                        await response.json();


                    console.log(
                        "Delete response:",
                        data
                    );


                    // ----------------------------------------
                    // Unauthorized
                    // ----------------------------------------

                    if (
                        response.status === 401 ||
                        response.status === 403
                    ) {

                        handleUnauthorized();

                        return;
                    }


                    // ----------------------------------------
                    // Error
                    // ----------------------------------------

                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Unable to delete account."
                        );

                        return;
                    }


                    // ----------------------------------------
                    // Success
                    // ----------------------------------------

                    alert(
                        "Your account has been deleted successfully."
                    );


                    // ----------------------------------------
                    // Clear login information
                    // ----------------------------------------

                    localStorage.removeItem(
                        "userLoggedIn"
                    );

                    localStorage.removeItem(
                        "loggedInUser"
                    );

                    localStorage.removeItem(
                        "token"
                    );


                    // ----------------------------------------
                    // Redirect
                    // ----------------------------------------

                    window.location.href =
                        "register.html";


                } catch (error) {

                    console.error(
                        "Delete account error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );


                } finally {

                    deleteAccountBtn.disabled =
                        false;

                    deleteAccountBtn.textContent =
                        "🗑️ Delete Account";
                }
            }
        );
    }


    // ========================================================
    // LOGOUT
    // ========================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {

                    return;
                }


                // --------------------------------------------
                // Clear authentication
                // --------------------------------------------

                localStorage.removeItem(
                    "userLoggedIn"
                );

                localStorage.removeItem(
                    "loggedInUser"
                );

                localStorage.removeItem(
                    "token"
                );


                alert(
                    "You have been logged out successfully."
                );


                window.location.href =
                    "login.html";
            }
        );
    }


    // ========================================================
    // LOAD PROFILE
    // ========================================================

    loadUserProfile();

});