const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ============================================
// REGISTER USER
// ============================================

const registerUser = async (req, res) => {

    try {

        const {
            fullName,
            email,
            username,
            password
        } = req.body;


        // Check required fields

        if (
            !fullName ||
            !email ||
            !username ||
            !password
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // Check existing email

        const existingEmail =
            await User.findOne({
                email: email.toLowerCase().trim()
            });


        if (existingEmail) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        // Check existing username

        const existingUsername =
            await User.findOne({
                username: username.trim()
            });


        if (existingUsername) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user

        const user = await User.create({

            fullName: fullName.trim(),

            email: email.toLowerCase().trim(),

            username: username.trim(),

            password: hashedPassword

        });


        // Send response

        res.status(201).json({

            message: "Registration successful",

            user: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                username: user.username

            }

        });


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        res.status(500).json({

            message: "Server error"

        });

    }

};


// ============================================
// GET USERS
// ============================================

const getUsers = async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password");


        res.status(200).json(users);


    } catch (error) {

        console.error(
            "Fetch Users Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch users"

        });

    }

};

// ============================================
// USER LOGIN WITH JWT
// ============================================

const loginUser = async (req, res) => {

    try {
        console.log("========== LOGIN DEBUG ==========");
console.log("Email received:", req.body.email);
console.log("Password received:", req.body.password);

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });
        console.log("User found:", user ? "YES" : "NO");

if (user) {
    console.log("User ID:", user._id);
    console.log("User email:", user.email);
    console.log("User username:", user.username);
}


        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );
           

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // ========================================
        // CREATE JWT TOKEN
        // ========================================

const token = jwt.sign(
    {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

// ============================================
// SEND LOGIN RESPONSE
// ============================================

res.status(200).json({

    message: "Login successful",

    token: token,
user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    role: user.role
}

});


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            message: "Server error"

        });

    }

};

// ============================================
// GET USER PROFILE
// ============================================

const getUserProfile = async (req, res) => {

    try {

        const userId =
            req.params.id;


        const user =
            await User
                .findById(userId)
                .select("-password");


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        res.status(200).json({

            user: user

        });


    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get user profile"

        });

    }

};


// ============================================
// UPDATE USER PROFILE
// ============================================

const updateUserProfile = async (req, res) => {

    try {

        console.log(
            "PUT PROFILE REQUEST RECEIVED"
        );


        console.log(
            "User ID:",
            req.params.id
        );


        console.log(
            "Request body:",
            req.body
        );


        const userId =
            req.params.id;


        const {
            fullName,
            username
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !fullName ||
            !username
        ) {

            return res.status(400).json({

                message:
                    "Full name and username are required."

            });

        }


        // ========================================
        // FIND USER
        // ========================================

        const user =
            await User.findById(userId);


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found."

            });

        }


        // ========================================
        // CHECK USERNAME
        // ========================================

        const existingUsername =
            await User.findOne({

                username:
                    username.trim(),

                _id: {
                    $ne: userId
                }

            });


        if (existingUsername) {

            return res.status(400).json({

                message:
                    "Username already exists."

            });

        }


        // ========================================
        // UPDATE USER
        // ========================================

        user.fullName =
            fullName.trim();


        user.username =
            username.trim();


        await user.save();


        // ========================================
        // RETURN UPDATED USER
        // ========================================

        res.status(200).json({

            message:
                "Profile updated successfully.",

            user: {

                id: user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                username:
                    user.username

            }

        });


    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while updating profile."

        });

    }

};


// ============================================
// DELETE USER ACCOUNT
// ============================================

const deleteUserAccount = async (req, res) => {

    try {

        const userId = req.params.id;

        console.log("Delete request for user:", userId);


        // Find and delete user

        const deletedUser =
            await User.findByIdAndDelete(userId);


        // User not found

        if (!deletedUser) {

            return res.status(404).json({

                message: "User not found"

            });

        }


        // Success

        res.status(200).json({

            message:
                "Account deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Account Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete account"

        });

    }

};

// ============================================
// GET ALL USERS - ADMIN
// ============================================

const getAdminUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({

            message: "Users fetched successfully",

            users: users

        });

    } catch (error) {

        console.error(
            "Admin Fetch Users Error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch users"

        });

    }

};

// ============================================
// GET SINGLE USER - ADMIN
// ============================================

const getAdminUserById = async (req, res) => {

    try {

        const userId = req.params.id;

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json({

            message: "User fetched successfully",

            user: user

        });

    } catch (error) {

        console.error(
            "Admin Get User Error:",
            error
        );

        res.status(500).json({

            message: "Failed to fetch user"

        });

    }

};
// ============================================
// ACTIVATE / DEACTIVATE USER - ADMIN
// ============================================

const updateUserStatus = async (req, res) => {

    try {

        const userId = req.params.id;
        const { isActive } = req.body;

        // Validate status
        if (typeof isActive !== "boolean") {

            return res.status(400).json({
                message: "isActive must be true or false"
            });

        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        // Update status
        user.isActive = isActive;

        await user.save();

        // Response
        res.status(200).json({

            message: isActive
                ? "User activated successfully"
                : "User deactivated successfully",

            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                role: user.role,
                isActive: user.isActive
            }

        });

    } catch (error) {

        console.error(
            "Update User Status Error:",
            error
        );

        res.status(500).json({
            message: "Failed to update user status"
        });

    }

};


// ============================================
// EXPORT CONTROLLERS
// ============================================

module.exports = {

    registerUser,

    getUsers,

    loginUser,

    getUserProfile,

    updateUserProfile,
    deleteUserAccount,

    getAdminUsers,
    getAdminUserById,
    updateUserStatus
    
    
    
   

};