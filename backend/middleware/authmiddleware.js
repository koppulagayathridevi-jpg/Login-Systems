const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    try {

        // Get Authorization header
        const authHeader =
            req.headers.authorization;

        // Check header
        if (!authHeader) {

            return res.status(401).json({
                message: "No authorization token provided"
            });

        }

        // Check Bearer
        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Invalid authorization format"
            });

        }

        // Extract token
        const token =
            authHeader.split(" ")[1];

        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        // Save decoded user information
        req.user = decoded;

        // Continue
        next();

    } catch (error) {

        console.error(
            "JWT Authentication Error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};

module.exports = protect;