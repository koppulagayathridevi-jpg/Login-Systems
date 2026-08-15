const adminOnly = (req, res, next) => {

    try {

        // Check whether authenticated user exists
        if (!req.user) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }

        // Check admin role
        if (req.user.role !== "admin") {

            return res.status(403).json({
                message: "Admin access required"
            });

        }

        // User is admin
        next();

    } catch (error) {

        console.error(
            "Admin Authorization Error:",
            error.message
        );

        return res.status(403).json({
            message: "Admin access denied"
        });

    }

};

module.exports = adminOnly;