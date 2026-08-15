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

const protect = require("../middleware/authmiddleware");
const adminOnly = require("../middleware/adminMiddleware");


router.post(
    "/register",
    registerUser
);



// LOGIN
// ============================================

router.post(
    "/login",
    loginUser
);


router.get(
    "/users",
    getUsers
);



router.get(
    "/profile/:id",
    protect,
    getUserProfile
);


router.put(
    "/profile/:id",
    protect,
    updateUserProfile
);



router.delete(
    "/profile/:id",
    deleteUserAccount
);



router.get(
    "/admin/users",
    protect,
    adminOnly,
    getAdminUsers
);



router.get(
    "/admin/users/:id",
    protect,
    adminOnly,
    getAdminUserById
);


router.patch(
    "/admin/users/:id/status",
    protect,
    adminOnly,
    updateUserStatus
);
module.exports = router;