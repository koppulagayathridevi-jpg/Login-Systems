const express = require("express");

const router = express.Router();




const {
    registerUser,
    getUsers,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAdminUsers,
    getAdminUserById,
    updateUserStatus
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ============================================
// REGISTER
// ============================================

router.post(
    "/register",
    registerUser
);


// ============================================
// LOGIN
// ============================================

router.post(
    "/login",
    loginUser
);


// ============================================
// GET USERS
// ============================================

router.get(
    "/users",
    getUsers
);


// ============================================
// GET USER PROFILE
// ============================================
router.get(
    "/profile/:id",
    protect,
    getUserProfile
);
// ============================================
// UPDATE USER PROFILE
// ============================================

router.put(
    "/profile/:id",
    protect,
    updateUserProfile
);

// ============================================
// DELETE USER ACCOUNT
// ============================================

router.delete(
    "/profile/:id",
    deleteUserAccount
);


// ============================================
// ADMIN - GET ALL USERS
// ============================================

router.get(
    "/admin/users",
    protect,
    adminOnly,
    getAdminUsers
);

// ============================================
// ADMIN - GET SINGLE USER
// ============================================

router.get(
    "/admin/users/:id",
    protect,
    adminOnly,
    getAdminUserById
);
// ============================================
// ADMIN - ACTIVATE / DEACTIVATE USER
// ============================================

router.patch(
    "/admin/users/:id/status",
    protect,
    adminOnly,
    updateUserStatus
);
module.exports = router;