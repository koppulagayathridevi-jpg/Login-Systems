
// ============================================
// CHECK ADMIN LOGIN
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const adminLoggedIn =
        localStorage.getItem("adminLoggedIn");


    if (adminLoggedIn !== "true") {

        alert(
            "Unauthorized access. Please login as admin."
        );

        window.location.href =
            "admin-login.html";

        return;

    }


    console.log(
        "Admin authentication verified."
    );


    // Load users

    loadUsers();

});



// ============================================
// LOAD ALL USERS
// ============================================

async function loadUsers() {

    const tableBody =
        document.getElementById(
            "usersTableBody"
        );


    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    if (!tableBody) {

        console.error(
            "usersTableBody not found."
        );

        return;

    }


    try {

        console.log(
            "Fetching users from MongoDB..."
        );


        const response =
            await fetch(
                "https://login-systems-backend-tlz3.onrender.com/api/users"
            );


        console.log(
            "Users API status:",
            response.status
        );


        const data =
            await response.json();


        console.log(
            "Users received:",
            data
        );


        // Check API response

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load users"
            );

        }


        // ========================================
        // TOTAL USERS
        // ========================================

        if (totalUsers) {

            totalUsers.textContent =
                data.length;

        }


        // ========================================
        // NO USERS
        // ========================================

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="loading-users"
                    >
                        No registered users found.
                    </td>

                </tr>

            `;

            return;

        }

// ========================================
// DISPLAY USERS
// ========================================

tableBody.innerHTML =
    data.map(function (user) {

        // Existing users without isActive
        // should be treated as active
        const isActive =
            user.isActive !== false;


        // Status badge

        const statusBadge =
            isActive

                ? `
                    <span class="user-status active">
                        🟢 Active
                    </span>
                  `

                : `
                    <span class="user-status inactive">
                        🔴 Inactive
                    </span>
                  `;


        // Admin cannot be deactivated

        const statusButton =
            user.role === "admin"

                ? `
                    <span class="admin-status">
                        🔐 Admin
                    </span>
                  `

                : isActive

                    ? `
                        <button
                            type="button"
                            class="status-btn deactivate-user-btn"
                            data-id="${user._id}"
                            data-status="false"
                        >
                            Deactivate
                        </button>
                      `

                    : `
                        <button
                            type="button"
                            class="status-btn activate-user-btn"
                            data-id="${user._id}"
                            data-status="true"
                        >
                            Activate
                        </button>
                      `;


        return `

            <tr>

                <td>
                    ${user.fullName || "N/A"}
                </td>

                <td>
                    ${user.email || "N/A"}
                </td>

                <td>
                    ${user.username || "N/A"}
                </td>

                <td>

                    <span class="user-role">
                        ${user.role || "user"}
                    </span>

                </td>

                <td>
                    ${statusBadge}
                </td>

                <td>

                    <button
                        type="button"
                        class="view-user-btn"
                        data-id="${user._id}"
                    >
                        👁️ View
                    </button>

                    ${statusButton}

                </td>

            </tr>

        `;

    }).join("");


        console.log(
            "Users displayed successfully."
        );


    } catch (error) {

        console.error(
            "Load users error:",
            error
        );


        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="loading-users"
                >
                    ❌ Unable to load users.
                </td>

            </tr>

        `;

    }

}



// ============================================
// SEARCH USERS
// ============================================

const searchUser =
    document.getElementById(
        "searchUser"
    );


if (searchUser) {

    searchUser.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            const rows =
                document.querySelectorAll(
                    "#usersTableBody tr"
                );


            rows.forEach(function (row) {

                const rowText =
                    row.textContent
                        .toLowerCase();


                if (
                    rowText.includes(
                        searchValue
                    )
                ) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            });

        }
    );

}



// ============================================
// ADMIN LOGOUT
// ============================================

function adminLogout() {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {

        return;

    }


    localStorage.removeItem(
        "adminLoggedIn"
    );


    alert(
        "Admin logged out successfully."
    );


    window.location.href =
        "admin-login.html";

}

// ============================================
// USER DETAILS MODAL
// ============================================

const userDetailsModal =
    document.getElementById(
        "userDetailsModal"
    );


const closeUserModal =
    document.getElementById(
        "closeUserModal"
    );


const closeUserModalBtn =
    document.getElementById(
        "closeUserModalBtn"
    );


// ============================================
// OPEN USER DETAILS
// ============================================

document.addEventListener(
    "click",
    async function (event) {

        const viewButton =
            event.target.closest(
                ".view-user-btn"
            );


        if (!viewButton) {

            return;

        }


        const userId =
            viewButton.dataset.id;


        if (!userId) {

            console.error(
                "User ID not found."
            );

            return;

        }


        await showUserDetails(userId);

    }
);



