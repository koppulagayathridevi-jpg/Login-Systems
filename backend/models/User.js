// // const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema(
// //     {
// //         fullName: {
// //             type: String,
// //             required: true,
// //             trim: true
// //         },

// //         email: {
// //             type: String,
// //             required: true,
// //             unique: true,
// //             trim: true,
// //             lowercase: true
// //         },

// //         username: {
// //             type: String,
// //             required: true,
// //             unique: true,
// //             trim: true
// //         },

// //         password: {
// //             type: String,
// //             required: true
// //         }
// //     },
// //     {
// //         timestamps: true
// //     }
// // );

// // const User = mongoose.model("User", userSchema);

// // module.exports = User;

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//     {
//         fullName: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//             lowercase: true
//         },

//         username: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true
//         },

//         password: {
//             type: String,
//             required: true
//         },

//         // ============================================
//         // USER ROLE
//         // ============================================

//         role: {
//             type: String,
//             enum: ["user", "admin"],
//             default: "user"
//         }
//         // ============================================
// // USER ACTIVE STATUS
// // ============================================

//         isActive: {
//              type: Boolean,
//              default: true
//              }
//     },
//     {
//         timestamps: true
//     }
// );

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        // ============================================
        // USER ROLE
        // ============================================

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        // ============================================
        // USER ACTIVE STATUS
        // ============================================

        isActive: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;