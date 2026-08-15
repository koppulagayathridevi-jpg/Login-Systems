const adminOnly = (req, res, next) => {

    try {

      
        if (!req.user) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }

       
        if (req.user.role !== "admin") {

            return res.status(403).json({
                message: "Admin access required"
            });

        }

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