// ============================================
// GET USER DETAILS
// ============================================

async function showUserDetails(userId) {

    try {

        console.log(
            "Loading user:",
            userId
        );


        // Show modal

        if (userDetailsModal) {

            userDetailsModal.style.display =
                "flex";

        }


        // Show loading

        document.getElementById(
            "modalFullName"
        ).textContent = "Loading...";


        document.getElementById(
            "modalEmail"
        ).textContent = "Loading...";


        document.getElementById(
            "modalUsername"
        ).textContent = "Loading...";


        document.getElementById(
            "modalUserId"
        ).textContent = "Loading...";


        document.getElementById(
            "modalCreatedAt"
        ).textContent = "Loading...";

    
        // ========================================
        // FETCH USER
        // ========================================

        const response =
            await fetch(`https://login-systems-backend-tlz3.onrender.com/api/admin/users/${userId}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    }
})
          

        const data =
            await response.json();


        console.log(
            "User details:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to get user"
            );

        }


        const user =
            data.user;


        // ========================================
        // DISPLAY DATA
        // ========================================

        document.getElementById(
            "modalFullName"
        ).textContent =
            user.fullName || "N/A";


        document.getElementById(
            "modalEmail"
        ).textContent =
            user.email || "N/A";


        document.getElementById(
            "modalUsername"
        ).textContent =
            user.username || "N/A";


        document.getElementById(
            "modalUserId"
        ).textContent =
            user._id || "N/A";


        // Format date

        if (user.createdAt) {

            const date =
                new Date(user.createdAt);


            document.getElementById(
                "modalCreatedAt"
            ).textContent =
                date.toLocaleString();

        } else {

            document.getElementById(
                "modalCreatedAt"
            ).textContent =
                "N/A";

        }


    } catch (error) {

        console.error(
            "User details error:",
            error
        );


        if (userDetailsModal) {

            userDetailsModal.style.display =
                "none";

        }


        alert(
            "Unable to load user details."
        );

    }

}



// ============================================
// CLOSE MODAL
// ============================================

function closeUserDetailsModal() {

    if (userDetailsModal) {

        userDetailsModal.style.display =
            "none";

    }

}


if (closeUserModal) {

    closeUserModal.addEventListener(
        "click",
        closeUserDetailsModal
    );

}


if (closeUserModalBtn) {

    closeUserModalBtn.addEventListener(
        "click",
        closeUserDetailsModal
    );

}



// ============================================
// CLOSE WHEN CLICKING OUTSIDE
// ============================================

if (userDetailsModal) {

    userDetailsModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                userDetailsModal
            ) {

                closeUserDetailsModal();

            }

        }
    );

}



// ============================================
// CLOSE WITH ESCAPE KEY
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            userDetailsModal &&
            userDetailsModal.style.display === "flex"
        ) {

            closeUserDetailsModal();

        }

    }
);

// ============================================
// ACTIVATE / DEACTIVATE USER
// ============================================

document.addEventListener(
    "click",
    async function (event) {

        const statusButton =
            event.target.closest(
                ".activate-user-btn, .deactivate-user-btn"
            );


        if (!statusButton) {

            return;

        }


        const userId =
            statusButton.dataset.id;


        const newStatus =
            statusButton.dataset.status === "true";


        if (!userId) {

            console.error(
                "User ID not found."
            );

            return;

        }


        // ========================================
        // CONFIRM ACTION
        // ========================================

        const action =
            newStatus
                ? "activate"
                : "deactivate";


        const confirmAction =
            confirm(
                `Are you sure you want to ${action} this user?`
            );


        if (!confirmAction) {

            return;

        }


        try {

            // Disable button while processing

            statusButton.disabled = true;

            statusButton.textContent =
                "Updating...";


            // ====================================
            // UPDATE USER STATUS
            // ====================================

            const response =
                await fetch(
                    `https://login-systems-backend-tlz3.onrender.com/api/admin/users/${userId}/status`,
                    {
                        method: "PATCH",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${localStorage.getItem("token")}`

                        },

                        body:
                            JSON.stringify({
                                isActive: newStatus
                            })

                    }
                );


            const data =
                await response.json();


            console.log(
                "Status update response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update user status"
                );

            }


            // ====================================
            // SUCCESS
            // ====================================

            alert(
                data.message
            );


            // Reload users

            await loadUsers();


        } catch (error) {

            console.error(
                "Update user status error:",
                error
            );


            alert(
                error.message ||
                "Unable to update user status."
            );


            // Restore button

            statusButton.disabled = false;

        }

    }
);